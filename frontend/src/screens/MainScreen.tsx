import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {Search, Maps, GuideFooter, Content} from '../components/index';
import searchSubwayStations from '../apis/service/kakaoClient'; // 카카오API


const MainScreen = ({}) => {
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

  useEffect(() => { // 경도 위도에 따른 지하철역 검색
    const handleSearch = async () => {
      const roundedLongitude = Number(lon.toFixed(6));
      const roundedLatitude = Number(lat.toFixed(6));
      console.log(roundedLongitude,roundedLatitude);
      const result = await searchSubwayStations(roundedLongitude, roundedLatitude);
      const stations: Array<any> = [];
      result.forEach((value,index) => {
        //console.log(index+1, value.place_name.split(' ')) //값이 "구산역 6호선" ['구산역', '6호선']
        stations.push(value.place_name.split(' '));
      });

      setStations(stations as never[]);
      console.log(stations);

    };

    if (lon !== 0 && lat !== 0) handleSearch();
  }, [lat, lon]);

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
