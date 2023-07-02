import React, { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import {LandingScreen, MainScreen} from './src/screens/index';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const App = () => {
  const Stack = createStackNavigator();
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // 위치 권한이 허용된 경우
        } else {
          // 위치 권한이 거부된 경우
        }
      } catch (error) {
        console.log('Error requesting location permission:', error);
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Landing"
          options={{headerShown: false}}
          component={LandingScreen}
        />
        <Stack.Screen
          name="Main"
          options={{headerShown: false}}
          component={MainScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
