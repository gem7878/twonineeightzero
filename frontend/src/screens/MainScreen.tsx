import React, { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation'
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {
  StationsHeader,
  Maps,
  Congestion,
  GuideFooter,
} from '../components/index';

const MainScreen = ({}) => {

  const [latitude, setLatitude] = useState(Number);
  const [longitude, setLogitude] = useState(Number);
  
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLatitude(latitude);
        setLogitude(longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  return (
    <View>
      <MainContainer>
        <StationsHeader />
        <Maps />
        <Congestion />
        <View>
          <Text>lat : {latitude} </Text>
          <Text>lon : {longitude} </Text>
        </View>
      </MainContainer>
      <GuideFooter />
    </View>
  );
};

const MainContainer = styled.View`
  background-color: #ffffff;
  height: 90%;
  display: flex;
  align-items: center;
`;

export default MainScreen;
