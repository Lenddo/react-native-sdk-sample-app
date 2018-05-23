'use strict';

import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableHighlight, ScrollView, ToolbarAndroid, Picker, Alert} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { TextField } from 'react-native-material-textfield';
import CheckBox from 'react-native-check-box';
import RNDataSdkWrapper from '@lenddo/react-native-sdk';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};


export default class RNDataSDKDemo extends PureComponent {

  constructor(props) {
    super(props);
    this.onPressStartData = this.onPressStartData.bind(this);
    this.onPressSendProviderAccessToken = this.onPressSendProviderAccessToken.bind(this);
    this.focusNextField = this.focusNextField.bind(this);
    this.onActionSelected = this.onActionSelected.bind(this);
    this.inputs = {};
    this.state = {
        startDataText: 'START DATA SDK',
        sendProviderAccessTokenText: 'SEND PROVIDER ACCESS TOKEN',

        index: 0,

        enabled: true,

        routes: [
          { key: 'scoring', title: 'Scoring' },
          { key: 'verification', title: 'Verification' },
        ],

        applicationIdDebugInfo : '',
        deviceIdDebugInfo: '',
        serviceTokenDebugInfo: '',
        dataSendingCallback: '',
        sendProviderAccessTokenCallback: '',
        errorApplicationId : null,

        //Picker default values
        gatewayUrl: 'https://gateway.partner-service.link',
        uploadMode: 'Wifi + Mobile',
        provider: 'facebook',

        //Scoring
        scoring: {
          applicationId : '',
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

        //Provider Access
        providerAccess: {
          accessToken: '',
          providerID: '',
          extra_data: '',
          expiration: '',
        }
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
             ref={(c) => this._applicationId = c}
             label='Application ID'
             value={this.state.scoring.applicationId}
             onChangeText={ (applicationId) => {this.state.scoring.applicationId = applicationId}}
             returnKeyType = {"done"}
             error={this.state.errorApplicationId}
             blurOnSubmit={ true }
             editable={this.state.enabled}
           />
           <Text style={{fontWeight: 'bold'}}>Settings:</Text>
           <Picker
             ref={(c) => this.gatewayUrl = c}
             selectedValue={this.state.gatewayUrl}
             onValueChange={(itemValue, itemIndex) => {this.setState({gatewayUrl: itemValue})}}
             enabled={this.state.enabled}>
             <Picker.Item label="https://gateway.partner-service.link" value='https://gateway.partner-service.link' />
             <Picker.Item label="https://gateway-kr.partner-service.link" value='https://gateway-kr.partner-service.link' />
           </Picker>
           <Picker
             ref={(c) => this.uploadMode = c}
             selectedValue={this.state.uploadMode}
             enabled={this.state.enabled}
             onValueChange={(itemValue, itemIndex) => {this.setState({uploadMode: itemValue});  if(itemIndex === 0) {this.state.scoring.wifiOnly = false; }else {this.state.scoring.wifiOnly = true;} }}>
             <Picker.Item label="Wifi + Mobile" value='Wifi + Mobile' />
             <Picker.Item label="Wifi" value='Wifi' />
           </Picker>
            <CheckBox
                ref={(c) => this.enableLogDisplay = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableLogDisplay = !this.state.scoring.enableLogDisplay}}
                isChecked={this.state.scoring.enableLogDisplay}
                rightText='Enable Debug Logs'
            />
           <Text style={{fontWeight: 'bold'}}>Data type:</Text>
           <CheckBox
                ref={(c) => this.enableSms = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableSms = !this.state.scoring.enableSms}}
                isChecked={this.state.scoring.enableSms}
                rightText='Enable SMS data collection'
            />
           <CheckBox
                ref={(c) => this.enableCallLog = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableCallLog = !this.state.scoring.enableCallLog}}
                isChecked={this.state.scoring.enableCallLog}
                rightText='Enable Call Logs data collection'
            />
           <CheckBox
                ref={(c) => this.enableContact = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableContact = !this.state.scoring.enableContact}}
                isChecked={this.state.scoring.enableContact}
                rightText='Enable Contacts data collection'
            />

           <CheckBox
                ref={(c) => this.enableCalendarEvent = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableCalendarEvent = !this.state.scoring.enableCalendarEvent}}
                isChecked={this.state.scoring.enableCalendarEvent}
                rightText='Enable Calendar Events data collection'
            />

           <CheckBox
                ref={(c) => this.enableInstalledApp = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableInstalledApp = !this.state.scoring.enableInstalledApp}}
                isChecked={this.state.scoring.enableInstalledApp}
                rightText='Enable Installed Apps data collection'
            />

           <CheckBox
                ref={(c) => this.enableBrowserHistory = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableBrowserHistory = !this.state.scoring.enableBrowserHistory}}
                isChecked={this.state.scoring.enableBrowserHistory}
                rightText='Enable Browser History data collection'
            />

           <CheckBox
                ref={(c) => this.enableLocation = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableLocation = !this.state.scoring.enableLocation}}
                isChecked={this.state.scoring.enableLocation}
                rightText='Enable Location data collection'
            />

           <CheckBox
                ref={(c) => this.enableBattCharge = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableBattCharge = !this.state.scoring.enableBattCharge}}
                isChecked={this.state.scoring.enableBattCharge}
                rightText='Enable Battery Charge data collection'
            />

           <CheckBox
                ref={(c) => this.enableGalleryMetaData = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableGalleryMetaData = !this.state.scoring.enableGalleryMetaData}}
                isChecked={this.state.scoring.enableGalleryMetaData}
                rightText='Enable Gallery Meta data collection'
            />
            <Text style={{fontWeight: 'bold'}}>SMS Message content:</Text>
            <CheckBox
                ref={(c) => this.enableSmsBody = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableSmsBody = !this.state.scoring.enableSmsBody}}
                isChecked={this.state.scoring.enableSmsBody}
                rightText='Enable SMS Body data collection'
            />
            <Text style={{fontWeight: 'bold'}}>Data hashing:</Text>
            <CheckBox
                ref={(c) => this.enablePhoneNumber = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enablePhoneNumber = !this.state.scoring.enablePhoneNumber}}
                isChecked={this.state.scoring.enablePhoneNumber}
                rightText='Enable Phone Number hashing'
            />
            <CheckBox
                ref={(c) => this.enableContactsName = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableContactsName = !this.state.enableContactsName}}
                isChecked={this.state.scoring.enableContactsName}
                rightText='Enable Contacts Name hashing'
            />
            <CheckBox
                ref={(c) => this.enableContactsEmail = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableContactsEmail = !this.state.enableContactsEmail}}
                isChecked={this.state.scoring.enableContactsEmail}
                rightText='Enable Contacts Email hashing'
            />
            <CheckBox
                ref={(c) => this.enableCalendarOrganizer = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableCalendarOrganizer = !this.state.scoring.enableCalendarOrganizer}}
                isChecked={this.state.scoring.enableCalendarOrganizer}
                rightText='Enable Calendar Organizer hashing'
            />
            <CheckBox
                ref={(c) => this.enableCalendarDisplayName = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableCalendarDisplayName = !this.state.scoring.enableCalendarDisplayName}}
                isChecked={this.state.scoring.enableCalendarDisplayName}
                rightText='Enable Calendar Display Name hashing'
            />
            <CheckBox
                ref={(c) => this.enableCalendarEmail = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
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
                 <Text style={{fontWeight: 'bold', marginTop: 20}}>Providers:</Text>
                <Picker
                  ref={(c) => this.provider = c}
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
                  ref={ input => {
                    this.inputs['providerID'] = input;
                  }}
                   label='Provider Id'
                   value={this.state.providerAccess.providerID}
                   onChangeText={ (providerID) => {this.state.providerAccess.providerID = providerID}}
                   returnKeyType = {"next"}
                   blurOnSubmit={ false }
                  onSubmitEditing={() => {
                    this.focusNextField('accessToken');
                  }}
                 />
                 <TextField
                  ref={ input => {
                    this.inputs['accessToken'] = input;
                  }}
                   label='Provider Access Token'
                   value={this.state.providerAccess.accessToken}
                   onChangeText={ (accessToken) => {this.state.providerAccess.accessToken = accessToken}}
                   returnKeyType = {"next"}
                   blurOnSubmit={ false }
                  onSubmitEditing={() => {
                    this.focusNextField('extra_data');
                  }}
                 />
                 <TextField
                  ref={ input => {
                    this.inputs['extra_data'] = input;
                  }}
                   label='Provider Extra Data (optional)'
                   value={this.state.providerAccess.extra_data}
                   onChangeText={ (extra_data) => {this.state.providerAccess.extra_data = extra_data}}
                   returnKeyType = {"next"}
                   blurOnSubmit={ false }
                  onSubmitEditing={() => {
                    this.focusNextField('expiration');
                  }}
                 />
                 <TextField
                  ref={ input => {
                    this.inputs['expiration'] = input;
                  }}
                   label='Access Token Expiration'
                   value={this.state.providerAccess.expiration}
                   onChangeText={ (expiration) => {this.state.providerAccess.expiration = expiration.replace(/[^0-9]/g, '')}}
                   returnKeyType = {"done"}
                   keyboardType = 'numeric'
                   blurOnSubmit={ true }
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
                this.setState({startDataText: 'START DATA SDK'})
            }
        });

        });
        RNDataSdkWrapper.startAndroidData(this.state.scoring.applicationId);
  }

  startAndroidDataWithClientOptions() {
        var clientOptions = new RNDataSdkWrapper.RNClientOptions()
        clientOptions.setApiGatewayUrl(this.state.gatewayUrl);
        clientOptions.setWifiOnly(this.state.scoring.wifiOnly);
        clientOptions.enableLogDisplay(this.state.scoring.enableLogDisplay);
        if (!this.state.scoring.enableSms) clientOptions.disableSMSDataCollection();
        if (!this.state.scoring.enableCallLog) clientOptions.disableCallLogDataCollection();
        if (!this.state.scoring.enableContact) clientOptions.disableContactDataCollection();
        if (!this.state.scoring.enableCalendarEvent) clientOptions.disableCalendarEventDataCollection();
        if (!this.state.scoring.enableInstalledApp) clientOptions.disableInstalledAppDataCollection();
        if (!this.state.scoring.enableBrowserHistory) clientOptions.disableBrowserHistoryDataCollection();
        if (!this.state.scoring.enableLocation) clientOptions.disableLocationDataCollection();
        if (!this.state.scoring.enableBattCharge) clientOptions.disableBattChargeDataCollection();
        if (!this.state.scoring.enableLocation) clientOptions.disableLocationDataCollection();
        if (!this.state.scoring.enableGalleryMetaData) clientOptions.disableGalleryMetaDataCollection();
        if (!this.state.scoring.enableSmsBody) clientOptions.disableSMSBodyCollection();
        if (!this.state.scoring.enablePhoneNumber) clientOptions.enablePhoneNumberHashing();
        if (!this.state.scoring.enableContactsName) clientOptions.enableContactsNameHashing();
        if (!this.state.scoring.enableContactsEmail) clientOptions.enableContactsEmailHashing();
        if (!this.state.scoring.enableCalendarOrganizer) clientOptions.enableCalendarOrganizerHashing();
        if (!this.state.scoring.enableCalendarDisplayName) clientOptions.enableCalendarDisplayNameHashing();
        if (!this.state.scoring.enableCalendarEmail) clientOptions.enableCalendarEmailHashing();

        clientOptions.setReactNativeCallback(
        (result, logMsg, statusCode) => {console.log('result: ' + result);
                    console.log('logMsg: ' + logMsg);
                    console.log('statusCode: ' + statusCode);

        RNDataSdkWrapper.setupWithClientOptions(clientOptions);

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

	       RNDataSdkWrapper.clear();
	       this.setState({enabled: true});
	       this.setState({dataSendingCallback: ''})
	       this.setState({applicationIdDebugInfo: ''})
	       this.setState({deviceIdDebugInfo: ''})
	       this.setState({serviceTokenDebugInfo: ''})

           if(this.state.scoring.applicationId == null || this.state.scoring.applicationId.trim() === "") {
             this.setState({errorApplicationId: 'This field is mandatory!'})
             this.setState({enabled: true});
           } else {
             this.setState({enabled: false});
             this.setState({errorApplicationId: null})
             this.setState({applicationIdDebugInfo: this.state.scoring.applicationId});
             this.setState({startDataText : 'STOP&CLEAR DATA SDK'})
              console.log('gatewayUrl: ' + this.state.gatewayUrl)
              if (this.state.gatewayUrl != null) {
                  if (this.state.gatewayUrl === ("https://gateway.partner-service.link")) {
                     RNDataSdkWrapper.setPartnerScriptId(0);
                     RNDataSdkWrapper.setApiSecret(0);
                  } else {
                     RNDataSdkWrapper.setPartnerScriptId(1);
                     RNDataSdkWrapper.setApiSecret(1);
                  }
              } else {
                RNDataSdkWrapper.setPartnerScriptId(0);
                RNDataSdkWrapper.setApiSecret(0);
              }

             RNDataSdkWrapper.setApplicationId(this.state.scoring.applicationId);

             this.startAndroidDataWithClientOptions();

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
           this.setState({enabled: true});
           this.setState({startDataText: 'START DATA SDK'})
           this.setState({dataSendingCallback: ''})
           this.setState({applicationIdDebugInfo: ''})
           this.setState({deviceIdDebugInfo: ''})
           this.setState({serviceTokenDebugInfo: ''})
       }


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

  focusNextField(id) {
    this.inputs[id].focus();
  }


  onActionSelected(position) {
    if (position === 0) { // index of 'About'
      this.showAbout();
    }
  }

  showAbout() {
     Alert.alert(
       'React Native DataSDK Demo Application',
       'Application version: v0.0.1\nData SDK version: v2.22.1',
       [
         {text: 'OK', onPress: () => console.log('OK Pressed')},
       ],
       { cancelable: false }
     )
  }

  render() {
    return (
    <View style={styles.mainContainer}>
     <ToolbarAndroid
        title='React Native DataSDK Demo'
        style={styles.toolbar}
        titleColor='white'
        actions={[{title: 'About'}]}
        onActionSelected={this.onActionSelected}/>
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