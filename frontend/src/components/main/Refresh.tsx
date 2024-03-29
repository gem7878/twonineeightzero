import React, { useEffect, useState } from 'react';
import {Image, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {searchAdress} from '../../apis/service/kakaoClient'; // 카카오API
interface RefreshProps {
  lat: any;
  lon: any;
  reLocation: Function;
}
const Refresh: React.FC<RefreshProps> = ({lat, lon, reLocation}) => {

  const [location, setLocation] = useState('');
  useEffect(() => {
    // 경도 위도에 따른 행정구역정보 받기
    const handleLocation = async () => {
      const roundedLongitude = Number(lon.toFixed(6));
      const roundedLatitude = Number(lat.toFixed(6));
      const result = await searchAdress(roundedLongitude, roundedLatitude);

      setLocation(result);

    };

    if (lon !== 0 && lat !== 0) handleLocation();
  }, [lat, lon]);
  
  return (
    <RefreshContainer>
      <RefreshText>현재위치 : </RefreshText>
      <RefreshText>{location}</RefreshText>
      <ImageButton onPress={() => reLocation()}>
        <IconImage source={require('../../assets/icons/Refresh.png')} alt=''/>
      </ImageButton>
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
const ImageButton = styled.TouchableOpacity`
`
const IconImage = styled.Image`
  margin: 4px;
`
export default Refresh;
