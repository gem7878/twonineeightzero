import React from 'react';
import {Image, Text, View} from 'react-native';
import styled from 'styled-components/native';

interface RefreshProps {
  lat: any;
  lon: any;
}

const Refresh: React.FC<RefreshProps> = ({lat, lon}) => {
  return (
    <RefreshContainer>
      <RefreshText>현재위치 : </RefreshText>
      <RefreshText>강서구 방화동{/* lat: {lat}, lon: {lon} */}</RefreshText>
      <Image source={require('../../assets/icons/Refresh.png')} alt='' />
    </RefreshContainer>
  );
};
const RefreshContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
const RefreshText = styled.Text`
  color: white;
`;

export default Refresh;