import axios from 'axios';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';

interface CongestionProps {
  stationName: string;
  WhiteText: any;
  BlackText: any;
}

const Congestion: React.FC<CongestionProps> = ({
  stationName,
  WhiteText,
  BlackText,
}) => {
  const [data, setData] = useState([]);
  const [congestion, setCongestion] = useState<number>(0);
  // selected
  const [stationNum, setStationNum] = useState<string>('5');
  const [clock, setClock] = useState<string>('5시30분');
  const [week, setWeek] = useState<string>('평일');
  const [upPoint, setUpPoint] = useState<string>('상선');
  // list
  let stationNumList: string[] = [];
  // const [upPointList, setUpPointList] = useState<string>('상선');

  useEffect(() => {
    getData(stationName);
  }, []);

  const getData = (station: string | undefined) => {
    axios
      .get(`http://10.0.2.2:3000/cong/congestion/${station}`)
      .then(function (res: any) {
        setData(res.data[0]['혼잡도']);
        setCongestion(res.data[0]['혼잡도'][2][1]);
      });
  };
  return (
    <CongestionContainer>
      <WhiteText>역 내 혼잡도</WhiteText>
      <CongestionBoxBorder>
        <CongestionBox>
          <BlackText>
            {stationNumList}
            {stationName}역의 평균적인 혼잡도는 {congestion}%입니다.
          </BlackText>
          <CongestionListContianer>
            {data.map((value: string[], index: number) => {
              if (value[0] === '') {
                return <BlankCongestionBox />;
              } else {
                if (index === 2) {
                  return (
                    <CongestionListBoxCenter key={index}>
                      <CongestionValueCenter>{value[1]}</CongestionValueCenter>
                      <StationTimeTextCenter>{value[0]}</StationTimeTextCenter>
                    </CongestionListBoxCenter>
                  );
                } else {
                  return (
                    <CongestionListBox key={index}>
                      <CongestionValue>{value[1]}</CongestionValue>
                      <StationTimeText>{value[0]}</StationTimeText>
                    </CongestionListBox>
                  );
                }
              }
            })}
          </CongestionListContianer>
        </CongestionBox>
      </CongestionBoxBorder>
    </CongestionContainer>
  );
};
const CongestionContainer = styled.View`
  padding-top: 25px;
`;
const CongestionBoxBorder = styled.View`
  border: 1px solid white;
  border-radius: 20px;
  width: 100%;
  height: 114px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
`;
const CongestionBox = styled.View`
  width: 97%;
  height: 100px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  padding-top: 7px;
  background-color: white;
`;
const CongestionListContianer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;
const CongestionListBox = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  width: 55px;
  height: 55px;
  background-color: black;
  border-radius: 30px;
`;
const StationTimeText = styled.Text`
  color: white;
  font-size: 11px;
  line-height: 13px;
`;
const CongestionValue = styled.Text`
  font-size: 18px;
  color: #00ffd1;
  line-height: 19px;
`;
const CongestionListBoxCenter = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  width: 63px;
  height: 65px;
  background-color: black;
  border-radius: 33px;
`;
const StationTimeTextCenter = styled.Text`
  color: white;
  font-size: 11px;
  font-weight: 900;
  line-height: 13px;
`;
const CongestionValueCenter = styled.Text`
  font-size: 20px;
  color: #00ffd1;
  font-weight: 900;
  line-height: 21px;
`;
const BlankCongestionBox = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  width: 55px;
  height: 55px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 30px;
`;

export default Congestion;
