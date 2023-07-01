import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Geolocation from '@react-native-community/geolocation';
import {searchSubwayStations} from '../apis/service/kakaoClient'; // 카카오API

interface Props {
  navigation: any;
}

const LandingScreen: React.FC<Props> = ({navigation}) => {
  const [stationName, setStationName] = useState('');
  const [lat, setLat] = useState(Number);
  const [lon, setLon] = useState(Number);
  const [stations, setStations] = useState([]); // 경도 위도에 따른 지하철역 검색 결과

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
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  useEffect(() => {
    // 경도 위도에 따른 지하철역 검색
    const handleSearch = async () => {
      const roundedLongitude = Number(lon.toFixed(6));
      const roundedLatitude = Number(lat.toFixed(6));
      const result = await searchSubwayStations(
        roundedLongitude,
        roundedLatitude,
      );
      const stations: Array<any> = [];
      result.forEach((value, index) => {
        //console.log(index+1, value.place_name.split(' ')) //값이 "구산역 6호선" ['구산역', '6호선']
        stations.push(value.place_name.split(' '));
      });

      setStations(stations as never[]);
      console.log(stations);
    };

    if (lon !== 0 && lat !== 0) {
      handleSearch();
    }
  }, [lat, lon]);
  useEffect(() => {
    if (stations.length > 0) {
      setStationName(stations[0][0]);
    }
  }, [stations]);
  console.log(stationName);

  return (
    <LandingContainer>
      <LandingTop>
        <StationInputBox>
          <StationTextInput
            placeholder={stationName}
            placeholderTextColor="white"
            onChangeText={value => setStationName(value)}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Main', {
                lat: lat,
                lon: lon,
                stations: stations,
              })
            }>
            <Image source={require('../assets/icons/SearchIcon.png')} />
          </TouchableOpacity>
        </StationInputBox>
        <LandingText>을</LandingText>
      </LandingTop>
      <LandingText>검색하시오</LandingText>
      {/* <LandingBottom>지하철 노선도 바로가기</LandingBottom> */}
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
  width: 240px;
  height: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: 15px;
  padding-right: 10px;
`;
const StationTextInput = styled.TextInput`
  height: 100%;
  font-size: 30px;
  padding-left: 20px;
  color: white;
`;
const LandingBottom = styled.Text`
  color: #7e7e7e;
  font-size: 18px;
  margin-top: 15px;
`;

export default LandingScreen;
