import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';

const Congestion: React.FC = () => {
  const [file, setFile] = useState<any>();
  const [array, setArray] = useState<any>([]);
  const [stationName, setStationName] = useState<string>('동대문');
  const [stationNum, setStationNum] = useState<string>('4');
  const [congestion, setCongestion] = useState<number>(0);
  const [clock, setClock] = useState<string>('5시30분');
  const [week, setWeek] = useState<string>('평일');
  const [upPoint, setUpPoint] = useState<string>('상선');

  useEffect(() => {
    getData(stationName);
  }, []);

  const getData = async (station: string | undefined) => {
    axios
      .get(`http://10.0.2.2:3000/cong/congestion/${station}`)
      .then(function (res: any) {
        csvFileToArray(res.data);
      });
  };
  const csvFileToArray = (result: any) => {
    const csvRows = result.map((arr: any) => {
      return Object.values(arr);
    });
    const csvHeader = csvRows[0];
    csvRows.shift();

    const csvArray = csvRows.map((value: any, i: number) => {
      const obj = csvHeader.reduce(
        (object: any, header: any, index: number) => {
          if (i === 1) {
          }
          object[header] = value[index];
          return object;
        },
        {},
      );
      return obj;
    });

    setArray(csvArray);
    return extractCongestion();
  };
  const extractCongestion = () => {
    let tmp: number = 0;
    for (let i = 0; i < array.length; i++) {
      if (
        array[i].출발역 === stationName &&
        array[i].요일구분 === week &&
        array[i].상하구분 === upPoint &&
        array[i].호선 === stationNum
      ) {
        tmp = i;
        break;
      }
    }
    for (let key in array[tmp]) {
      if (key.toString() === clock) {
        setCongestion(array[tmp][key]);
      }
    }
  };
  return (
    <View>
      <CongestionBox>
        <Text>
          {stationName}역의 평균적인 혼잡도는 {congestion}%입니다.
        </Text>
      </CongestionBox>
    </View>
  );
};

const CongestionBox = styled.View`
  width: 284px;
  height: 100px;
  border: 1px solid black;
`;

export default Congestion;
