# RNDataSDKWrapperDemo

An android sample app to demonstrate Lenddo SDK that allows you to collect information in order for Lenddo to verify the user's information and enhance its scoring capabilities. 

## Installation

Before incorporating the React-Native Data SDK into your app, you should be provided with the following information:

* Partner Script ID
* Lenddo Score Service API Secret (optional)

Please ask for the information above from your Lenddo representative. If you have a dashboard account, these values can also be found there.

There may be also other partner specific values that you are required to set.

### Installing nodejs dependecies for Sample App

```bash
npm install react-native-data-sdk --save
npm install react-native-check-box --save
npm install react-native-material-textfield --save
npm install react-native-tab-view --save
npm install react-native-gesture-handler --save
```

### To run Sample App

* Update `index.android.bundle` whenever you modify your code in `App.js`

```bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```
*  Make sure an emulator is running or a device is connected

```bash
react-native run-android
```

### Gradle setup

* In `android/setting.gradle`

```gradle
...
include ':app', ':react-native-data-sdk'
project(':react-native-data-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-data-sdk/android/app')
```

* In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':react-native-data-sdk')
}
```
### Adding the Lenddo Credentials
In your applications AndroidManifest.xml file, inside the application key, add the following metadata:
```xml
<!-- partner script id is mandatory -->
<meta-data android:name="partnerScriptId" android:value="@string/partner_script_id" />

<!-- api secret can be optional -->
<meta-data android:name="partnerApiSecret" android:value="@string/api_secret" />
```
### Required Permissions
React-Native Data Sdk will use information stored on the users' android phone. It is advisable for all permissions to be added to your app to enable LenddoData to extract the necessary information for verification and scoring. The optimal permissions are already defined for you in the Libraries’ AndroidManifest.xml and are automatically added to your app using gradle when you rebuild the app after adding our SDK.

Below is the list of required permissions.
```xml
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.READ_SMS" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.READ_CALENDAR" />
    <uses-permission android:name="android.permission.READ_CALL_LOG" />
    <uses-permission android:name="com.android.browser.permission.READ_HISTORY_BOOKMARKS" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```
If you do not want the all default permissions added, you manually have to remove permissions by editing the lenddosdk/src/main/AndroidManifest.xml and comment out permissions you do not wish to grant, however please note that the following permissions at the minimum are required for the operation of the SDK and should NOT be removed:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```
It is also important that these permissions are consistent with the privacy policy of your app.

### Required gradle declaration
1. In your app-level build.gradle file, it a good practice to set/ use targetSdkVersion, compileSdkVersion and buildToolsVersion of api 26:
```gradle
apply plugin: 'com.android.application'

android {
    compileSdkVersion 26
    buildToolsVersion "26.0.2"

    defaultConfig {
        applicationId "com.your.reverse.domain.sample-app"
        minSdkVersion 16
        targetSdkVersion 26
        versionCode 1
        versionName "1.0.0"
        multiDexEnabled true
        ndk {
            abiFilters "armeabi-v7a", "x86"
        }
    }
}
```


### Initializing React-Native Data SDK
In your Application class initialize Lenddo core info as shown below

```java
package lenddo.com.lenddoconnect;

import com.lenddo.mobile.core.LenddoCoreInfo; // Required import
import com.lenddo.mobile.datasdk.AndroidData; // Required import
import com.lenddo.mobile.datasdk.models.ClientOptions; // Required import

// ... other imports

public class MainApplication extends Application implements ReactApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        LenddoCoreInfo.initCoreInfo(getApplicationContext());  // Init core info

        // Setup data gathering with client options which are data settings (can be over written via RNDataSdkWrapper's setupWithClientOptions method on your App.js  (pleaser refer to RNDataSDKDemo))
        ClientOptions clientOptions = new ClientOptions();
        clientOptions.enableLogDisplay(true);

        LenddoCoreInfo.initCoreInfo(getApplicationContext());
        AndroidData.setup(getApplicationContext(), clientOptions);

        // ... Or use the below to have a default client options
        // AndroidData.setup(getApplicationContext());
    }

    // ... Some codes
}

```

### Register Native Module in MainApplication.java

```java
package lenddo.com.lenddoconnect;

import com.lenddo.mobile.data.RNDataSdkWrapperPackage; // << import react-module package
// ... other imports

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNCollapsingToolbarPackage(),
                    new RNNestedScrollViewPackage(),
                    new RNDataSdkWrapperPackage() //<--- Add wrapper package here
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

        LenddoCoreInfo.initCoreInfo(getApplicationContext());
        AndroidData.setup(getApplicationContext());
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

}

```

### Registering data gathering callback  

On App.js, setup Lenddo sdk with callback to capture response from gathering of data and sending data into our api. You should call RNDataSdkWrapper's ```setupWithCallback``` before ```startAndroidData```. As shown in RNDataSDKDemo app.

```javascript
import { RNDataSdkWrapper , RNClientOptions } from '@lenddo/react-native-sdk';

export default class RNDataSDKDemo extends PureComponent {
    // Other method description

    startAndroidData() {
        RNDataSdkWrapper.setupWithCallback(
            (result, logMsg, statusCode) => {console.log('result: ' + result);
                console.log('logMsg: ' + logMsg);
                console.log('statusCode: ' + statusCode);

                this.setState({dataSendingCallback: logMsg});
                RNDataSdkWrapper.statisticsEnabled(
                (statisticsEnabled) => {
                    if(statisticsEnabled){
                        this.setState({startDataText : 'STOP&CLEAR DATA SDK'})
                    } else{
                        this.setState({startDataText: 'START LENDDO DATA SDK'})
                    }
                });
            });
        RNDataSdkWrapper.startAndroidData(this.state.scoring.applicationId);
    }

```
Other setup method available are ```setupWithClientOptions``` and the default ```setup``` method (please refer to the RNDataSdkDemo)

Note whenever you desire to use ```setupWithClientOptions``` and ```setupWithCallback``` at the same time, make sure you call ```setupWithClientOptions``` first. And make sure to call setup methods just once.