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
        this.state = { val: "Start data collection" }
        this.onButtonPressed = this.onButtonPressed.bind(this);
        RNDataSdkWrapper.setup();
        UUIDGenerator.getRandomUUID().then((uuid) => {
            console.log('uuid: ', uuid);
		    RNDataSdkWrapper.startAndroidData(uuid);
        });
    }

    onButtonPressed() {
        this.setState({ val: "Started!" })
        const value = this._form.getValue(); // use that ref to get the form value
        console.log('value: ', value);
        if (this._form.validate().isValid()){
            RNDataSdkWrapper.sendPartnerApplicationData(JSON.stringify(value));
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
                <Text style = {styles.buttonText}>{this.state.val}</Text>
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
