#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import <CRPC300Lib/CRPC300Lib.h>

@interface LepuBleIOS : RCTEventEmitter <RCTBridgeModule, CRBlueToothManagerDelegate>
@property (nonatomic, assign) BOOL hasListeners;
@property (nonatomic, assign) BOOL keepScanning;
@property (nonatomic, strong) NSMutableDictionary<NSString *, CRBleDevice *> *foundDevices;
@property (nonatomic, strong) CRBleDevice *currentDevice;
@end

@implementation LepuBleIOS

/// CRBlueToothManager keeps the CBCentralManager as an ivar; there is no public accessor.
- (nullable CBCentralManager *)creativeCentralManager {
  CRBlueToothManager *mgr = [CRBlueToothManager shareInstance];
  CBCentralManager *central = nil;
  @try {
    id raw = [mgr valueForKey:@"centralManager"];
    if ([raw isKindOfClass:[CBCentralManager class]]) central = raw;
  } @catch (__unused NSException *e) {
  }
  if (!central) {
    @try {
      id raw = [mgr valueForKey:@"_centralManager"];
      if ([raw isKindOfClass:[CBCentralManager class]]) central = raw;
    } @catch (__unused NSException *e) {
    }
  }
  return central;
}

- (nullable NSUUID *)uuidFromAddressString:(NSString *)address {
  if (address.length == 0) return nil;
  NSUUID *u = [[NSUUID alloc] initWithUUIDString:address];
  if (u) return u;
  return [[NSUUID alloc] initWithUUIDString:[address uppercaseString]];
}

RCT_EXPORT_MODULE();

