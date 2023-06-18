import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, Image} from 'react-native';
import styled from 'styled-components/native';

export interface IFacility {
  호선: string | undefined;
  전철역명: string | undefined;
  화장실: string | undefined;
  장애인화장실: string | undefined;
  에스컬레이터: string | undefined;
  엘레베이터: string | undefined;
}

const StationsHeader: React.FC = () => {
  const [facilities1, setFacilities1] = useState<IFacility | null>(null);
  const [facilities2, setFacilities2] = useState<IFacility | null>(null);
  const [current, setCurrent] = useState({'호선':'5','역명':'김포공항'});
  useEffect(() => {
    getData(current.호선, current.역명);
  }, []);

  /** Functions */

  const getData = async (
    currentLine: string | undefined,
    currentStation: string | undefined,
  ) => {
    axios
      .get(`http://10.0.2.2:3000/api/maps/${currentLine}/${currentStation}`)
      .then(function (res: any) {
        setFacilities1(res.data.전역);
        setFacilities2(res.data.후역);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };

  return (
    <HeaderContainer>
      <HeaderSearch>
        <SearchInput placeholder="‘화장실’의 위치를 알고 싶은가요?" />
        <Image
          source={require('../assets/icons/Search.png')}
          resizeMode="contain"
        />
      </HeaderSearch>
      <HeaderContent>
        <Text>여기는 O호선의 OO역 입니다.</Text>
        <ContentContainer>
          {/* <ContentBox>
            <Text>(전)역</Text>
            {facilities1.map((value: string, index: number) => {
              return <Text key={index}>{value}</Text>;
            })}
          </ContentBox>
          <ContentBox>
            <Text>(다음)역</Text>
            {facilities2.map((value: string) => {
              return <Text>{value}</Text>;
            })}
          </ContentBox> */}
        </ContentContainer>
      </HeaderContent>

      <HeaderToggleBtn>
        <TouchableOpacity />
      </HeaderToggleBtn>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.View`
  height: 280;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;
const HeaderSearch = styled.View`
  width: 313;
  height: 30;
  background-color: white;
  border: 1px solid black;
  margin-top: 20;
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
const HeaderContent = styled.View`
  width: 313;
  height: 200;
  margin-top: -10;
`;
const ContentContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 21;
  justify-content: center;
  margin-top: 20;
`;
const ContentBox = styled.View`
  width: 145;
  height: 150;
  background-color: white;
  display: flex;
  align-items: center;
`;
const HeaderToggleBtn = styled.View`
  width: 57;
  height: 12;
  background-color: white;
  border: 1px solid black;
  top: 5;
  z-index: 1000;
`;
export default StationsHeader;
