import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import Congestion from '../components/congestion';
import Maps from '../components/maps';
import StationsHeader from '../components/stationsHeader';
import GuideFooter from '../components/guideFooter';

const MainScreen = ({}) => {

  return (
    <View>
      <MainContainer>
        <StationsHeader></StationsHeader>
        <Maps></Maps>
        <Congestion></Congestion>
      </MainContainer>
      <GuideFooter
          $isMenu={false}></GuideFooter>
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
