import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const manager = new BleManager();
const LepuBleAndroid = NativeModules.LepuBle;
const LepuBleIOS = NativeModules.LepuBleIOS;
const LepuBle =
  Platform.OS === 'android'
    ? LepuBleAndroid
    : Platform.OS === 'ios' && LepuBleIOS?.isReady
      ? LepuBleIOS
      : null;
const lepuBleAvailable = LepuBle != null;
const lepuEmitter = lepuBleAvailable ? new NativeEventEmitter(LepuBle) : null;

let connectedDevice = null;
let subscription = null;
let scanTimeout = null;
let nativeScanSub = null;
let nativeBpSub = null;
let nativeBpProgressSub = null;
let nativeConnSub = null;
let pendingBpTrigger = false;
let connectedViaNative = false;
let iosBpTriggerPending = false;
let iosStatusFrameCount = 0;
let iosBpRecoveryAttempts = 0;

const BLE_LOG_PREFIX = '[BLE][Aviation]';
const log = (...args) => console.log(BLE_LOG_PREFIX, ...args);
const logError = (...args) => console.warn(BLE_LOG_PREFIX, ...args);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/** iOS: CRPC300Lib must own the connection; await didConnect before starting BP. */
const waitForNativeConnected = (ms = 25000) => {
  if (Platform.OS !== 'ios' || !lepuEmitter) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let done = false;
    const to = setTimeout(() => {
      if (!done) {
        done = true;
        sub.remove();
        reject(new Error('Native Bluetooth connect timed out'));
      }
    }, ms);
    const sub = lepuEmitter.addListener('onConnected', e => {
      if (done) return;
      if (e?.connected === true) {
        done = true;
        clearTimeout(to);
        sub.remove();
        resolve();
      }
    });
  });
};

const writeIosBpCmd = async (charUuid, payloadHex, mode = 'withResponse') => {
  if (!connectedDevice) return;
  const serviceUuid = '0000fff0-0000-1000-8000-00805f9b34fb';
  const payloadBase64 = Buffer.from(payloadHex, 'hex').toString('base64');
  if (mode === 'withoutResponse') {
    await connectedDevice.writeCharacteristicWithoutResponseForService(serviceUuid, charUuid, payloadBase64);
  } else {
    await connectedDevice.writeCharacteristicWithResponseForService(serviceUuid, charUuid, payloadBase64);
  }
};

const sendIosBpArmAndStart = async (reason = 'manual') => {
  // PC_300SNT can require arm/prepare command before start on iOS BLE stack.
  const arm = 'AA5504B00000B4';
  const start = 'AA5504B10000B5';
  log('ios bp arm/start sequence begin', { reason });
  // Use write-with-response on iOS for better command latching reliability.
  await writeIosBpCmd('0000fff2-0000-1000-8000-00805f9b34fb', arm, 'withResponse');
  await delay(180);
  await writeIosBpCmd('0000fff2-0000-1000-8000-00805f9b34fb', start, 'withResponse');
  await delay(200);
  // Follow-up kick on the known write characteristic only.
  await writeIosBpCmd('0000fff2-0000-1000-8000-00805f9b34fb', start, 'withoutResponse');
  log('ios bp arm/start sequence sent', { reason });
};

const ECG_DEVICE_KEYWORDS = [
  'lepu',
  'ecg',
  'pc-80',
  'pc80',
  'pc_80',
  'cardio',
  'heart',
  'checkme',
  'viatom',
  'wellue',
  'creative',
  'bp',
  'blood',
  'pressure',
  'oximeter',
  'spo2',
];

const isEcgDevice = device => {
  const name = (device?.name || '').toLowerCase().trim();
  const localName = (device?.localName || '').toLowerCase().trim();
  const serviceUuids = (device?.serviceUUIDs || [])
    .map(u => String(u).toLowerCase())
    .join(' ');

  const combined = `${name} ${localName} ${serviceUuids}`.trim();

  // Common BLE service UUID hints used by ECG/BP-style devices.
  const hasLikelyEcgService =
    serviceUuids.includes('fff0') ||
    serviceUuids.includes('fff1') ||
    serviceUuids.includes('180d'); // Heart Rate service

  if (hasLikelyEcgService) return true;
  if (!combined) return false;

  return ECG_DEVICE_KEYWORDS.some(keyword => combined.includes(keyword));
};

const requestBlePermissions = async () => {
  if (Platform.OS !== 'android') return true;

  const api = Number(Platform.Version);
  const permissions =
    api >= 31
      ? [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]
      : [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ];

  const result = await PermissionsAndroid.requestMultiple(permissions);
  log('permission result:', result);
  return Object.values(result).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
};

