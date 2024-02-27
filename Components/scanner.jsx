import {
  View,
  Text,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {Camera, useCameraDevice,useCodeScanner} from 'react-native-vision-camera';

const Scanner = () => {
  const {height, width} = Dimensions.get('window');
  const [hasPermission, setHasPermission] = useState(null);
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`)
    }
  })

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
        <TouchableOpacity onPress={() => requestCameraPermission()}>
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
    <View style={{flex: 1}}>
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: height*0.1}}>
        <Camera
          style={{height: height * 0.5, width: width * 0.8}}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      </View>
    </View>
  );
};

export default Scanner;
