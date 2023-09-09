import React, {useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

interface Props {
  lat: Number;
  lon: Number;
  stationName: any;
  stationNum: any;
  navigation: any;
}

const Search: React.FC<Props> = ({
  lat,
  lon,
  stationName,
  stationNum,
  navigation,
}) => {
  const [inputName, setInputName] = useState('');
  const [newStationName, setNewStationName] = useState('');
  const [newStationNum, setNewStationNum] = useState('');
  const searchInputText = (value: string) => {
    setInputName(value);
    const valueSplit = value.split(/,| /);
    let tmp = [];
    for (let i = 0; i < valueSplit.length; i++) {
      if (valueSplit[i].length > 0) {
        tmp.push(valueSplit[i]);
      }
    }
    setNewStationName(tmp[0]);
    setNewStationNum(tmp[1]);
  };
  return (
    <SearchContainer>
      <SearchBox>
        <SearchInput
          onChangeText={value => {
            searchInputText(value);
          }}
          placeholder={`'${stationName}, ${stationNum}' 검색하기`}
          value={inputName}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Main', {
              lat: lat,
              lon: lon,
              stationName: newStationName,
              stationNum: newStationNum,
            })
          }>
          <Image
            source={require('../assets/icons/Search.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </SearchBox>
    </SearchContainer>
  );
};
const SearchContainer = styled.View`
  width: 100%;
  padding: 25px;
  height: 11%;
`;
const SearchBox = styled.View`
  width: 100%;
  height: 30px;
  background-color: white;
  border: 1px solid black;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
`;
const SearchInput = styled.TextInput`
  width: 80%;
  padding: 0;
`;
export default Search;
