import React, { Component } from 'react';
import RNDataSdkWrapper from 'react-native-lenddodatasdk';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const ClientOptions = t.struct({
  applicationId: t.String,
  gatewayUrl: t.maybe(t.String),
  wifiOnly: t.Boolean,
  enableLogDisplay: t.Boolean,
  enableSms: t.Boolean,
  enableCallLog: t.Boolean,
  enableContact: t.Boolean,
  enableCalendarEvent: t.Boolean,
  enableInstalledApp: t.Boolean,
  enableBrowserHistory: t.Boolean,
  enableLocation: t.Boolean,
  enableBattCharge: t.Boolean,
  enableGalleryMetaData: t.Boolean,
  enableSmsBody: t.Boolean,
  enablePhoneNumber: t.Boolean,
  enableContactsName: t.Boolean,
  enableContactsEmail: t.Boolean,
  enableCalendarOrganizer: t.Boolean,
  enableCalendarDisplayName: t.Boolean,
  enableCalendarEmail: t.Boolean
});


const VerificationData = t.struct({
  applicationId: t.maybe(t.String),
  firstName: t.maybe(t.String),
  middleName: t.maybe(t.String),
  lastName: t.maybe(t.String),
  dateOfBirth: t.maybe(t.String),
  mobile: t.maybe(t.String),
  home: t.maybe(t.String),
  email: t.maybe(t.String),
  employer: t.maybe(t.String),
  university: t.maybe(t.String),
  motherMaidenFirstName: t.maybe(t.String),
  motherMaidenMiddleName: t.maybe(t.String),
  motherMaidenLastName: t.maybe(t.String),
  addressLine1: t.maybe(t.String),
  addressLine2: t.maybe(t.String),
  city: t.maybe(t.String),
  administrativeRegion: t.maybe(t.String),
  countryCode: t.maybe(t.String),
  postalCode: t.maybe(t.String),
  latitude: t.maybe(t.String),
  longitude: t.maybe(t.String)
});

const ProviderAccessData = t.struct({
  provider: t.String,
  accessToken: t.String,
  providerID: t.String,
  extra_data: t.maybe(t.String),
  expiration: t.maybe(t.Number)
});

var options = {
  fields: {
    applicationId: {
      label: 'Application ID'
    },
    providerID: {
      label: 'Provider ID'
    },
    enableLogDisplay: {
      label: 'Enable Debug Logs'
    },
    enableSms: {
      label: 'Enable SMS data collection'
    },
    enableCallLog: {
      label: 'Enable Call Logs data collection'
    },
    enableContact: {
      label: 'Enable Contacts data collection'
    },
    enableCalendarEvent: {
      label: 'Enable Calendar Events data collection'
    },
    enableInstalledApp: {
      label: 'Enable Installed Apps data collection'
    },
    enableBrowserHistory: {
      label: 'Enable Browser History data collection'
    },
    enableLocation: {
      label: 'Enable Location data collection'
    },
    enableBattCharge: {
      label: 'Enable Battery Charge data collection'
    },
    enableGalleryMetaData: {
      label: 'Enable Gallery Meta data collection'
    },
    enableSmsBody: {
      label: 'Enable SMS body data collection'
    },
    enablePhoneNumber: {
      label: 'Enable Phone Number hashing'
    },
    enableContactsName: {
      label: 'Enable Contacts Name hashing'
    },
    enableContactsEmail: {
      label: 'Enable Contacts Email hashing'
    },
    enableCalendarOrganizer: {
      label: 'Enable Calendar Organizer hashing (email)'
    },
    enableCalendarDisplayName: {
      label: 'Enable Calendar Display Name hashing'
    },
    enableCalendarEmail: {
      label: 'Enable Calendar Email hashing'
    },
  }
};

var value = {
  enableLogDisplay: true,
  enableSms: true,
  enableCallLog: true,
  enableContact: true,
  enableCalendarEvent: true,
  enableInstalledApp: true,
  enableBrowserHistory: true,
  enableLocation: true,
  enableBattCharge: true,
  enableGalleryMetaData: true

};

