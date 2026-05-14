import Foundation
import React
import CoreBluetooth
import CRPC300Lib

@objc(LepuBleIOSSwift)
class LepuBleIOSSwift: RCTEventEmitter {
  private var hasListeners = false
  private var foundDevices: [String: CRBleDevice] = [:]
  private var currentDevice: CRBleDevice?

  override static func requiresMainQueueSetup() -> Bool {
    false
  }

  override func supportedEvents() -> [String]! {
    [
      "onDeviceListUpdate",
      "onConnected",
      "onBpResult",
      "onSpO2Result",
      "onTempResult",
    ]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  @objc override func constantsToExport() -> [AnyHashable: Any]! {
    // Keep disabled until CRBlueToothManagerDelegate mapping is fully aligned.
    ["isReady": false]
  }

  @objc func startScan() {
    // Native path temporarily disabled; JS falls back to BLE-PLX.
  }

  @objc func stopScan() {
    // Native path temporarily disabled; JS falls back to BLE-PLX.
  }

  @objc(connect:deviceAddress:resolver:rejecter:)
  func connect(
    _ deviceName: String,
    deviceAddress: String,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    guard let device = foundDevices[deviceAddress] else {
      rejecter("E_LEPU_IOS_DEVICE_NOT_FOUND", "Device not found in scan list", nil)
      return
    }
    currentDevice = device
    CRBlueToothManager.shareInstance()?.connect(device)
    resolver(nil)
  }

  @objc(disconnect:resolver:rejecter:)
  func disconnect(
    _ rescan: Bool,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    if let device = currentDevice {
      CRBlueToothManager.shareInstance()?.disconnectDevice(device)
      CRPC_300SDK.shareInstance()?.perform(NSSelectorFromString("willDisconnectWithDevice:"), with: device)
    }
    currentDevice = nil
    emitConnected(false)
    if rescan {
      startScan()
    }
    resolver(nil)
  }

  @objc(startBloodPressure:rejecter:)
  func startBloodPressure(
    _ resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    guard let device = currentDevice else {
      rejecter("E_LEPU_IOS_NOT_CONNECTED", "No connected device", nil)
      return
    }
    let sdk = CRPC_300SDK.shareInstance()
    // Use selector-based calls to keep compatibility across SDK header naming variations.
    sdk?.perform(NSSelectorFromString("queryForNIBPWorkModeFromDevice:"), with: device)
    sdk?.perform(NSSelectorFromString("setNIBPWorkMode:ForDevice:"), with: 0, with: device) // adult mode
    sdk?.perform(NSSelectorFromString("startBloodPressureMeasurementForDevice:"), with: device)
    resolver(nil)
  }

  // MARK: - helpers
  private func emitConnected(_ connected: Bool) {
    if hasListeners {
      sendEvent(withName: "onConnected", body: ["connected": connected])
    }
  }

  private func emitDeviceList(scanning: Bool) {
    let devices = foundDevices.compactMap { (id, d) -> [String: Any]? in
      let name = d.bleName ?? d.peripheral?.name ?? "Unknown Device"
      return ["name": name, "address": id, "rssi": 0]
    }
    if hasListeners {
      sendEvent(withName: "onDeviceListUpdate", body: ["devices": devices, "scanning": scanning])
    }
  }
}
