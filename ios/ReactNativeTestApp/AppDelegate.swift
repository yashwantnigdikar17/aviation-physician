import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
#if canImport(FirebaseCore)
import FirebaseCore
#endif

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "ReactNativeTestApp"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

#if canImport(FirebaseCore)
    // Only configure Firebase when GoogleService-Info.plist is present.
    let hasFirebaseConfig = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") != nil
    if hasFirebaseConfig && FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }
#endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return URL(string: "http://192.168.1.37:8081/index.bundle?platform=ios")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  override func application(
    _ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?
  ) -> UIInterfaceOrientationMask {
    .allButUpsideDown
  }
}