// 🔍 Scan
export const scanDevices = async (onDeviceFound, onScanComplete, onScanError) => {
  log('scan start', { platform: Platform.OS, lepuBleAvailable });
  const permissionGranted = await requestBlePermissions();
  if (!permissionGranted) {
    logError('scan blocked: permission denied');
    onScanError?.('Bluetooth permission denied');
    return;
  }

  const runPlxScan = () => {
    const seen = new Set();
    manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error) {
        logError('scan error', error?.message || error);
        onScanError?.(error.message || 'Scan failed');
        stopScan();
        return;
      }

      if (!device?.id || seen.has(device.id)) return;
      seen.add(device.id);
      log('plx device discovered', {
        id: device.id,
        name: device.name,
        localName: device.localName,
        serviceUUIDs: device.serviceUUIDs,
        rssi: device.rssi,
      });

      if (isEcgDevice(device)) {
        log('plx device accepted by ECG filter', { id: device.id, name: device.name });
        onDeviceFound?.(device);
      } else {
        log('plx device rejected by ECG filter', { id: device.id, name: device.name });
      }
    });

    scanTimeout = setTimeout(() => {
      log('plx scan timeout reached');
      stopScan();
      onScanComplete?.();
    }, 8000);
  };

  if (lepuBleAvailable) {
    const seen = new Set();
    let nativeFoundCount = 0;
    if (nativeScanSub) {
      nativeScanSub.remove();
      nativeScanSub = null;
    }
    nativeScanSub = lepuEmitter.addListener('onDeviceListUpdate', e => {
      const devices = e?.devices || [];
      log('native onDeviceListUpdate', { count: devices.length, scanning: e?.scanning });
      devices.forEach(d => {
        if (!d?.address || seen.has(d.address)) return;
        seen.add(d.address);
        nativeFoundCount += 1;
        log('native device found', { name: d.name, address: d.address, rssi: d.rssi });
        onDeviceFound?.(d);
      });
    });
    log('native startScan called');
    LepuBle.startScan();
    scanTimeout = setTimeout(() => {
      log('native scan timeout reached');
      stopScan();
      if (Platform.OS === 'ios' && nativeFoundCount === 0) {
        log('native scan found 0 devices, fallback to plx scan');
        runPlxScan();
        return;
      }
      onScanComplete?.();
    }, 8000);
    return;
  }

  runPlxScan();
};
export const stopScan = () => {
  log('stopScan called');
  if (scanTimeout) {
    clearTimeout(scanTimeout);
    scanTimeout = null;
  }
  if (nativeScanSub) {
    nativeScanSub.remove();
    nativeScanSub = null;
  }
  manager.stopDeviceScan();
  if (lepuBleAvailable) {
    LepuBle.stopScan?.();
  }
};

const ensurePlxConnected = async () => {
  if (!connectedDevice?.id) return false;
  try {
    const isConnected = await manager.isDeviceConnected(connectedDevice.id);
    if (!isConnected) {
      connectedDevice = null;
      return false;
    }
    return true;
  } catch (e) {
    logError('isDeviceConnected check failed', e?.message || e);
    return false;
  }
};

const clearPlxMonitor = () => {
  if (subscription) {
    subscription.remove();
    subscription = null;
  }
};

const handlePlxDisconnect = async (reason = 'unknown') => {
  logError('plx disconnect detected', { reason, id: connectedDevice?.id });
  clearPlxMonitor();
  iosBpTriggerPending = false;
  iosStatusFrameCount = 0;
  iosBpRecoveryAttempts = 0;
  if (connectedDevice?.id) {
    try {
      await manager.cancelDeviceConnection(connectedDevice.id);
    } catch (_e) {
      // Already disconnected.
    }
  }
  connectedDevice = null;
};

// 🔗 Connect
export const connectToDevice = async (device) => {
  log('connect requested', {
    lepuBleAvailable,
    id: device?.id,
    address: device?.address,
    name: device?.name || device?.localName,
  });
  const shouldUseNativeConnect =
    lepuBleAvailable &&
    (Platform.OS === 'android'
      ? !!device?.address
      : !!(device?.address || device?.id));

  if (shouldUseNativeConnect) {
    const name = device?.name || device?.localName || 'Lepu Device';
    const address = device?.address || device?.id;
    if (!address) {
      throw new Error('Invalid device address');
    }
    stopScan();
    if (Platform.OS === 'ios') {
      // Let Creative's CBCentralManager see the peripheral (PLX scan alone does not populate its cache).
      log('ios native scan primer before SDK connect');
      LepuBle.startScan?.();
      await delay(3500);
      LepuBle.stopScan?.();
      await delay(250);
    }
    const connectedWaiter = waitForNativeConnected(25000);
    await LepuBle.connect(name, address);
    if (Platform.OS === 'ios') {
      await connectedWaiter;
      log('ios native peripheral reported connected');
    }
    log('native connect called', { name, address });
    connectedDevice = { name, id: address, address };
    connectedViaNative = true;
    return connectedDevice;
  }

  // Stop scanning once a target device is selected to avoid BLE operation conflicts.
  stopScan();
  connectedDevice = await device.connect();
  log('plx connected', { id: connectedDevice?.id, name: connectedDevice?.name });
  await connectedDevice.discoverAllServicesAndCharacteristics();
  log('plx services discovered');
  connectedViaNative = false;
  return connectedDevice;
};

