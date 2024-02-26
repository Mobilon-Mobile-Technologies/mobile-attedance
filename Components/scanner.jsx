import {
  View,
  Text,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';

const Scanner = () => {
  const {height, width} = Dimensions.get('window');
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission to take pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={{flex: 1, alignItems: 'center', marginTop: height * 0.2}}>
        <Text style={{color: 'black'}}>No access to camera</Text>
        <TouchableOpacity
          onPress={() => setTimeout(() => requestCameraPermission(), 0)}>
          <Text
            style={{
              color: 'black',
              color: '#0c4ca3',
              backgroundColor: '#d6e8fc',
              padding: width * 0.04,
              borderRadius: 20,
              paddingHorizontal: 10,
            }}>
            Request Camera Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Text>Scanner</Text>
    </View>
  );
};

export default Scanner;
