
# react-native-lenddodatasdk

A React-native component for android Lenddo Data SDK [https://www.lenddo.com/documentation/data_sdk.html].


### Demo app

<insert link of demo app here>

### Installation

```bash
npm install react-native-lenddodatasdk --save
```

### Add it to your android project

* In `android/setting.gradle`

```gradle
...
include ':react-native-lenddodatasdk'
project(':react-native-lenddodatasdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-lenddodatasdk/android/app')
```

* In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':react-native-lenddodatasdk')
}
```

* register module on React Native >= 0.18 (in MainApplication.java)
```java
package lenddo.com.lenddoconnect;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;

import com.lenddo.data.RNDataSdkWrapperPackage; <--- import

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
                    new RNDataSdkWrapperPackage(getResources().getString(R.string.partner_script_id), getResources().getString(R.string.api_secret)) <--- add here
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

}

```

* register module on React Native < 0.18 (in MainApplication.java)
```java

}
```
##API

setup () - initialize data collection
startAndroidData (String applicationId) - start data collection
... (more methods to follow)

## Example
```javascript
import React, { Component } from 'react';
import RNDataSdkWrapper from 'react-native-lenddodatasdk';
import UUIDGenerator from 'react-native-uuid-generator';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';



export default class App extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = { val: "Start data collection" }
        this.onButtonPressed = this.onButtonPressed.bind(this);
        RNDataSdkWrapper.setup(); //initialize data collection
    }

    onButtonPressed() {
        this.setState({ val: "Started!" })
        UUIDGenerator.getRandomUUID().then((uuid) => {
            console.log(uuid);
		    RNDataSdkWrapper.startAndroidData(uuid); //start data collection
        });
    }

  render() {
    return (
       <View style = {styles.container}>
                <TouchableOpacity onPress = {this.onButtonPressed}>
                    <View style = {styles.buttonWrapper}>
                        <Text style = {styles.buttonText}>{this.state.val}</Text>
                    </View>
                </TouchableOpacity>
            </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999999',
  },
  buttonWrapper: {
      marginTop: 70,
      marginLeft: 20,
      marginRight:20,
      flexDirection: 'column',
      backgroundColor: '#00CCFF',
      borderRadius: 4
  },
  buttonText: {
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10,
      marginHorizontal: 20,
      elevation: 1,
      color: '#FFFFFF'
  }
});