// ▶️ Start Reading
export const startReading = (updateVital) => {
  log('startReading called', { lepuBleAvailable, hasConnectedDevice: !!connectedDevice });
  if (lepuBleAvailable && connectedViaNative) {
    if (nativeBpSub) return;
    if (!nativeConnSub) {
      nativeConnSub = lepuEmitter.addListener('onConnected', e => {
        const isConnected = !!e?.connected;
        log('native onConnected', e);
        if (isConnected && pendingBpTrigger) {
          log('retrying pending BP trigger after reconnect');
          LepuBle.startBloodPressure?.()
            .then(() => {
              pendingBpTrigger = false;
              log('pending BP trigger success');
            })
            .catch(err => {
              logError('pending BP trigger failed', err?.message || err);
            });
        }
      });
      log('native onConnected listener attached');
    }
    nativeBpSub = lepuEmitter.addListener('onBpResult', e => {
      if (!e) return;
      log('native onBpResult', e);
      updateVital('Blood Pressure', `${e.systolic}/${e.diastolic}`);
      updateVital('Heart Rate', e.pulseRate);
    });
    nativeBpProgressSub = lepuEmitter.addListener('onBpProgress', e => {
      const pressure = Number(e?.pressure);
      if (!Number.isFinite(pressure) || pressure <= 0) return;
      // Show live cuff pressure in BP card while measurement is running.
      updateVital('Blood Pressure', String(pressure));
    });
    log('native BP listener attached');
    return;
  }

  if (!connectedDevice) return;
  if (subscription) {
    log('monitor already active, skipping duplicate subscribe');
    return;
  }

  subscription = connectedDevice.monitorCharacteristicForService(
    "0000fff0-0000-1000-8000-00805f9b34fb",
    "0000fff1-0000-1000-8000-00805f9b34fb",
    (error, characteristic) => {
      if (error) {
        logError('monitor error', error?.message || error);
        const msg = String(error?.message || '').toLowerCase();
        if (msg.includes('disconnected')) {
          handlePlxDisconnect(error?.message || 'monitor-disconnected');
        } else {
          clearPlxMonitor();
        }
        return;
      }

      const raw = Buffer.from(characteristic.value, 'base64');
      log('monitor packet hex', raw.toString('hex'));
      log('monitor packet', {
        service: "0000fff0-0000-1000-8000-00805f9b34fb",
        characteristic: "0000fff1-0000-1000-8000-00805f9b34fb",
        byteLength: raw?.length || 0,
      });

      parseLepuData(raw, updateVital);
    }
  );
};

// ⛔ Stop
export const stopReading = async () => {
  log('stopReading called');
  const wasNative = connectedViaNative;
  pendingBpTrigger = false;
  connectedViaNative = false;
  iosBpTriggerPending = false;
  iosStatusFrameCount = 0;
  iosBpRecoveryAttempts = 0;
  if (nativeBpSub) {
    nativeBpSub.remove();
    nativeBpSub = null;
  }
  if (nativeBpProgressSub) {
    nativeBpProgressSub.remove();
    nativeBpProgressSub = null;
  }
  if (nativeConnSub) {
    nativeConnSub.remove();
    nativeConnSub = null;
  }

  if (lepuBleAvailable && wasNative) {
    await LepuBle.disconnect?.(false);
    log('native disconnect called');
    connectedDevice = null;
    return;
  }

  if (subscription) {
    subscription.remove();
    subscription = null;
  }

  if (connectedDevice) {
    await connectedDevice.cancelConnection();
    log('plx connection cancelled');
    connectedDevice = null;
  }
};

