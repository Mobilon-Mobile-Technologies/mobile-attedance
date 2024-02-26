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
  Pressable
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

function Section({children, title}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [pca, setPca] = useState(null);

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
        }}>
        <Text>Login</Text>
      </Pressable>
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
