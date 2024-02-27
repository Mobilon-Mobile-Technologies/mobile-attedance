import {
  View,
  Text,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

const Scanner = () => {
  const {height, width} = Dimensions.get('window');
  const [hasPermission, setHasPermission] = useState(null);
  const device = useCameraDevice('back');
  const [scanned, setScanned] = useState(false);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: code => {
      extractData(code);
      setScanned(true);
    },
  });

  const extractData = (code) => {
    const data = code.map(item => {
      const url=new URL(item.value);
      const temp=getTokenFromUrl(url);
      console.log(url);
      checkTokenValidity(temp.token, temp.coursecode, temp.groupcode)

    });
  };

  const getTokenFromUrl = (url) => {
    const params = {};
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    let match;
    while ((match = regex.exec(url)) !== null) {
        params[match[1]] = decodeURIComponent(match[2]);
    }
    return params;
  };

  const checkTokenValidity = async (token, coursecode, groupcode) => {
    try {
      const response = await fetch(
        `https://sixc1f0487-145f-4e33-8897-641d33f1d0e6.onrender.com/check_status/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.status);

        if (data.status === "valid") {
          console.log('you scanned a valid qr');


          // updateData(userdata, coursecode, groupcode, token);

        } else {
          console.log("you scanned a inalid qr code");
          setScanned(false);
        }
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error during token validity check:", error);
    }
  };
  

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
      {scanned ? <Text style={{color: 'black'}}>Scanned</Text> : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.1,
          }}>
          <Camera
            style={{height: height * 0.5, width: width * 0.8}}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
          />
        </View>
      )}
    </View>
  );
};

export default Scanner;
