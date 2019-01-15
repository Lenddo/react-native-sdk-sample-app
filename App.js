'use strict';

import React, { PureComponent } from 'react';
import { Platform, View, StyleSheet, Dimensions, Text, TouchableHighlight, ScrollView, ToolbarAndroid, Picker, Alert, BackHandler, DeviceEventEmitter, NativeEventEmitter} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { TextField } from 'react-native-material-textfield';
import CheckBox from 'react-native-check-box';
import { RNDataSdkWrapper , RNClientOptions, RNOnboardingSdkWrapper, RNFormDataCollector, RNOnboardingSdkWrapperIOS } from '@lenddo/react-native-sdk';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const OnboardingEventEmitter = Platform.OS == 'ios' ? new NativeEventEmitter(RNOnboardingSdkWrapperIOS) : DeviceEventEmitter;

export default class RNLenddoEFLSDKDemo extends PureComponent {

  constructor(props) {
    super(props);
    this.onPressStartData = this.onPressStartData.bind(this);
    this.onPressSendProviderAccessToken = this.onPressSendProviderAccessToken.bind(this);
    this.onPressStartOnboarding = this.onPressStartOnboarding.bind(this);
    this.focusNextField = this.focusNextField.bind(this);
    this.onActionSelected = this.onActionSelected.bind(this);
    this.inputs = {};
    this.state = {
        startDataText: 'START DATA SDK',
        sendProviderAccessTokenText: 'SEND PROVIDER ACCESS TOKEN',
        startOnboardingText: 'START ONBOARDING SDK',

        index: 0,

        enabled: true,

        routes: [
          { key: 'scoring', title: 'Scoring' },
          { key: 'verification', title: 'Verification' },
          { key: 'onboarding', title: 'Onboarding' },
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
          partnerScriptId: '59a65370f7a57941735f3bb7',
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
          enableMediaMetaData: true,
          enableTelephonyInformation: true,
          enableStoredFilesInformation: true,
          enableSensors: true,
          enableLauncherApps: true,
          enableWifiInfo: true,
          enableBluetoothInfo: true,
          enableAccountsInfo: true,
          enableGmailLabelsInfo: true,
          enablePeriodicalDataGathering: true,
          enableSmsBody: false,
          enablePhoneNumber: false,
          enableContactsName: false,
          enableContactsEmail: false,
          enableCalendarOrganizer: false,
          enableCalendarDisplayName: false,
          enableCalendarEmail: false
        },

        //Provider Access
        providerAccess: {
          accessToken: '',
          providerID: '',
          extra_data: '',
          expiration: ''
        },

        //FormDataCollector
        formData: {
          authorizeApiGateway: 'https://authorize-api%@.lendqa.com',
          binApiGateway: 'https://bin-api%@.lendqa.com',
          region: '',

          partnerScriptId: '59a65370f7a57941735f3bb7',
          secret: '',
          installationId: '',
          enableKYC: false,
          enableDataCollection: false,

          applicationId: '',

          enableAssistedPsychometrics: false,
          psychometricsApiGateway: '',

          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          workEmail: '',
          birthday: '',
          mobilePhone: '',
          homePhone: '',

          employerName: '',
          employmentStartDate: '',
          employmentEndDate: '',
          universityName: '',

          motherFirstName: '',
          motherLastName: '',
          motherMiddleName: '',

          addressLine1: '',
          addressLine2: '',
          city: '',
          administrativeDivision: '',
          countryCode: '',
          postalCode: '',

          workAddressLine1: '',
          workAddressLine2: '',
          workCity: '',
          workAdministrativeDivision: '',
          workCountryCode: '',
          workPostalCode: ''
        },
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillMount() {
    OnboardingEventEmitter.addListener('onAuthorizeStarted',(params) => {
         console.log("onAuthorizeStarted")
         console.log(params)
         }
    )
    OnboardingEventEmitter.addListener('onAuthorizeComplete',(params) => {
              console.log("onAuthorizeComplete")
              console.log(params)
         }
    )
    OnboardingEventEmitter.addListener('onAuthorizeCancelled',(params) => {
              console.log("onAuthorizeCancelled")
             console.log(params)
         }
    )
    OnboardingEventEmitter.addListener('onAuthorizeError',(params) => {
              console.log("onAuthorizeError")
              console.log(params)
         }
    )
    if (Platform.OS == 'android') {
        OnboardingEventEmitter.addListener('onAuthorizeFailure',(params) => {
                console.log("onAuthorizeFailure")
                console.log(params)
           }
        )
    }
  }


  handleBackPress = () => {
    RNOnboardingSdkWrapper.onBackPressed()
    return true;
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
           <CheckBox
                ref={(c) => this.enableMediaMetaData = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableMediaMetaData = !this.state.scoring.enableMediaMetaData}}
                isChecked={this.state.scoring.enableMediaMetaData}
                rightText='Enable Media Meta data collection'
            />
           <CheckBox
                ref={(c) => this.enableTelephonyInformation = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableTelephonyInformation = !this.state.scoring.enableTelephonyInformation}}
                isChecked={this.state.scoring.enableTelephonyInformation}
                rightText='Enable Telephony information collection'
            />
           <CheckBox
                ref={(c) => this.enableStoredFilesInformation = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableStoredFilesInformation = !this.state.scoring.enableStoredFilesInformation}}
                isChecked={this.state.scoring.enableStoredFilesInformation}
                rightText='Enable Stored files information collection'
            />
           <CheckBox
                ref={(c) => this.enableSensors = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableSensors = !this.state.scoring.enableSensors}}
                isChecked={this.state.scoring.enableSensors}
                rightText='Enable Sensors information collection'
            />
           <CheckBox
                ref={(c) => this.enableLauncherApps = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableLauncherApps = !this.state.scoring.enableLauncherApps}}
                isChecked={this.state.scoring.enableLauncherApps}
                rightText='Enable Launcher apps information collection'
            />
           <CheckBox
                ref={(c) => this.enableWifiInfo = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableWifiInfo = !this.state.scoring.enableWifiInfo}}
                isChecked={this.state.scoring.enableWifiInfo}
                rightText='Enable WiFi information collection'
            />
           <CheckBox
                ref={(c) => this.enableBluetoothInfo = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableBluetoothInfo = !this.state.scoring.enableBluetoothInfo}}
                isChecked={this.state.scoring.enableBluetoothInfo}
                rightText='Enable Bluetooth information collection'
            />
           <CheckBox
                ref={(c) => this.enableAccountsInfo = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableAccountsInfo = !this.state.scoring.enableAccountsInfo}}
                isChecked={this.state.scoring.enableAccountsInfo}
                rightText='Enable Accounts information collection'
            />
           <CheckBox
                ref={(c) => this.enableGmailLabelsInfo = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enableGmailLabelsInfo = !this.state.scoring.enableGmailLabelsInfo}}
                isChecked={this.state.scoring.enableGmailLabelsInfo}
                rightText='Enable Gmail labels information collection'
            />
           <CheckBox
                ref={(c) => this.enablePeriodicalDataGathering = c}
                style={{flex: 1, padding: 10}}
                disabled={!this.state.enabled}
                onClick={() => {this.state.scoring.enablePeriodicalDataGathering = !this.state.scoring.enablePeriodicalDataGathering}}
                isChecked={this.state.scoring.enablePeriodicalDataGathering}
                rightText='Enable Periodical Data gathering'
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
      case 'onboarding':
            return(
               <ScrollView>
                  <View style = {styles.container}>
                       <TextField
                           ref={ input => {
                             this.inputs['partnerScriptId'] = input;
                           }}
                            label='Partner Script Id'
                            value={this.state.formData.partnerScriptId}
                            onChangeText={ (partnerScriptId) => {this.state.formData.partnerScriptId = partnerScriptId}}
                            returnKeyType = {"next"}
                            blurOnSubmit={ false }
                           onSubmitEditing={() => {
                             this.focusNextField('applicationId');
                           }}
                          />
                       <TextField
                        ref={ input => {
                          this.inputs['applicationId'] = input;
                        }}
                         label='Application Id'
                         value={this.state.formData.applicationId}
                         onChangeText={ (applicationId) => {this.state.formData.applicationId = applicationId}}
                         returnKeyType = {"next"}
                         blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('firstName');
                        }}
                       />
                       <TextField
                        ref={ input => {
                          this.inputs['firstName'] = input;
                        }}
                         label='First Name'
                         value={this.state.formData.firstName}
                         onChangeText={ (firstName) => {this.state.formData.firstName = firstName}}
                         returnKeyType = {"next"}
                         blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('middleName');
                        }}
                       />
                       <TextField
                        ref={ input => {
                          this.inputs['middleName'] = input;
                        }}
                         label='Middle Name'
                         value={this.state.formData.middleName}
                         onChangeText={ (middleName) => {this.state.formData.middleName = middleName}}
                         returnKeyType = {"next"}
                         blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('lastName');
                        }}
                       />
                       <TextField
                           ref={ input => {
                             this.inputs['lastName'] = input;
                           }}
                            label='Last Name'
                            value={this.state.formData.lastName}
                            onChangeText={ (lastName) => {this.state.formData.lastName = lastName}}
                            returnKeyType = {"next"}
                            blurOnSubmit={ false }
                           onSubmitEditing={() => {
                             this.focusNextField('dateOfBirth');
                           }}
                          />
                       <TextField
                        ref={ input => {
                          this.inputs['dateOfBirth'] = input;
                        }}
                         label='Date of Birth (MM/dd/yyyy)'
                         value={this.state.formData.dateOfBirth}
                         onChangeText={ (dateOfBirth) => {this.state.formData.dateOfBirth = dateOfBirth}}
                         returnKeyType = {"done"}
                         keyboardType = 'numeric'
                         blurOnSubmit={ true }
                       />
                      <TouchableHighlight style={styles.button} onPress = {this.onPressStartOnboarding} underlayColor='#99d9f4'>
                        <Text style = {styles.buttonText}>{this.state.startOnboardingText}</Text>
                      </TouchableHighlight>
                  </View>
               </ScrollView>
            );
    }

  }

  startAndroidData() {
        RNDataSdkWrapper.setPartnerScriptId(this.state.scoring.partnerScriptId);
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
        RNClientOptions.refreshClientOptions();
        RNClientOptions.setApiGatewayUrl(this.state.gatewayUrl);
        RNClientOptions.setWifiOnly(this.state.scoring.wifiOnly);
        RNClientOptions.enableLogDisplay(this.state.scoring.enableLogDisplay);
        if (!this.state.scoring.enableSms) RNClientOptions.disableSMSDataCollection();
        if (!this.state.scoring.enableCallLog) RNClientOptions.disableCallLogDataCollection();
        if (!this.state.scoring.enableContact) RNClientOptions.disableContactDataCollection();
        if (!this.state.scoring.enableCalendarEvent) RNClientOptions.disableCalendarEventDataCollection();
        if (!this.state.scoring.enableInstalledApp) RNClientOptions.disableInstalledAppDataCollection();
        if (!this.state.scoring.enableBrowserHistory) RNClientOptions.disableBrowserHistoryDataCollection();
        if (!this.state.scoring.enableLocation) RNClientOptions.disableLocationDataCollection();
        if (!this.state.scoring.enableBattCharge) RNClientOptions.disableBattChargeDataCollection();
        if (!this.state.scoring.enableLocation) RNClientOptions.disableLocationDataCollection();
        if (!this.state.scoring.enableGalleryMetaData) RNClientOptions.disableGalleryMetaDataCollection();
        if (!this.state.scoring.enableMediaMetaData) RNClientOptions.disableMediaMetaDataCollection();
        if (!this.state.scoring.enableTelephonyInformation) RNClientOptions.disableTelephonyInfoDataCollection();
        if (!this.state.scoring.enableStoredFilesInformation) RNClientOptions.disableStoredFilesInformationCollection();
        if (!this.state.scoring.enableSensors) RNClientOptions.disableSensorsCollection();
        if (!this.state.scoring.enableLauncherApps) RNClientOptions.disableLauncherAppsCollection();
        if (!this.state.scoring.enableWifiInfo) RNClientOptions.disableWifiInfoCollection();
        if (!this.state.scoring.enableBluetoothInfo) RNClientOptions.disableBluetoothInfoCollection();
        if (!this.state.scoring.enableAccountsInfo) RNClientOptions.disableAccountsInfoCollection();
        if (!this.state.scoring.enableGmailLabelsInfo) RNClientOptions.disableGmailLabelsInfoCollection();
        if (!this.state.scoring.enablePeriodicalDataGathering) RNClientOptions.disablePeriodicalDataGathering();
        if (!this.state.scoring.enableSmsBody) RNClientOptions.disableSMSBodyCollection();
        if (!this.state.scoring.enablePhoneNumber) RNClientOptions.enablePhoneNumberHashing();
        if (!this.state.scoring.enableContactsName) RNClientOptions.enableContactsNameHashing();
        if (!this.state.scoring.enableContactsEmail) RNClientOptions.enableContactsEmailHashing();
        if (!this.state.scoring.enableCalendarOrganizer) RNClientOptions.enableCalendarOrganizerHashing();
        if (!this.state.scoring.enableCalendarDisplayName) RNClientOptions.enableCalendarDisplayNameHashing();
        if (!this.state.scoring.enableCalendarEmail) RNClientOptions.enableCalendarEmailHashing();

        RNDataSdkWrapper.setPartnerScriptId(this.state.scoring.partnerScriptId);
        RNDataSdkWrapper.setupWithClientOptions();
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



  onPressStartData() {
    if (Platform.OS === 'android') {
        if (this.state.startDataText.toUpperCase() === 'START DATA SDK'.toUpperCase()) {
            RNDataSdkWrapper.clear();
            this.setState({enabled: true});
            this.setState({dataSendingCallback: ''})
            this.setState({applicationIdDebugInfo: ''})
            this.setState({deviceIdDebugInfo: ''})
            this.setState({serviceTokenDebugInfo: ''})

            if (this.state.scoring.applicationId == null || this.state.scoring.applicationId.trim() === "") {
                this.setState({errorApplicationId: 'This field is mandatory!'})
                this.setState({enabled: true});
            } else {
                this.setState({enabled: false});
                this.setState({errorApplicationId: null})
                this.setState({applicationIdDebugInfo: this.state.scoring.applicationId});
                this.setState({startDataText : 'STOP&CLEAR DATA SDK'})
                console.log('gatewayUrl: ' + this.state.gatewayUrl)

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
  }


  onPressSendProviderAccessToken() {
    if (Platform.OS === 'android') {
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
  }


  onPressStartOnboarding() {
     if (Platform.OS === 'ios') {
        RNOnboardingSdkWrapperIOS.showAuthorizeWithFormData(this.state.formData, (error, events) => {
            if (error) {
                console.error(error);
            } else {
                console.log(JSON.stringify(events));
            }
        })
     }
     else if (Platform.OS === 'android') {
         /*
           setPartnerScriptId
           setApplicationId
           setFirstName
           setLastName
           setMiddleName
           setHomePhone
           setMobilePhone
           setEmail
           setWorkEmail
           setDateOfBirth - dd/MM
           setStartEmploymentDate
           setEndEmploymentDate
           setUniversityName
           putField
           addGovernmentId
           setGovernmentIds
           setAddress
         */
         RNFormDataCollector.refreshFormDataCollector()
         RNFormDataCollector.setApplicationId(this.state.formData.applicationId)
         RNFormDataCollector.setFirstName(this.state.formData.firstName)
         RNFormDataCollector.setMiddleName(this.state.formData.middleName)
         RNFormDataCollector.setLastName(this.state.formData.lastName)

         RNOnboardingSdkWrapper.setPartnerScriptId(this.state.formData.partnerScriptId)
         RNOnboardingSdkWrapper.startAuthorize()
     }
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
        title='React Native SDK Demo'
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