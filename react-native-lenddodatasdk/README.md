
# RNDataSdkWrapper

A React-native component for Android Lenddo Data SDK [https://www.lenddo.com/documentation/data_sdk.html].


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

import com.lenddo.data.RNDataSdkWrapperPackage; //<--- import

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
                    new RNDataSdkWrapperPackage(getResources().getString(R.string.partner_script_id), getResources().getString(R.string.api_secret)) //<--- add here
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

```
## API

setup () - initialize data collection

startAndroidData (String applicationId) - start data collection

setProviderAccessToken(String provider, String accessToken, String providerId, String extra_data, long expiration, Callback callback)

statisticsEnabled()

clear()

getProfileType()

sendPartnerApplicationData(String payload, Callback callback)

submitFormFillingAnalytics



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
import t from 'tcomb-form-native';

const Form = t.form.Form;

const User = t.struct({
  firstName: t.String,
  middleName: t.maybe(t.String),
  lastName: t.String
});


export default class App extends Component<{}> {

    constructor(props) {
        super(props);
        this.onButtonPressed = this.onButtonPressed.bind(this);
        RNDataSdkWrapper.setup();
        UUIDGenerator.getRandomUUID().then((uuid) => {
            console.log('uuid: ', uuid);
		    RNDataSdkWrapper.startAndroidData(uuid);
        });
    }

    onButtonPressed() {
        const value = this._form.getValue(); // use that ref to get the form value
        console.log('value: ', value);
        if (this._form.validate().isValid()){
            RNDataSdkWrapper.sendPartnerApplicationData(JSON.stringify(value), (msg) => {
                                                                                   console.log(msg);
                                                                                 });
        }

    }

  render() {
    return (
       <View style = {styles.container}>
         <Form
            ref={c => this._form = c} // assign a ref
            type={User}
          />
          <TouchableOpacity onPress = {this.onButtonPressed}>
            <View style = {styles.buttonWrapper}>
                <Text style = {styles.buttonText}>Submit</Text>
            </View>
           </TouchableOpacity>
       </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center',
      marginTop: 50,
      padding: 20,
      backgroundColor: '#ffffff',
  },
  buttonWrapper: {
      marginTop: 20,
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


