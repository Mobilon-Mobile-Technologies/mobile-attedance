/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import jwt_decode from 'jwt-decode';
import PublicClientApplication from 'react-native-msal';
import NetInfo from '@react-native-community/netinfo';
import Scanner from './Components/scanner';
import 'react-native-url-polyfill/auto';


function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [pca, setPca] = useState(null);
  const {height, width} = Dimensions.get('window');
  const [result, setResult] = useState(['']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const componentDidMount = async () => {
      let PCA;
      let clientID = 'c87ac4e5-e8c9-4cc6-8c3c-44790d7936da';
      let tenantID = '2c5bdaf4-8ff2-4bd9-bd54-7c50ab219590';
      let config = {
        auth: {
          clientId: clientID,
          authority: `https://login.microsoftonline.com/${tenantID}/v2.0`,
        },
      };
      PCA = new PublicClientApplication(config);
      try {
        await PCA.init();
        setPca(PCA);
      } catch (error) {
        console.error('Error initializing the pca, check your config.', error);
      }
    };

    componentDidMount();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View style={{display: 'flex', backgroundColor: 'white', height: height}}>
        <View style={{display: 'flex'}}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../auth/assets/uni_logo.png')}
              style={{
                height: height * 0.1,
                width: width * 0.3,
                resizeMode: 'contain',
              }}
            />
          </View>

          {loginStatus ? (
            <>
              <Text
                style={{
                  color: 'black',
                  marginLeft: 10,
                  fontSize: height * 0.03,
                  fontWeight: '500',
                }}>
                Student Attendance Portal
              </Text>

              <Text
                style={{
                  color: 'grey',
                  marginLeft: 10,
                  fontSize: height * 0.025,
                  marginTop: 20,
                  fontWeight: '500',
                }}>
                Your Details
              </Text>
              <Text
                style={{
                  color: 'black',
                  marginLeft: 10,
                  marginTop: 10,
                  fontSize: height * 0.016,
                }}>
                Name: {name}
              </Text>
              <Text
                style={{
                  color: 'black',
                  marginLeft: 10,
                  fontSize: height * 0.016,
                }}>
                Email: {email}
              </Text>
            </>
          ) : (
            <View
              style={{
                marginLeft: 10,
                marginTop: height * 0.2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'black'}}>
                You are not logged in. Press the login button below
              </Text>
            </View>
          )}
        </View>

        {loginStatus ? <Scanner name={name} email={email}/> : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: height * 0.25,
            }}>
            <Pressable
              onPress={async () => {
                let isConnected = false;
                await NetInfo.fetch().then(state => {
                  isConnected = state.isConnected;
                });
                if (!isConnected) {
                  Alert.alert(
                    'Internet Connection Lost',
                    'Please check your internet connection',
                    [{text: 'OK'}],
                  );
                  return false;
                }
                // Acquiring a token for the first time, you must call pca.acquireToken
                let scopes = ['profile', 'email'];
                let params = {scopes};
                let result;
                result = await pca.acquireToken(params);
                console.log('SSO Result ==> ', result);
                const {email, name} = result.account.claims;
                setLoginStatus(true);
                setResult(result);
                setName(name);
                setEmail(email);
              }}>
              <Text
                style={{
                  color: 'black',
                  color: '#0c4ca3',
                  backgroundColor: '#d6e8fc',
                  padding: width * 0.05,
                  borderRadius: 20,
                  paddingHorizontal: width * 0.1,
                }}>
                Login
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
