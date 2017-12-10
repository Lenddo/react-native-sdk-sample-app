
# RNDataSdkWrapper

A React-native component for Android Lenddo Data SDK [https://www.lenddo.com/documentation/data_sdk.html].


## Demo app

[https://bitbucket.org/leqstamaria/react-native-data-sdk-demo]

### Installation

```bash
npm install react-native-data-sdk --save
```

### To run

* Update `index.android.bundle` whenever you modify your code in `App.js`

```bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

```
*  Make sure an emulator is running or a device is connected

```bash
react-native run-android
```

### Add it to your android project

* In `android/setting.gradle`

```gradle
...
include ':react-native-data-sdk'
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

* register module in MainApplication.java

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
        public  getUseDeveloperSupport() {
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
        protected getJSMainModuleName() {
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

## API

setup ()

setup(callback)

setup(gatewayUrl,  wifiOnly,
 enableLogDisplay,  disableSms,
 disableCallLog,  disableContact,
 disableCalendarEvent,  disableInstalledApp,
 disableBrowserHistory,  disableLocation,
 disableBattCharge,  disableGalleryMetaData,
 disableSmsBody,  enablePhoneNumber,
 enableContactsName,  enableContactsEmail,
 enableCalendarOrganizer,  enableCalendarDisplayName,
 enableCalendarEmail, callback)

startAndroidData (applicationId)

setProviderAccessToken(provider, accessToken, providerId, extra_data, expiration,  callback)

statisticsEnabled(callback)

clear()

getProfileType(callback)

sendPartnerApplicationData(firstName, middleName, 
lastName, dateOfBirth, mobile, home,
email, employer, university,
motherMaidenFirstName, motherMaidenMiddleName,
motherMaidenLastName, addressLine1,
addressLine2, city, administrativeRegion,
country, postalCode, latitude,
longitude, applicationId, jsonPayload,  callback)

submitFormFillingAnalytics()


## Example
```javascript

'use strict';

import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableHighlight, ScrollView, ToolbarAndroid, Picker} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { TextField } from 'react-native-material-textfield';
import CheckBox from 'react-native-check-box';
import RNDataSdkWrapper from 'react-native-data-sdk';



const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};


export default class TabViewExample extends PureComponent {

  constructor(props) {
    super(props);
    this.onPressStartData = this.onPressStartData.bind(this);
    this.onPressSendPartnerData = this.onPressSendPartnerData.bind(this);
    this.onPressSendProviderAccessToken = this.onPressSendProviderAccessToken.bind(this);
  }

  state = {
      startDataText: 'START DATA SDK',
      sendPartnerDataText: 'SEND PARTNER DATA',
      sendProviderAccessTokenText: 'SEND PROVIDER ACCESS TOKEN',

      index: 0,

      routes: [
        { key: 'scoring', title: 'Scoring' },
        { key: 'verification', title: 'Verification' },
      ],

      applicationIdDebugInfo : '',
      deviceIdDebugInfo: '',
      serviceTokenDebugInfo: '',
      dataSendingCallback: '',
      sendPartnerDataCallback: '',
      sendProviderAccessTokenCallback: '',
      errorApplicationId : null,

      //Picker default values
      gatewayUrl: 'https://gateway.partner-service.link',
      uploadMode: 'Wifi + Mobile',
      provider: 'facebook',

      //Scoring
      scoring: {
        applicationId : '',
        verificationValue: '',
        providerAccessValue: '',
        wifiOnly: false,
        enableLogDisplay: true,
        enableSms: true,
        enableCallLog: true,
        enableContact: true,
        enableCalendarEvent: true,
        enableInstalledApp: true,
        enableBrowserHistory: true,
        enableLocation: true,
        enableBattCharge: true,
        enableGalleryMetaData: true,
        enableSmsBody: false,
        enablePhoneNumber: false,
        enableContactsName: false,
        enableContactsEmail: false,
        enableCalendarOrganizer: false,
        enableCalendarDisplayName: false,
        enableCalendarEmail: false,
      },

      //Verification
      verification: {
        referenceNumber : '',
        jsonPayload : '',
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        mobile: '',
        home: '',
        email: '',
        employer: '',
        university: '',
        motherMaidenFirstName: '',
        motherMaidenMiddleName: '',
        motherMaidenLastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        administrativeRegion: '',
        country: '',
        postalCode: '',
        latitude: '',
        longitude: '',
      },

      //Provider Access
      providerAccess: {
        accessToken: '',
        providerID: '',
        extra_data: '',
        expiration: '',
      }


  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props}
                           indicatorStyle={styles.indicator}
                           style={styles.tabBar}
                           labelStyle={styles.label}/>;