export default class App extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            startDataText:'START DATA SDK',
            sendPartnerDataText: 'SEND PARTNER DATA',
            sendProviderAccessTokenText: 'SEND PROVIDER ACCESS TOKEN'
        }
        this.onButtonPressed = this.onButtonPressed.bind(this);
        this.onButtonPressed1 = this.onButtonPressed1.bind(this);
        this.onButtonPressed2 = this.onButtonPressed2.bind(this);
    }

    startAndroidData(value) {
        RNDataSdkWrapper.setup(value.gatewayUrl,
        value.wifiOnly, value.enableCallLog,
        value.enableContact,value.enableLogDisplay,
        value.enableSms,value.enableCalendarEvent,
        value.enableInstalledApp, value.enableBrowserHistory,
        value.enableLocation, value.enableBattCharge,
        value.enableGalleryMetaData, value.enableSmsBody,
        value.enablePhoneNumber, value.enableContactsName,
        value.enableContactsEmail,  value.enableCalendarOrganizer,
        value.enableCalendarDisplayName, value.enableCalendarEmail,
        (msg) => {console.log(msg);
            RNDataSdkWrapper.statisticsEnabled(
            (statisticsEnabled) => {
                if(statisticsEnabled){
                    this.setState({startDataText: "STOP&CLEAR DATA SDK"})
                } else{
                    this.setState({startDataText: "START DATA SDK"})
                }
            });
        });
        RNDataSdkWrapper.startAndroidData(value.applicationID);
    }

    onButtonPressed() {
        if (this.state.startDataText.toUpperCase() === "START DATA SDK".toUpperCase()) {
            const value = this._startdata.getValue(); // use that ref to get the form value
            console.log('value: ', value);
            if (value) { // if validation fails, value will be null
              this.setState({startDataText: "STOP&CLEAR DATA SDK"})
              this.startAndroidData(value);
            }
        } else {
            this.setState({startDataText: "START DATA SDK"})
            RNDataSdkWrapper.clear();
        }

    }

    onButtonPressed1() {
            const value = this._verification.getValue(); // use that ref to get the form value
            console.log('value: ', value);
            if (value) { // if validation fails, value will be null
               RNDataSdkWrapper.sendPartnerApplicationData(value.firstName, value.middleName,
               value.lastName, value.dateOfBirth, value.mobile, value.home,
               value.email, value.employer, value.university,
               value.motherMaidenFirstName, value.motherMaidenMiddleName,
               value.motherMaidenLastName, value.addressLine1,
               value.addressLine2, value.city, value.administrativeRegion,
               value.countryCode, value.postalCode, value.latitude,
               value.longitude, value.applicationId,
              (msg) => {console.log(msg);  RNDataSdkWrapper.submitFormFillingAnalytics()});
            }

        }

    onButtonPressed2() {
            const value = this._provideraccess.getValue(); // use that ref to get the form value
            console.log('value: ', value);
            if (value) { // if validation fails, value will be null
                RNDataSdkWrapper.setProviderAccessToken(value.provider,
                value.accessToken, value.providerId, value.extra_data,
                String(value.expiration), (msg) => {console.log(msg);});
            }
     }

  render() {
    return (

        <ScrollView>
            <View style = {styles.container}>
              <Form
                 ref={component => this._startdata = component}
                 type={ClientOptions}
                 options={options}
                 value={value}
               />
               <TouchableHighlight style={styles.button} onPress = {this.onButtonPressed} underlayColor='#99d9f4'>
                  <Text style = {styles.buttonText}>{this.state.startDataText}</Text>
                </TouchableHighlight>
                <Form
                   ref={component => this._verification = component}
                   type={VerificationData}
                   options={options}
                />
                 <TouchableHighlight style={styles.button} onPress = {this.onButtonPressed1} underlayColor='#99d9f4'>
                    <Text style = {styles.buttonText}>{this.state.sendPartnerDataText}</Text>
                 </TouchableHighlight>
                 <Form
                    ref={component => this._provideraccess = component}
                    type={ProviderAccessData}
                    options={options}
                 />
                 <TouchableHighlight style={styles.button} onPress = {this.onButtonPressed2} underlayColor='#99d9f4'>
                   <Text style = {styles.buttonText}>{this.state.sendProviderAccessTokenText}</Text>
                 </TouchableHighlight>
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
    title: {
      fontSize: 30,
      alignSelf: 'center',
      marginBottom: 30
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
      alignSelf: 'center'
    },
    button: {
      height: 36,
      backgroundColor: '#48BBEC',
      borderColor: '#48BBEC',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 10,
      alignSelf: 'stretch',
      justifyContent: 'center'
    }
});
