import React from 'react';
import {View} from 'react-native';
import {LandingScreen, MainScreen} from './src/screens/index';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  const Stack = createStackNavigator();
  return (
    <View>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Landing" component={LandingScreen} />
        </Stack.Navigator>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <LandingScreen /> */}
      {/* <MainScreen /> */}
    </View>
  );
};

export default App;