  _renderScene = ({route}) => {

    switch(route.key){
      case 'scoring':
      return (
        <ScrollView>
          <View style = {styles.container}>
           <TextField
             label='Application ID'
             value={this.state.scoring.applicationId}
             onChangeText={ (applicationId) => {this.state.scoring.applicationId = applicationId}}
             returnKeyType = {"next"}
             error={this.state.errorApplicationId}
           />
           <Text style={{fontWeight: 'bold'}}>Settings:</Text>
           <Picker
             selectedValue={this.state.gatewayUrl}
             onValueChange={(itemValue, itemIndex) => {this.setState({gatewayUrl: itemValue})}}>
             <Picker.Item label="https://gateway.partner-service.link" value='https://gateway.partner-service.link' />
             <Picker.Item label="https://gateway-kr.partner-service.link" value='https://gateway-kr.partner-service.link' />
           </Picker>
           <Picker
             selectedValue={this.state.uploadMode}
             onValueChange={(itemValue, itemIndex) => {this.setState({uploadMode: itemValue});  if(itemIndex === 0) {this.state.scoring.wifiOnly = false; }else {this.state.scoring.wifiOnly = true;} }}>
             <Picker.Item label="Wifi + Mobile" value='Wifi + Mobile' />
             <Picker.Item label="Wifi" value='Wifi' />
           </Picker>
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableLogDisplay = !this.state.scoring.enableLogDisplay}}
                isChecked={this.state.scoring.enableLogDisplay}
                rightText='Enable Debug Logs'
            />
           <Text style={{fontWeight: 'bold'}}>Data type:</Text>
           <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableSms = !this.state.scoring.enableSms}}
                isChecked={this.state.scoring.enableSms}
                rightText='Enable SMS data collection'
            />
           <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableCallLog = !this.state.scoring.enableCallLog}}
                isChecked={this.state.scoring.enableCallLog}
                rightText='Enable Call Logs data collection'
            />
           <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableContact = !this.state.scoring.enableContact}}
                isChecked={this.state.scoring.enableContact}
                rightText='Enable Contacts data collection'
            />

           <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableCalendarEvent = !this.state.scoring.enableCalendarEvent}}
                isChecked={this.state.scoring.enableCalendarEvent}
                rightText='Enable Calendar Events data collection'
            />

           <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableInstalledApp = !this.state.scoring.enableInstalledApp}}
                isChecked={this.state.scoring.enableInstalledApp}
                rightText='Enable Installed Apps data collection'
            />

           <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableBrowserHistory = !this.state.scoring.enableBrowserHistory}}
                isChecked={this.state.scoring.enableBrowserHistory}
                rightText='Enable Browser History data collection'
            />

           <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableLocation = !this.state.scoring.enableLocation}}
                isChecked={this.state.scoring.enableLocation}
                rightText='Enable Location data collection'
            />

           <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableBattCharge = !this.state.scoring.enableBattCharge}}
                isChecked={this.state.scoring.enableBattCharge}
                rightText='Enable Battery Charge data collection'
            />

           <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableGalleryMetaData = !this.state.scoring.enableGalleryMetaData}}
                isChecked={this.state.scoring.enableGalleryMetaData}
                rightText='Enable Gallery Meta data collection'
            />
            <Text style={{fontWeight: 'bold'}}>SMS Message content:</Text>
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableSmsBody = !this.state.scoring.isChecked}}
                isChecked={this.state.scoring.enableSmsBody}
                rightText='Enable SMS Body data collection'
            />
            <Text style={{fontWeight: 'bold'}}>Data hashing:</Text>
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enablePhoneNumber = !this.state.scoring.enablePhoneNumber}}
                isChecked={this.state.scoring.enablePhoneNumber}
                rightText='Enable Phone Number hashing'
            />
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableContactsName = !this.state.enableContactsName}}
                isChecked={this.state.scoring.enableContactsName}
                rightText='Enable Contacts Name hashing'
            />
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableContactsEmail = !this.state.enableContactsEmail}}
                isChecked={this.state.scoring.enableContactsEmail}
                rightText='Enable Contacts Email hashing'
            />
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableCalendarOrganizer = !this.state.scoring.enableCalendarOrganizer}}
                isChecked={this.state.scoring.enableCalendarOrganizer}
                rightText='Enable Calendar Organizer hashing'
            />
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableCalendarDisplayName = !this.state.scoring.enableCalendarDisplayName}}
                isChecked={this.state.scoring.enableCalendarDisplayName}
                rightText='Enable Calendar Display Name hashing'
            />
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => {this.state.scoring.enableCalendarEmail = !this.state.scoring.enableCalendarEmail}}
                isChecked={this.state.scoring.enableCalendarEmail}
                rightText='Enable Calendar Email hashing'
            />
           <TouchableHighlight style={styles.button} onPress = {this.onPressStartData} underlayColor='#99d9f4'>
              <Text style = {styles.buttonText}>{this.state.startDataText}</Text>
           </TouchableHighlight>
          <Text>
            <Text>Application ID: </Text>
            <Text style={{fontWeight: 'bold'}}>{this.state.applicationIdDebugInfo}</Text>
          </Text>
          <Text>
             <Text>Device ID: </Text>
             <Text style={{fontWeight: 'bold'}}>{this.state.deviceIdDebugInfo}</Text>
           </Text>
           <Text>
             <Text>Service Token: </Text>
             <Text style={{fontWeight: 'bold'}}>{this.state.serviceTokenDebugInfo}</Text>
           </Text>
           <Text>
             <Text>Upload Mode: </Text>
             <Text style={{fontWeight: 'bold'}}>{this.state.uploadMode}</Text>
           </Text>
           <Text>
             <Text>Data Sending Callback: </Text>
             <Text style={{fontWeight: 'bold'}}>{this.state.dataSendingCallback}</Text>
           </Text>
          </View>
        </ScrollView>
      );
      case 'verification':
      return(
         <ScrollView>
            <View style = {styles.container}>
                <Text style={{fontWeight: 'bold'}}>Application Id:</Text>
                <TextField
                  label='Reference Number'
                  value={this.state.verification.referenceNumber}
                  onChangeText={ (referenceNumber) => {this.state.verification.referenceNumber = referenceNumber}}
                  returnKeyType = {"next"}
                />
                <TextField
                   label='Application JSON Payload'
                   value={this.state.verification.jsonPayload}
                   onChangeText={ (jsonPayload) => {this.state.verification.jsonPayload = jsonPayload}}
                   returnKeyType = {"next"}
                 />
                 <Text style={{fontWeight: 'bold'}}>Personal Info:</Text>
                 <TextField
                   label='First Name'
                   value={this.state.verification.firstName}
                   onChangeText={ (firstName) => {this.state.verification.firstName = firstName}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                   label='Middle Name'
                   value={this.state.verification.middleName}
                   onChangeText={ (middleName) => {this.state.verification.middleName = middleName}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                   label='Last Name'
                   value={this.state.verification.lastName}
                   onChangeText={ (lastName) => {this.state.verification.lastName = lastName}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                   label='Date of Birth'
                   value={this.state.verification.dateOfBirth}
                   onChangeText={ (dateOfBirth) => {this.state.verification.dateOfBirth = dateOfBirth}}
                   returnKeyType = {"next"}
                 />

                 <Text style={{fontWeight: 'bold'}}>Contact Info:</Text>
                 <TextField
                   label='Mobile Phone'
                   value={this.state.verification.mobile}
                   onChangeText={ (mobile) => {this.state.verification.mobile = mobile}}
                   returnKeyType = {"next"}
                 />

                 <TextField
                   label='Home Phone'
                   value={this.state.verification.home}
                   onChangeText={ (home) => {this.state.verification.home = home}}
                   returnKeyType = {"next"}
                 />

                 <TextField
                   label='Email'
                   value={this.state.verification.email}
                   onChangeText={ (email) => {this.state.verification.email = email}}
                   returnKeyType = {"next"}
                 />

                 <TextField
                   label='Employer'
                   value={this.state.verification.employer}
                   onChangeText={ (employer) => {this.state.verification.employer = employer}}
                   returnKeyType = {"next"}
                 />

                 <TextField
                   label='University'
                   value={this.state.verification.university}
                   onChangeText={ (university) => {this.state.verification.university = university}}
                   returnKeyType = {"next"}
                 />

                 <Text style={{fontWeight: 'bold'}}>Mothers Maiden Name:</Text>
                 <TextField
                   label='First Name'
                   value={this.state.verification.motherMaidenFirstName}
                   onChangeText={ (motherMaidenFirstName) => {this.state.verification.motherMaidenFirstName = motherMaidenFirstName}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                  label='Middle Name'
                  value={this.state.verification.motherMaidenMiddleName}
                  onChangeText={ (motherMaidenMiddleName) => {this.state.verification.motherMaidenMiddleName = motherMaidenMiddleName}}
                  returnKeyType = {"next"}
                />
                 <TextField
                  label='Last Name'
                  value={this.state.verification.motherMaidenLastName}
                  onChangeText={ (motherMaidenLastName) => {this.state.verification.motherMaidenLastName = motherMaidenLastName}}
                  returnKeyType = {"next"}
                />
                 <Text style={{fontWeight: 'bold'}}>Address:</Text>
                 <TextField
                   label='Line 1'
                   value={this.state.verification.addressLine1}
                   onChangeText={ (addressLine1) => {this.state.verification.addressLine1 = addressLine1}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                   label='Line 2'
                   value={this.state.verification.addressLine2}
                   onChangeText={ (addressLine2) => {this.state.verification.addressLine2 =addressLine2}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                   label='City'
                   value={this.state.verification.city}
                   onChangeText={ (city) => {this.state.verification.city = city}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                   label='Administrative Division'
                   value={this.state.verification.administrativeRegion}
                   onChangeText={ (administrativeRegion) => {this.state.verification.administrativeRegion = administrativeRegion}}
                   returnKeyType = {"next"}
                 />

                 <TextField
                   label='Country'
                   value={this.state.verification.country}
                   onChangeText={ (country) => {this.state.verification.country = country}}
                   returnKeyType = {"next"}
                 />

                 <TextField
                   label='Postal Code'
                   value={this.state.verification.postalCode}
                   onChangeText={ (postalCode) => {this.state.verification.postalCode = postalCode}}
                   returnKeyType = {"next"}
                 />

                 <Text style={{fontWeight: 'bold'}}>Geo-Location:</Text>
                 <TextField
                   label='Latitude'
                   value={this.state.verification.latitude}
                   onChangeText={ (latitude) => {this.state.verification.latitude = latitude}}
                   returnKeyType = {"next"}
                   keyboardType = 'numeric'
                 />
                 <TextField
                   label='Longitude'
                   value={this.state.verification.longitude}
                   onChangeText={ (longitude) => {this.state.verification.longitude = longitude}}
                   returnKeyType = {"next"}
                   keyboardType = 'numeric'
                 />
                <TouchableHighlight style={styles.button} onPress = {this.onPressSendPartnerData} underlayColor='#99d9f4'>
                   <Text style = {styles.buttonText}>{this.state.sendPartnerDataText}</Text>
                </TouchableHighlight>
                 <Text>
                   <Text>Send Partner Data Callback: </Text>
                   <Text style={{fontWeight: 'bold'}}>{this.state.sendPartnerDataCallback}</Text>
                 </Text>

                 <Text style={{fontWeight: 'bold', marginTop: 20}}>Providers:</Text>
                <Picker
                  selectedValue={this.state.provider}
                  onValueChange={(itemValue, itemIndex) => this.setState({provider : itemValue})}>
                  <Picker.Item label='facebook' value='facebook' />
                  <Picker.Item label='linkedin' value='linkedin' />
                  <Picker.Item label='yahoo' value='yahoo' />
                  <Picker.Item label='windowslive' value='windowslive' />
                  <Picker.Item label='google' value='google' />
                  <Picker.Item label='kakaostory' value='kakaostory' />
                  <Picker.Item label='twitter' value='twitter' />
                </Picker>
                 <TextField
                   label='Provider Id'
                   value={this.state.providerAccess.providerID}
                   onChangeText={ (providerID) => {this.state.providerAccess.providerID = providerID}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                   label='Provider Access Token'
                   value={this.state.providerAccess.accessToken}
                   onChangeText={ (accessToken) => {this.state.providerAccess.accessToken = accessToken}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                   label='Provider Extra Data (optional)'
                   value={this.state.providerAccess.extra_data}
                   onChangeText={ (extra_data) => {this.state.providerAccess.extra_data = extra_data}}
                   returnKeyType = {"next"}
                 />
                 <TextField
                   label='Access Token Expiration'
                   value={this.state.providerAccess.expiration}
                   onChangeText={ (expiration) => {this.state.providerAccess.expiration = expiration}}
                   returnKeyType = {"done"}
                   keyboardType = 'numeric'
                 />
                <TouchableHighlight style={styles.button} onPress = {this.onPressSendProviderAccessToken} underlayColor='#99d9f4'>
                  <Text style = {styles.buttonText}>{this.state.sendProviderAccessTokenText}</Text>
                </TouchableHighlight>

                 <Text>
                   <Text>Send Provider Access Token Callback: </Text>
                   <Text style={{fontWeight: 'bold'}}>{this.state.sendProviderAccessTokenCallback}</Text>
                 </Text>
            </View>
         </ScrollView>
      );
    }

  }

  startAndroidData() {
        RNDataSdkWrapper.setup(this.state.gatewayUrl,
        this.state.scoring.wifiOnly, this.state.scoring.enableCallLog,
        this.state.scoring.enableContact,this.state.scoring.enableLogDisplay,
        this.state.scoring.enableSms,this.state.scoring.enableCalendarEvent,
        this.state.scoring.enableInstalledApp, this.state.scoring.enableBrowserHistory,
        this.state.scoring.enableLocation, this.state.scoring.enableBattCharge,
        this.state.scoring.enableGalleryMetaData, this.state.scoring.enableSmsBody,
        this.state.scoring.enablePhoneNumber, this.state.scoring.enableContactsName,
        this.state.scoring.enableContactsEmail,  this.state.scoring.enableCalendarOrganizer,
        this.state.scoring.enableCalendarDisplayName, this.state.scoring.enableCalendarEmail,

        (result, logMsg, statusCode) => {console.log('result: ' + result);
            console.log('logMsg: ' + logMsg);
            console.log('statusCode: ' + statusCode);

        this.setState({dataSendingCallback: logMsg});
        RNDataSdkWrapper.statisticsEnabled(
        (statisticsEnabled) => {
            if(statisticsEnabled){
                this.setState({startDataText : 'STOP&CLEAR DATA SDK'})
            } else{
                this.setState({startDataText: 'START DATA SDK'})
            }
        });

        });
        RNDataSdkWrapper.startAndroidData(this.state.scoring.applicationId);
  }

  onPressStartData() {
       if (this.state.startDataText.toUpperCase() === 'START DATA SDK'.toUpperCase()) {

           if(this.state.scoring.applicationId == null || this.state.scoring.applicationId.trim() === "") {
             this.setState({errorApplicationId: 'This field is mandatory!'})
           } else {
             this.setState({errorApplicationId: null})
             this.setState({applicationIdDebugInfo: this.state.scoring.applicationId});

             this.setState({startDataText : 'STOP&CLEAR DATA SDK'})

             RNDataSdkWrapper.setApplicationId(this.state.scoring.applicationId);
             this.startAndroidData();
             this.setState({dataSendingCallback: 'process currently running'})
             if (this.state.scoring.wifiOnly){
                this.setState({uploadMode : 'Wifi'});
             } else {
                this.setState({uploadMode : 'Wifi + Mobile'});
             }

             RNDataSdkWrapper.getApplicationId((applicationId) => {
              this.setState({applicationIdDebugInfo: applicationId})
             });

             RNDataSdkWrapper.getDeviceUID((deviceId) => {
              this.setState({deviceIdDebugInfo: deviceId})
             });

             RNDataSdkWrapper.getServiceToken((serviceToken) => {
              this.setState({serviceTokenDebugInfo: serviceToken})
             });
           }


       } else {
           RNDataSdkWrapper.clear();
           this.setState({startDataText: 'START DATA SDK'})
           this.setState({dataSendingCallback: ''})
           this.setState({applicationIdDebugInfo: ''})
           this.setState({deviceIdDebugInfo: ''})
           this.setState({serviceTokenDebugInfo: ''})
       }


  }

  onPressSendPartnerData() {
     this.setState({sendPartnerDataCallback: 'process currently running'})
     RNDataSdkWrapper.sendPartnerApplicationData(this.state.verification.firstName, this.state.verification.middleName,
     this.state.verification.lastName, this.state.verification.dateOfBirth, this.state.verification.mobile, this.state.verification.home,
     this.state.verification.email, this.state.verification.employer, this.state.verification.university,
     this.state.verification.motherMaidenFirstName, this.state.verification.motherMaidenMiddleName,
     this.state.verification.motherMaidenLastName, this.state.verification.addressLine1,
     this.state.verification.addressLine2, this.state.verification.city, this.state.verification.administrativeRegion,
     this.state.verification.country, this.state.verification.postalCode, this.state.verification.latitude,
     this.state.verification.longitude, this.state.verification.referenceNumber, this.state.verification.jsonPayload,
     (result, logMsg, statusCode) => {console.log('result: ' + result);
            console.log('logMsg: ' + logMsg);
            console.log('statusCode: ' + statusCode);

            this.setState({sendPartnerDataCallback: logMsg});

            if (result==1) {
                RNDataSdkWrapper.submitFormFillingAnalytics()
            }
            });

  }

  onPressSendProviderAccessToken() {
     this.setState({sendProviderAccessTokenCallback: 'process currently running'})
     RNDataSdkWrapper.setProviderAccessToken(this.state.provider,
     this.state.providerAccess.accessToken, this.state.providerAccess.providerID, this.state.providerAccess.extra_data,
     String(this.state.providerAccess.expiration),
     (result, logMsg, statusCode) => {console.log('result: ' + result);
            console.log('logMsg: ' + logMsg);
            console.log('statusCode: ' + statusCode);

     this.setState({sendProviderAccessTokenCallback: logMsg})

     });

  }

  render() {
    return (
    <View style={styles.mainContainer}>
     <ToolbarAndroid
        title='React Native DataSDK Demo'
        style={styles.toolbar}
        titleColor='white'/>
      <TabViewAnimated
        style={[styles.mainContainer, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}/>
    </View>
    );
  }
}


const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    toolbar: {
      height: 56,
      backgroundColor: '#ff0000',
    },
    container: {
      justifyContent: 'center',
      padding: 20,
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
      alignSelf: 'center',
    },
    button: {
      height: 36,
      backgroundColor: '#48BBEC',
      borderColor: '#48BBEC',
      borderWidth: 1,
      borderRadius: 8,
      marginTop: 10,
      marginBottom: 10,
      alignSelf: 'stretch',
      justifyContent: 'center'
    },
    tabBar: {
      backgroundColor: '#ff0000',
    },
    indicator: {
      backgroundColor: '#ffeb3b',
    },
    label: {
      color: '#fff',
      fontWeight: '400',
    },
});
```