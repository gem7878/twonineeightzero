import React, {useEffect, useState} from 'react';
import {Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import Geolocation from '@react-native-community/geolocation';
import {searchSubwayStations} from '../apis/service/kakaoClient'; // 카카오API
import axios from 'axios';

interface Props {
  navigation: any;
}

const LandingScreen: React.FC<Props> = ({navigation}) => {
  const [stationName, setStationName] = useState('');
  const [stationNum, setStationNum] = useState('');
  const [lat, setLat] = useState(Number);
  const [lon, setLon] = useState(Number);
  const [stations, setStations] = useState([]); // 경도 위도에 따른 지하철역 검색 결과
  const [inputName, setInputName] = useState('');
  const [heverIndex, setHoverIndex] = useState(-1);

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
      const stationsTmp: Array<any> = [];
      result.forEach((value, index) => {
        //console.log(index+1, value.place_name.split(' ')) //값이 "구산역 6호선" ['구산역', '6호선']
        stationsTmp.push(value.place_name.split(' '));
      });
      setStations(stationsTmp as never[]);
    };

    if (lon !== 0 && lat !== 0) {
      handleSearch();
    }
  }, [lat, lon]);

  useEffect(() => {
    if (stations.length > 0) {
      setStationName(stations[0][0]);
      setStationNum(stations[0][1]);
    }
  }, [stations]);

  const searchInputText = (value: string) => {
    setInputName(value);
    const valueSplit = value.split(/,| /);
    let tmp = [];
    for (let i = 0; i < valueSplit.length; i++) {
      if (valueSplit[i].length > 0) {
        tmp.push(valueSplit[i]);
      }
    }
    setStationName(tmp[0]);
    setStationNum(tmp[1]);
  };

  // 검색어 확인하기
  const checkSearchWord = async () => {
    let results = '';
    let replaceStationName = stationName.replace('역', '');
    let replaceStationNum = Number(stationNum.replace('호선', ''));

    await axios
      .get(
        `https://twonineeightzero-58c53d83021d.herokuapp.com/api/stationLine/${replaceStationNum}/${replaceStationName}`,
      )
      .then(function (res: any) {
        if (res.data.success === true) {
          const difference = ['5', '6', '7', '8'].filter(x => {
            return res.data.result.includes(x);
          }); // 지원하는 호선과 겹치는 데이터

          if ([5, 6, 7, 8].includes(replaceStationNum)) {
            results = 'true';
          } else if (difference.length > 0) {
            results = '검색하신 역은 ' + difference + '호선만 지원합니다.';
          } else {
            results = '아직 5호선~8호선만 지원합니다.';
          }
        } else {
          const difference = ['5', '6', '7', '8'].filter(x => {
            return res.data.result.includes(x);
          }); // 지원하는 호선과 겹치는 데이터
          if (difference.length > 0) {
            results =
              '검색하신 역은 ' +
              res.data.results +
              '호선만 있고, ' +
              difference +
              '호선만 지원합니다.';
          } else {
            results =
              '검색하신 역은 현재 지원하지 않습니다. 5호선~8호선의 역을 검색해주세요.';
          }
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
    if (results !== 'true') {
      Alert.alert('다시 검색하세요.', results, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } else {
      navigation.navigate('Main', {
        lat: lat,
        lon: lon,
        stationName: stationName,
        stationNum: stationNum,
      });
    }
  };

  return (
    <LandingContainer>
      <LandingTop>
        <LandingText>'역이름, 호선' 형식에 맞게 검색하시오.</LandingText>
        <StationInputBox>
          <StationTextInput
            placeholder={`${stationName}, ${stationNum}`}
            placeholderTextColor="white"
            onChangeText={value => {
              searchInputText(value);
            }}
            value={inputName}
          />
          <TouchableOpacity onPress={checkSearchWord}>
            <SearchIcon source={require('../assets/icons/SearchIcon.png')} />
          </TouchableOpacity>
        </StationInputBox>
      </LandingTop>
      <SuggestionView>
        {stations.map((value: any, index: number) => {
          const hoverStyle =
            heverIndex === index ? styles.buttonPressed : styles.button;
          if (index === stations.length - 1) {
            return (
              <SuggestionBtnLast
                key={index}
                onPressIn={() => {
                  setHoverIndex(index);
                  setStationName(value[0]);
                  setStationNum(value[1]);
                }}
                style={hoverStyle}>
                <SuggestionText>
                  {value[0]}, {value[1]}
                </SuggestionText>
              </SuggestionBtnLast>
            );
          } else {
            return (
              <SuggestionBtn
                key={index}
                onPressIn={() => {
                  setHoverIndex(index);
                  setStationName(value[0]);
                  setStationNum(value[1]);
                }}
                style={hoverStyle}>
                <SuggestionText>
                  {value[0]}, {value[1]}
                </SuggestionText>
              </SuggestionBtn>
            );
          }
        })}
      </SuggestionView>
      {/* <LandingBottom>지하철 노선도 바로가기</LandingBottom> */}
    </LandingContainer>
  );
};
const styles = StyleSheet.create({
  button: {},
  buttonPressed: {
    backgroundColor: '#00ffd042',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const SuggestionView = styled.View`
  border: 1px solid #00ffd1;
  background-color: white;
  width: 290px;
  padding: 10px 0;
`;
const SuggestionBtn = styled.TouchableOpacity`
  padding: 10px;
  border-bottom-color: #4646463b;
  border-bottom-width: 1px;
  padding-left: 17px;
`;
const SuggestionBtnLast = styled.TouchableOpacity`
  padding: 10px;
  padding-left: 17px;
`;
const SuggestionText = styled.Text`
  color: black;
`;
const LandingContainer = styled.View`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
`;
const LandingTop = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2px;
  margin-top: 50px;
`;
const LandingText = styled.Text`
  font-size: 17px;
  color: white;
  margin-bottom: 15px;
`;
const StationInputBox = styled.View`
  border: 1px solid #00ffd1;
  width: 290px;
  height: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
`;
const StationTextInput = styled.TextInput`
  height: 100%;
  font-size: 20px;
  padding-left: 15px;
  color: white;
`;
const SearchIcon = styled.Image`
  width: 35px;
  height: 35px;
`;

export default LandingScreen;
