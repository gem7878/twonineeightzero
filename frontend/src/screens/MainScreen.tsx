import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {Search, Maps, GuideFooter, Content} from '../components/index';
interface Props {
  route: any;
  navigation: any;
}

const MainScreen: React.FC<Props> = ({route, navigation}) => {
  return (
    <MainContainer>
      <Search
        lat={route.params.lat}
        lon={route.params.lon}
        stationName={route.params.stationName}
        stationNum={route.params.stationNum}
        navigation={navigation}
      />
      <Content
        lat={route.params.lat}
        lon={route.params.lon}
        searchStationName={route.params.stationName}
        searchStationNum={route.params.stationNum}
      />
      <Maps />
      {/* <GuideFooter /> */}
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
