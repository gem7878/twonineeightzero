import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {Congestion, Refresh} from './index';

interface ContentProps {
  lat: any;
  lon: any;
}
export interface IFacility {
  호선: string | undefined;
  전철역명: string | undefined;
  화장실: string | undefined;
  장애인화장실: string | undefined;
  에스컬레이터: string | undefined;
  엘레베이터: string | undefined;
}
const Content: React.FC<ContentProps> = ({lat, lon}) => {
  const [facilities1, setFacilities1] = useState<IFacility | null>(null);
  const [facilities2, setFacilities2] = useState<IFacility | null>(null);
  const [stationName, setStationName] = useState<string>('개화산');
  const [preStation, setPreStation] = useState<string>('방화');
  const [nextStation, setNextStation] = useState<string>('김포공항');
  const [lineNumList, setLineNumList] = useState<number[]>([1, 2, 5]);
  const [current, setCurrent] = useState({호선: '5', 역명: '김포공항'});

  useEffect(() => {
    getData(current.호선, current.역명);
  }, []);

  /** Functions */
  console.log(facilities1);
  console.log(facilities2);

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
    <ContentContainer>
      <ContentHeader>
        <Refresh lat={lat} lon={lon} />
        <LineNumberListContainer>
          <LineNumberListBox>
            {lineNumList.map((value: number, index: number) => {
              return (
                <LineNumberListItem key={index}>{value}</LineNumberListItem>
              );
            })}
          </LineNumberListBox>
          <LineNumberListBorderBottom />
        </LineNumberListContainer>
      </ContentHeader>
      <ContentMain>
        <StationContainer>
          <StationBox>
            <StationText>&lt;&nbsp;&nbsp;</StationText>
            <StationText>{preStation}</StationText>
          </StationBox>
          <StationMainBox>
            <BlackText>5 {stationName}</BlackText>
          </StationMainBox>
          <StationBox>
            <StationText>{nextStation}</StationText>
            <StationText>&nbsp;&nbsp;&gt;</StationText>
          </StationBox>
        </StationContainer>
        <FacilityHeader>역 내 주요 시설</FacilityHeader>
        <FacilityContainer>
          <BlackText>{stationName}역의 주요 시설물</BlackText>
        </FacilityContainer>

        <Congestion stationName={stationName} BlackText={BlackText} />
        <FacilityPreNextContainer>
          <FacilityBox>
            <BlackText>{preStation}역의 시설물</BlackText>
            {/* {facilities1?.map((value: string, index: number) => {
              return <Text key={index}>{value}</Text>;
            })} */}
          </FacilityBox>
          <FacilityBox>
            <BlackText>{nextStation}역의 시설물</BlackText>
            {/* {facilities2.map((value: string, index: number) => {
              return <Text key={index}>{value}</Text>;
            })} */}
          </FacilityBox>
        </FacilityPreNextContainer>
      </ContentMain>
    </ContentContainer>
  );
};
const BlackText = styled.Text`
  color: black;
`;
const ContentContainer = styled.View`
  width: 100%;
  height: 78%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ContentHeader = styled.View`
  width: 100%;
`;
const LineNumberListContainer = styled.View`
  height: 40px;
  width: 100%;
`;
const LineNumberListBox = styled.View`
  display: flex;
  flex-direction: row;
`;
const LineNumberListItem = styled.Text`
  width: 40px;
  height: 40px;
  border: 1px solid black;
`;
const LineNumberListBorderBottom = styled.View`
  height: 2px;
  width: 100%;
  background-color: black;
`;
const ContentMain = styled.View`
  width: 90%;
`;
const StationContainer = styled.View`
  width: 100%;
  height: 33px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: 20px;
  background-color: purple;
  border-radius: 20px;
`;
const StationBox = styled.View`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const StationText = styled.Text`
  color: white;
`;
const StationMainBox = styled.View`
  width: 40%;
  height: 45px;
  top: -6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 5px solid purple;
  border-radius: 20px;
  background-color: white;
`;
const FacilityHeader = styled.Text`
  margin-top: 20px;
  width: 100%;
  color: black;
`;
const FacilityContainer = styled.View`
  width: 100%;
  border: 1px solid black;
  border-radius: 15px;
  height: 95px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
`;
const FacilityPreNextContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 35px;
  width: 100%;
`;
const FacilityBox = styled.View`
  width: 47%;
  height: 95px;
  display: flex;
  align-items: center;
  border: 1px solid black;
  border-radius: 15px;
  padding-top: 5px;
`;
export default Content;
