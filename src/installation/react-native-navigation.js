const execute = require('exec');

// Add to packages
function exec(c) {
  execute(c, (err, out, code) => {
    if (err instanceof Error) { throw err; }
    process.stderr.write(err);
    process.stdout.write(out);
    process.exit(code);
  });
}
function addToIOSLib(src, addTobuild) {
  console.log(`adding ./node_modules/${src}`);
  if (addTobuild) {
    console.log(`adding ${addTobuild}`);
    console.log(`Header Search Paths $(SRCROOT)/../node_modules/${src}/ios`);
  }
  return AppDelegate();
}

function AppDelegate() {
  // read AppDelegate.m
  // 1. add #import "RCCManager.h" after #import "AppDelegate.h"
  // 2.0 commentout ( RCTRootView *rootView = .* [self.window makeKeyAndVisible]);
  // 2.1 add self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  // 2.2 add self.window.backgroundColor = [UIColor whiteColor];
  // 2.3 add [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  // 2. addition before return Yes;
}
function addToAndroid() {
  // # android/settings.gradle
  // 1.1 include ':react-native-navigation'
  // 1.2 project(':react-native-navigation').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-navigation/android/app/')
  // 1: before include ':app';

  // edit android/app/build.gradle
  // 2.1 compileSdkVersion 25
  // 2.2 buildToolsVersion "25.0.1"
  // 3.1 after : dependencies {
  // compile "com.facebook.react:react-native:+"

  // edit android/app/src/main/java/com/ivf/MainActivity.java
  // 4.1 import com.reactnativenavigation.controllers.SplashActivity;
  // 4.1 before public class MainActivity
  // 4.2 public class MainActivity extends SplashActivity { replaceed ReactActivity
  // 4.2 replaced extends ReactActivity with extends SplashActivity
  // 4.2 comment out any methods in this class.

  // android/app/src/main/java/com/ivf/MainApplication.java
  // 5 same as 4,
  // import com.reactnativenavigation.NavigationApplication;
  // public class MainApplication extends NavigationApplication {
  // must assure isDebug && createAdditionalReactPackages are there..

  // ./android/app/src/main/AndroidManifest.xml 
  // 6 Update AndroidManifest.xml and set android:name value to .MainApplication
  // under <application(\n\s*)android:name="(.*)" $3=.MainApplication
}

exec('yarn add react-native-navigation@latest');
addToIOSLib('react-native-navigation/ios/ReactNativeNavigation.xcodeproj', 'libReactNativeNavigation.a');
