import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInputChangeEventData,
  NativeSyntheticEvent,
  TextInput,
  Image,
} from 'react-native';
import styled from 'styled-components/native';

const LandingScreen = () => {
  const [stationName, setStationName] = useState('');
  useEffect(() => {
    setStationName('운양역');
  }, [stationName]);

  const inputText = (value: string) => {
    setStationName(value);
  };

  return (
    <LandingContainer>
      <LandingTop>
        <StationInputBox>
          <StationTextInput
            placeholder={'운양역'}
            placeholderTextColor="black"
            onChangeText={value => setStationName(value)}
          />
          <Image source={require('../assets/icons/SearchIcon.png')} />
        </StationInputBox>
        <LandingText>을</LandingText>
      </LandingTop>
      <LandingText>검색하시오</LandingText>
      <LandingBottom>지하철 노선도 바로가기</LandingBottom>
    </LandingContainer>
  );
};
const LandingContainer = styled.View`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LandingTop = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 50px;
`;
const LandingText = styled.Text`
  font-size: 30px;
  color: black;
`;
const StationInputBox = styled.View`
  border: 1px solid black;
  width: 210px;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 20px;
`;
const StationTextInput = styled.TextInput`
  height: 100%;
  font-size: 30px;
  padding-left: 35px;
`;
const LandingBottom = styled.Text`
  color: #454545;
  font-size: 18px;
  margin-top: 15px;
`;

export default LandingScreen;
