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
      <Text>현재위치 : </Text>
      <Text>
        lat: {lat}, lon: {lon}
      </Text>
      <Image source={require('../../assets/icons/Refresh.png')} />
    </RefreshContainer>
  );
};
const RefreshContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export default Refresh;
