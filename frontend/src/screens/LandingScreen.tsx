import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInputChangeEventData,
  NativeSyntheticEvent,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';

interface Props {
  navigation: any;
}

const LandingScreen: React.FC<Props> = ({navigation}) => {
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
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="visible-password"
            placeholder={'운양역'}
            placeholderTextColor="white"
            onChangeText={value => setStationName(value)}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Image source={require('../assets/icons/SearchIcon.png')} />
          </TouchableOpacity>
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
  background-color: black;
`;
const LandingTop = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 50px;
`;
const LandingText = styled.Text`
  font-size: 30px;
  color: white;
`;
const StationInputBox = styled.View`
  border: 1px solid #00ffd1;
  width: 210px;
  height: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: 20px;
  padding-right: 10px;
`;
const StationTextInput = styled.TextInput`
  height: 100%;
  font-size: 30px;
  padding-left: 35px;
  color: white;
`;
const LandingBottom = styled.Text`
  color: #7e7e7e;
  font-size: 18px;
  margin-top: 15px;
`;

export default LandingScreen;