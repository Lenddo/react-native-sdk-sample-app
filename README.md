# RNDataSDKWrapperDemo

An sample app to demonstrate RNDataSdkWrapper


### Installation

```bash
npm install react-native-lenddodatasdk --save
npm install react-native-uuid-generator --save
```


### Gradle setup

* In `android/setting.gradle`

```gradle
...
include ':app', ':react-native-lenddodatasdk'
project(':react-native-lenddodatasdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-lenddodatasdk/android/app')

include ':react-native-uuid-generator'
project(':react-native-uuid-generator').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-uuid-generator/android')
```

* In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':react-native-lenddodatasdk')
    compile project(':react-native-uuid-generator')
}
```


* register module on React Native >= 0.18 (in MainApplication.java)

```java
package lenddo.com.lenddoconnect;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex; 

import com.facebook.react.ReactApplication;
import com.reactlibrary.RNUUIDGeneratorPackage; //<--- import
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.lenddo.data.RNDataSdkWrapperPackage; //<--- import
import java.util.Arrays;
import java.util.List;

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
                    new RNUUIDGeneratorPackage(), //<--- add here
                    new RNDataSdkWrapperPackage(getResources().getString(R.string.partner_script_id), 
                    getResources().getString(R.string.api_secret)) //<--- add here
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
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

}

```

* register module on React Native < 0.18 (in MainApplication.java)

```java

```