- (instancetype)init {
  if (self = [super init]) {
    _foundDevices = [NSMutableDictionary new];
    _hasListeners = NO;
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (NSDictionary *)constantsToExport {
  return @{@"isReady": @YES};
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onDeviceListUpdate", @"onConnected", @"onBpResult", @"onBpError", @"onBpProgress"];
}

- (void)startObserving {
  self.hasListeners = YES;
}

- (void)stopObserving {
  self.hasListeners = NO;
}

RCT_EXPORT_METHOD(startScan) {
  CRBlueToothManager *ble = [CRBlueToothManager shareInstance];
  ble.delegate = (id)self;
  self.keepScanning = YES;
  [self.foundDevices removeAllObjects];
  [self emitDeviceList:YES];
  // Longer window: short scans often miss PC_300SNT when the radio is busy.
  [ble startSearchDevicesForSeconds:8.0];
}

RCT_EXPORT_METHOD(stopScan) {
  self.keepScanning = NO;
  [[CRBlueToothManager shareInstance] stopSearch];
  [self emitDeviceList:NO];
}

RCT_REMAP_METHOD(connect,
                 connectWithName:(NSString *)deviceName
                 deviceAddress:(NSString *)deviceAddress
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  CRBleDevice *device = self.foundDevices[deviceAddress];
  if (!device) {
    NSUUID *uuid = [self uuidFromAddressString:deviceAddress];
    CBCentralManager *central = [self creativeCentralManager];
    if (!uuid || !central) {
      reject(@"E_LEPU_IOS_DEVICE_NOT_FOUND",
             @"Device not in native scan cache. Move the monitor closer, scan again, then connect.",
             nil);
      return;
    }
    NSArray<CBPeripheral *> *cached = [central retrievePeripheralsWithIdentifiers:@[uuid]];
    CBPeripheral *periph = cached.firstObject;
    if (!periph) {
      RCTLogWarn(@"[LepuBleIOS] retrievePeripherals empty for %@ — try native scan or power-cycle the device", deviceAddress);
      reject(@"E_LEPU_IOS_DEVICE_NOT_FOUND",
            @"Peripheral not in iOS Bluetooth cache. Scan with the device awake, wait a few seconds, then connect again.",
            nil);
      return;
    }
    NSString *name = deviceName.length ? deviceName : (periph.name ?: @"PC_300");
    device = [[CRBleDevice alloc] initDeviceWithPeripheral:periph BLEName:name];
    self.foundDevices[deviceAddress] = device;
  }
  self.currentDevice = device;
  [[CRBlueToothManager shareInstance] connectDevice:device];
  resolve(nil);
}

RCT_EXPORT_METHOD(disconnect:(BOOL)rescan
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (self.currentDevice) {
    [[CRBlueToothManager shareInstance] disconnectDevice:self.currentDevice];
    [[CRPC_300SDK shareInstance] willDisconnectWithDevice:self.currentDevice];
  }
  self.currentDevice = nil;
  [self emitConnected:NO];
  if (rescan) {
    [self startScan];
  }
  resolve(nil);
}

RCT_EXPORT_METHOD(startBloodPressure:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (!self.currentDevice) {
    reject(@"E_LEPU_IOS_NOT_CONNECTED", @"No connected device", nil);
    return;
  }
  CRPC_300SDK *sdk = [CRPC_300SDK shareInstance];
  sdk.delegate = (id)self;
  // Ensure a fresh BP cycle; repeated starts can be ignored if previous run is still active.
  [sdk stopBloodPressureMeasurementForDevice:self.currentDevice];
  [sdk queryForNIBPWorkModeFromDevice:self.currentDevice];
  [sdk setNIBPWorkMode:CRPC_300SDKNIBPWorkModeAdult ForDevice:self.currentDevice];
  [sdk startBloodPressureMeasurementForDevice:self.currentDevice];
  resolve(nil);
}

#pragma mark - CRBlueToothManagerDelegate dynamic handlers
- (void)bleManager:(CRBlueToothManager *)manager didFindDevice:(NSArray<CRBleDevice *> *)deviceList {
  for (CRBleDevice *d in deviceList) {
    NSString *key = d.peripheral.identifier.UUIDString;
    if (key) self.foundDevices[key] = d;
  }
  [self emitDeviceList:YES];
}

- (void)bleManager:(CRBlueToothManager *)manager didSearchCompleteWithResult:(NSArray<CRBleDevice *> *)deviceList {
  for (CRBleDevice *d in deviceList) {
    NSString *key = d.peripheral.identifier.UUIDString;
    if (key) self.foundDevices[key] = d;
  }
  if (self.keepScanning && self.foundDevices.count == 0) {
    [manager startSearchDevicesForSeconds:3.0];
    [self emitDeviceList:YES];
    return;
  }
  [self emitDeviceList:NO];
}

- (void)bleManager:(CRBlueToothManager *)manager didConnectDevice:(CRBleDevice *)device {
  self.currentDevice = device;
  CRPC_300SDK *sdk = [CRPC_300SDK shareInstance];
  sdk.delegate = (id)self;
  [sdk didConnectDevice:device];
  [self emitConnected:YES];
}

- (void)bleManager:(CRBlueToothManager *)manager didDisconnectDevice:(CRBleDevice *)device {
  if (device) [[CRPC_300SDK shareInstance] willDisconnectWithDevice:device];
  self.currentDevice = nil;
  [self emitConnected:NO];
}

- (void)bleManager:(CRBlueToothManager *)manager didFailToConnectDevice:(CRBleDevice *)device Error:(NSError *)error {
  [self emitConnected:NO];
}

#pragma mark - CRPC_300SDKDelegate dynamic handlers
- (void)pc_300SDK:(CRPC_300SDK *)pc_300SDK getNIBPRealTimeDataWithPressure:(int)pressure HeartBeat:(BOOL)heartBeat FromDevice:(CRBleDevice *)device {
  if (!self.hasListeners) return;
  [self sendEventWithName:@"onBpProgress" body:@{@"pressure": @(pressure), @"heartBeat": @(heartBeat)}];
}

- (void)pc_300SDK:(CRPC_300SDK *)pc_300SDK getNIBPMessurementResultWithSys:(int)sys Dia:(int)dia Map:(int)map Pr:(int)pr HeartRateState:(BOOL)hrState Rank:(int)rank FromDevice:(CRBleDevice *)device {
  if (!self.hasListeners) return;
  [self sendEventWithName:@"onBpResult"
                     body:@{
                       @"systolic": @(sys),
                       @"diastolic": @(dia),
                       @"pulseRate": @(pr),
                       @"map": @(map),
                       @"heartRateState": @(hrState),
                     }];
}

- (void)pc_300SDK:(CRPC_300SDK *)pc_300SDK getNIBPMessurementErrorWithErrorType:(int)errorType ErrorCode:(int)errorCode FromDevice:(CRBleDevice *)device {
  if (!self.hasListeners) return;
  [self sendEventWithName:@"onBpError" body:@{@"errorType": @(errorType), @"errorCode": @(errorCode)}];
}

#pragma mark - CRBlueToothManagerDelegate — Bluetooth state
- (void)bleManager:(CRBlueToothManager *)manager didUpdateState:(CBManagerState)state {
  RCTLogInfo(@"[LepuBleIOS] central state %ld", (long)state);
}

#pragma mark - helpers
- (void)emitConnected:(BOOL)connected {
  // Always emit so JS can await connection even if scan listeners were torn down.
  [self sendEventWithName:@"onConnected" body:@{@"connected": @(connected)}];
}

- (void)emitDeviceList:(BOOL)scanning {
  if (!self.hasListeners) return;
  NSMutableArray *devices = [NSMutableArray array];
  [self.foundDevices enumerateKeysAndObjectsUsingBlock:^(NSString * _Nonnull key, CRBleDevice * _Nonnull d, BOOL * _Nonnull stop) {
    NSString *name = d.bleName ?: d.peripheral.name ?: @"Unknown Device";
    [devices addObject:@{@"name": name, @"address": key, @"rssi": @0}];
  }];
  [self sendEventWithName:@"onDeviceListUpdate" body:@{@"devices": devices, @"scanning": @(scanning)}];
}

@end
