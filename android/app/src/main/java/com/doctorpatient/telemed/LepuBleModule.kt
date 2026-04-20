package com.doctorpatient.telemed

import android.app.Application
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.jeremyliao.liveeventbus.LiveEventBus
import com.lepu.blepro.event.EventMsgConst
import com.lepu.blepro.event.InterfaceEvent
import com.lepu.blepro.ext.BleServiceHelper
import com.lepu.blepro.ext.pc303.BpResult
import com.lepu.blepro.objs.Bluetooth

class LepuBleModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  private val logTag = "LepuBleModule"
  private val mainHandler = Handler(Looper.getMainLooper())
  private var connectedModel: Int = -1
  private var observersBound = false
  private var scanning = false
  private val foundDevices = linkedMapOf<String, DeviceEntry>()

  private data class DeviceEntry(val name: String, val address: String, val rssi: Int)

  override fun getName(): String = "LepuBle"

  private val bluetoothAdapter: BluetoothAdapter? by lazy {
    val manager = reactContext.getSystemService(BluetoothManager::class.java)
    manager?.adapter
  }

  private fun emit(eventName: String, params: com.facebook.react.bridge.WritableMap?) {
    mainHandler.post {
      runCatching {
        reactApplicationContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit(eventName, params)
      }
    }
  }

  private fun emitDeviceList() {
    val arr = Arguments.createArray()
    foundDevices.values.forEach { d ->
      arr.pushMap(
        Arguments.createMap().apply {
          putString("name", d.name)
          putString("address", d.address)
          putInt("rssi", d.rssi)
        }
      )
    }
    emit(
      "onDeviceListUpdate",
      Arguments.createMap().apply {
        putBoolean("scanning", scanning)
        putArray("devices", arr)
      }
    )
  }

  private val scanCallback =
    object : ScanCallback() {
      override fun onScanResult(callbackType: Int, result: ScanResult) {
        val address = result.device.address ?: return
        val name = result.device.name ?: result.scanRecord?.deviceName ?: "Unknown Device"
        if (!isSpotCheckMonitorName(name)) return
        foundDevices[address] = DeviceEntry(name, address, result.rssi)
        emitDeviceList()
      }
    }

  @ReactMethod
  fun addListener(eventName: String) {}

  @ReactMethod
  fun removeListeners(count: Int) {}

  @ReactMethod
  fun startScan() {
    val adapter = bluetoothAdapter ?: return
    if (!adapter.isEnabled) {
      @Suppress("DEPRECATION")
      adapter.enable()
    }
    ensureLepuReady()
    foundDevices.clear()
    scanning = true
    emitDeviceList()
    adapter.bluetoothLeScanner?.startScan(scanCallback)
  }

  @ReactMethod
  fun stopScan() {
    bluetoothAdapter?.bluetoothLeScanner?.stopScan(scanCallback)
    scanning = false
    emitDeviceList()
  }

  @ReactMethod
  fun connect(deviceName: String, deviceAddress: String, promise: Promise) {
    val adapter = bluetoothAdapter ?: run {
      promise.reject("E_BLE", "Bluetooth adapter unavailable")
      return
    }
    ensureLepuReady()
    val model = Bluetooth.getDeviceModel(deviceName)
    val remoteDevice =
      runCatching { adapter.getRemoteDevice(deviceAddress) }.getOrNull() ?: run {
        promise.reject("E_BLE", "Invalid device address")
        return
      }
    connectedModel = model
    stopScan()
    BleServiceHelper.BleServiceHelper.setInterfaces(model)
    val app = reactApplicationContext.applicationContext as Application
    BleServiceHelper.BleServiceHelper.connect(app, model, remoteDevice)
    emit(
      "onConnectionProgress",
      Arguments.createMap().apply {
        putBoolean("connecting", true)
        putString("address", deviceAddress)
      }
    )
    promise.resolve(null)
  }

  @ReactMethod
  fun disconnect(rescan: Boolean, promise: Promise) {
    BleServiceHelper.BleServiceHelper.disconnect(false)
    emit(
      "onConnected",
      Arguments.createMap().apply {
        putBoolean("connected", false)
        putInt("model", -1)
      }
    )
    if (rescan) startScan()
    promise.resolve(null)
  }

  @ReactMethod
  fun startBloodPressure(promise: Promise) {
    if (connectedModel == -1) {
      promise.reject("E_BLE", "Not connected")
      return
    }
    ensureLepuReady()
    Log.d(logTag, "startBloodPressure model=$connectedModel")
    BleServiceHelper.BleServiceHelper.pc300StartBp(connectedModel)
    promise.resolve(null)
  }

  private fun ensureLepuReady() {
    if (BleServiceHelper.BleServiceHelper.checkService()) {
      bindObserversOnce()
      return
    }
    val app = reactApplicationContext.applicationContext as Application
    BleServiceHelper.BleServiceHelper.initService(app)
    bindObserversOnce()
  }

  private fun bindObserversOnce() {
    if (observersBound) return
    observersBound = true

    LiveEventBus.get<Boolean>(EventMsgConst.Ble.EventServiceConnectedAndInterfaceInit).observeForever {}

    LiveEventBus.get<Int>(EventMsgConst.Ble.EventBleDeviceReady).observeForever { model ->
      connectedModel = model
      emit(
        "onConnected",
        Arguments.createMap().apply {
          putBoolean("connected", true)
          putInt("model", model)
        }
      )
    }

    LiveEventBus.get<Int>(EventMsgConst.Ble.EventBleDeviceDisconnectReason).observeForever {
      emit(
        "onConnected",
        Arguments.createMap().apply {
          putBoolean("connected", false)
          putInt("model", -1)
        }
      )
    }

    LiveEventBus.get<InterfaceEvent>(InterfaceEvent.PC300.EventPc300BpResult).observeForever { event ->
      val data = event.data as? BpResult ?: return@observeForever
      emit(
        "onBpResult",
        Arguments.createMap().apply {
          putInt("systolic", data.sys)
          putInt("diastolic", data.dia)
          putInt("pulseRate", data.pr)
        }
      )
    }
  }
}

private fun isSpotCheckMonitorName(deviceName: String): Boolean {
  val model = Bluetooth.getDeviceModel(deviceName)
  val resolvedName = Bluetooth.getDeviceName(model).lowercase()
  val raw = deviceName.lowercase()
  val families =
    listOf("pc102", "pc80b", "pc60fw", "ap20", "pod1w", "pc68b", "checkme", "pc303", "pc_300snt", "pc-300snt", "bbsm")
  val familyMatch = families.any { raw.contains(it) || resolvedName.contains(it) }
  val lepuLike = raw.startsWith("pc-") || raw.startsWith("pc_") || raw.contains("checkme") || raw.contains("bbsm") || raw.contains("lepu")
  return familyMatch || lepuLike
}
