import axios from 'axios';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';

interface CongestionProps {
  stationName: string;
  BlackText: any;
}

const Congestion: React.FC<CongestionProps> = ({stationName, BlackText}) => {
  const [file, setFile] = useState<any>();
  const [array, setArray] = useState<any>([]);
  const [congestion, setCongestion] = useState<number>(0);
  // selected
  const [stationNum, setStationNum] = useState<string>('5');
  const [clock, setClock] = useState<string>('5시30분');
  const [week, setWeek] = useState<string>('평일');
  const [upPoint, setUpPoint] = useState<string>('상선');
  // list
  let stationNumList: string[] = [];
  const [clockList, setClockList] = useState<string[]>(['5시30분']);
  // const [upPointList, setUpPointList] = useState<string>('상선');

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
  const csvFileToArray = async (result: any) => {
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
    await extractCongestion();
  };
  const extractStationNumList = async () => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].출발역 === stationName) {
        stationNumList.includes(array[i].호선) ||
          stationNumList.push(array[i].호선);
      }
    }
    stationNumList.sort();
  };
  const extractCongestion = async () => {
    let tmp: number = 0;
    console.log(stationNumList);

    for (let i = 0; i < array.length; i++) {
      if (
        array[i].출발역 === stationName &&
        array[i].요일구분 === week &&
        array[i].상하구분 === upPoint &&
        array[i].호선 === stationNum
      ) {
        console.log(array[i]);

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
    <CongestionContainer>
      <BlackText>역 내 혼잡도</BlackText>
      <CongestionBox>
        <BlackText>
          {stationNumList}
          {stationName}역의 평균적인 혼잡도는 {congestion}%입니다.
        </BlackText>
      </CongestionBox>
    </CongestionContainer>
  );
};
const CongestionContainer = styled.View`
  padding-top: 25px;
`;
const CongestionBox = styled.View`
  width: 100%;
  height: 100px;
  border: 1px solid black;
  border-radius: 15px;
  display: flex;
  align-items: center;
  margin-top: 5px;
  padding-top: 7px;
`;

export default Congestion;
