
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

setup(Callback callback)

setup(String gatewayUrl, boolean wifiOnly,
boolean enableLogDisplay, boolean disableSms,
boolean disableCallLog, boolean disableContact,
boolean disableCalendarEvent, boolean disableInstalledApp,
boolean disableBrowserHistory, boolean disableLocation,
boolean disableBattCharge, boolean disableGalleryMetaData,
boolean disableSmsBody, boolean enablePhoneNumber,
boolean enableContactsName, boolean enableContactsEmail,
boolean enableCalendarOrganizer, boolean enableCalendarDisplayName,
boolean enableCalendarEmail, final Callback callback)

startAndroidData (String applicationId) - start data collection

setProviderAccessToken(String provider, String accessToken, String providerId, String extra_data, long expiration, Callback callback)

statisticsEnabled(Callback callback)

clear()

getProfileType(Callback callback)

sendPartnerApplicationData(String payload, Callback callback)

submitFormFillingAnalytics()



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
  TouchableOpacity,
  ScrollView
} from 'react-native';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const ClientOptions = t.struct({
  gatewayUrl: t.maybe(t.String),
  wifiOnly: t.Boolean,
  enableLogDisplay: t.Boolean,
  disableSms: t.Boolean,
  disableCallLog: t.Boolean,
  disableContact: t.Boolean,
  disableCalendarEvent: t.Boolean,
  disableInstalledApp: t.Boolean,
  disableBrowserHistory: t.Boolean,
  disableLocation: t.Boolean,
  disableBattCharge: t.Boolean,
  disableGalleryMetaData: t.Boolean,
  disableSmsBody: t.Boolean,
  enablePhoneNumber: t.Boolean,
  enableContactsName: t.Boolean,
  enableContactsEmail: t.Boolean,
  enableCalendarOrganizer: t.Boolean,
  enableCalendarDisplayName: t.Boolean,
  enableCalendarEmail: t.Boolean
});


export default class App extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            textValue:'START DATA SDK'
        }
        this.onButtonPressed = this.onButtonPressed.bind(this);
    }

    onButtonPressed() {
        const value = this._form.getValue(); // use that ref to get the form value
        console.log('value: ', value);
        if (value) { // if validation fails, value will be null
            if(this.state.textValue.toUpperCase() === "START DATA SDK".toUpperCase()){
                this.setState({textValue: "STOP&CLEAR DATA SDK"})

            UUIDGenerator.getRandomUUID().then((applicationId) => {
                console.log('applicationId: ', applicationId);
                RNDataSdkWrapper.setup(this._form.getValue().gatewayUrl, this._form.getValue().wifiOnly,
                this._form.getValue().disableCallLog, this._form.getValue().disableContact,
                this._form.getValue().enableLogDisplay, this._form.getValue().disableSms,
                this._form.getValue().disableCalendarEvent, this._form.getValue().disableInstalledApp,
                this._form.getValue().disableBrowserHistory, this._form.getValue().disableLocation,
                this._form.getValue().disableBattCharge, this._form.getValue().disableGalleryMetaData,
                this._form.getValue().disableSmsBody, this._form.getValue().enablePhoneNumber,
                this._form.getValue().enableContactsName, this._form.getValue().enableContactsEmail,
                this._form.getValue().enableCalendarOrganizer, this._form.getValue().enableCalendarDisplayName,
                this._form.getValue().enableCalendarEmail,
                (msg) => {console.log(msg);
                    RNDataSdkWrapper.statisticsEnabled(
                    (statisticsEnabled) => {
                        if(statisticsEnabled){
                            this.setState({textValue: "STOP&CLEAR DATA SDK"})
                        } else{
                            this.setState({textValue: "START DATA SDK"})
                        }
                    });
                });
		        RNDataSdkWrapper.startAndroidData(applicationId);
            });
            } else{
                this.setState({textValue: "START DATA SDK"})
                RNDataSdkWrapper.clear();
            }

//                RNDataSdkWrapper.sendPartnerApplicationData(JSON.stringify(value),
//                (msg) => {console.log(msg);});
        }

    }

  render() {
    return (

        <ScrollView>
            <View style = {styles.container}>
              <Form
                 ref={(c) => this._form =c}
                 type={ClientOptions}
               />
               <TouchableOpacity onPress = {this.onButtonPressed}>
                 <View style = {styles.buttonWrapper}>
                     <Text style = {styles.buttonText}>{this.state.textValue}</Text>
                 </View>
                </TouchableOpacity>
            </View>
       </ScrollView>
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