export const triggerBloodPressure = async () => {
  log('triggerBloodPressure called', { lepuBleAvailable, platform: Platform.OS });
  if (lepuBleAvailable && connectedViaNative && LepuBle.startBloodPressure) {
    pendingBpTrigger = true;
    log('native startBloodPressure invoked');
    // Repeat-trigger safety: some firmwares ignore back-to-back taps unless
    // the command is re-sent after a short delay.
    await LepuBle.startBloodPressure();
    await delay(180);
    await LepuBle.startBloodPressure();
    pendingBpTrigger = false;
    log('native startBloodPressure success');
    return;
  }

  // iOS / BLE-PLX path for PC_300SNT
  if (connectedDevice?.writeCharacteristicWithoutResponseForService) {
    const stillConnected = await ensurePlxConnected();
    if (!stillConnected) {
      throw new Error('PC_300SNT disconnected. Please reconnect before triggering.');
    }
    stopScan();
    iosBpTriggerPending = true;
    iosStatusFrameCount = 0;
    iosBpRecoveryAttempts = 0;
    const writeServiceUuid = '0000fff0-0000-1000-8000-00805f9b34fb';
    const primaryWriteCharUuid = '0000fff2-0000-1000-8000-00805f9b34fb';
    const payloadCandidates = ['AA5504B10000B5', 'AA5504B10000B5', 'AA5504B10000B5'];

    // iOS devices can differ by write mode/characteristic; try proven primary first,
    // then fallback combinations if command gets ignored.
    const attempts = [
      { charUuid: primaryWriteCharUuid, mode: 'withResponse', payloadHex: payloadCandidates[0] },
      { charUuid: primaryWriteCharUuid, mode: 'withResponse', payloadHex: payloadCandidates[1] },
      { charUuid: primaryWriteCharUuid, mode: 'withoutResponse', payloadHex: payloadCandidates[0] },
      { charUuid: primaryWriteCharUuid, mode: 'withoutResponse', payloadHex: payloadCandidates[1] },
      { charUuid: primaryWriteCharUuid, mode: 'withoutResponse', payloadHex: payloadCandidates[2] },
    ];

    let lastError = null;
    for (const attempt of attempts) {
      try {
        const payloadBase64 = Buffer.from(attempt.payloadHex, 'hex').toString('base64');
        log('plx startBloodPressure write attempt', {
          writeServiceUuid,
          writeCharUuid: attempt.charUuid,
          payloadHex: attempt.payloadHex,
          writeType: attempt.mode,
        });
        if (attempt.mode === 'withoutResponse') {
          await connectedDevice.writeCharacteristicWithoutResponseForService(
            writeServiceUuid,
            attempt.charUuid,
            payloadBase64
          );
        } else {
          await connectedDevice.writeCharacteristicWithResponseForService(
            writeServiceUuid,
            attempt.charUuid,
            payloadBase64
          );
        }
        log('plx startBloodPressure write success', attempt);
        await delay(220);
        // Keep short burst writes for PC_300SNT to latch measurement start reliably.
      } catch (err) {
        lastError = err;
        logError('plx startBloodPressure write failed', {
          writeCharUuid: attempt.charUuid,
          writeType: attempt.mode,
          payloadHex: attempt.payloadHex,
          error: err?.message || err,
        });
      }
    }

    if (lastError) {
      throw lastError;
    }
    try {
      await sendIosBpArmAndStart('post-attempt-sequence');
    } catch (e) {
      logError('ios bp arm/start sequence failed', e?.message || e);
    }
    return;
  }

  log('startBloodPressure unavailable: no native module and no connected plx writer');
};

// 🧠 Parse
const parseLepuData = (data, updateVital) => {
  if (!data || data.length < 5) return;
  // Status/heartbeat packet frequently seen on PC_300SNT while idle.
  if (data.length === 6 && data[0] === 0xaa && data[1] === 0x55 && data[2] === 0xff && data[3] === 0x02) {
    log('pc300 status frame', { hex: Buffer.from(data).toString('hex') });
    if (iosBpTriggerPending) {
      iosStatusFrameCount += 1;
      // If still idle after trigger, send bounded recovery bursts.
      if (
        (iosStatusFrameCount === 8 || iosStatusFrameCount === 16 || iosStatusFrameCount === 24) &&
        iosBpRecoveryAttempts < 3
      ) {
        iosBpRecoveryAttempts += 1;
        sendIosBpArmAndStart('status-recovery').catch(err =>
          logError('status-recovery sequence failed', err?.message || err)
        );
      }
    }
    return;
  }

  if (iosBpTriggerPending) {
    iosBpTriggerPending = false;
    iosStatusFrameCount = 0;
    iosBpRecoveryAttempts = 0;
    log('pc300 non-status packet received after trigger');
  }

  const spo2 = data[4];
  const pulse = data[3];
  const temp = (data[2] + data[3] / 10).toFixed(1);
  const systolic = data[1];
  const diastolic = data[2];

  updateVital('Oxygen', spo2);
  updateVital('Heart Rate', pulse);
  updateVital('Temperature', temp);
  updateVital('Blood Pressure', `${systolic}/${diastolic}`);
};