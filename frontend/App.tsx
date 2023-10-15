import React from 'react';
import {
  LandingScreen,
  MainScreen,
  SignInScreen,
  SignUpScreen,
  DisasterGuideScreen,
  CustomerServiceMain,
  CustomerServiceWrite,
  CustomerServiceContent,
} from './src/screens/index.js';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

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
        <Stack.Screen
          name="SignIn"
          options={{headerShown: false}}
          component={SignInScreen}
        />
        <Stack.Screen
          name="SignUp"
          options={{headerShown: false}}
          component={SignUpScreen}
        />
        <Stack.Screen
          name="DisasterGuides"
          options={{headerShown: false}}
          component={DisasterGuideScreen}
        />
        <Stack.Screen
          name="CustomerService"
          options={{headerShown: false}}
          component={CustomerServiceMain}
        />
        <Stack.Screen
          name="CustomerServiceWrite"
          options={{headerShown: false}}
          component={CustomerServiceWrite}
        />
        <Stack.Screen
          name="CustomerServiceContent"
          options={{headerShown: false}}
          component={CustomerServiceContent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
