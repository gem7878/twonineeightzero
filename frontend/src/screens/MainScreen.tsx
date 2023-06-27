import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {Search, Maps, GuideFooter, Content} from '../components/index';

const MainScreen = ({}) => {
  const [lat, setLat] = useState(Number);
  const [lon, setLon] = useState(Number);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLat(latitude);
        setLon(longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  return (
    <MainContainer>
      <Search />
      <Content lat={lat} lon={lon} />
      <Maps />
      <GuideFooter />
    </MainContainer>
  );
};

const MainContainer = styled.View`
  background-color: black;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export default MainScreen;
