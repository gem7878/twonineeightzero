import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import {LandingScreen, MainScreen} from './src/screens/index';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';

const App = () => {
  const Stack = createStackNavigator();
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
