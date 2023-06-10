import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {
  StationsHeader,
  Maps,
  Congestion,
  GuideFooter,
} from '../components/index';

const MainScreen = ({}) => {
  return (
    <View>
      <MainContainer>
        <StationsHeader />
        <Maps />
        <Congestion />
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
