import axiosInstance from '../apis/service/client';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Congestion, GuideFooter, Refresh} from './index';

interface ContentProps {
  lat: Number;
  lon: Number;
  searchStationName: any;
  searchStationNum: any;
}

interface IFDetail {
  구분: number;
  상세위치: string;
}
interface IFlocation {
  지상1층: IFDetail | null;
  지하1층: IFDetail | null;
  지하2층: IFDetail | null;
  지하3층: IFDetail | null;
  지하4층: IFDetail | null;
}
export interface IFacility {
  호선: string | null;
  전철역명: string | null;
  화장실: IFlocation | null;
  장애인화장실: IFlocation | null;
  에스컬레이터: IFlocation | null;
  엘레베이터: IFlocation | null;
}
const Content: React.FC<ContentProps> = ({
  lat,
  lon,
  searchStationName,
  searchStationNum,
}) => {
  const [currentFacilitiesList, setCurrentFacilitiesList] = useState<any>([]);
  const [preFacilitiesList, setPreFacilitiesList] = useState<any>([]);
  const [nextFacilitiesList, setNextFacilitiesList] = useState<any>([]);

  const [stationName, setStationName] = useState<string>('');
  const [preStation, setPreStation] = useState<string>('');
  const [nextStation, setNextStation] = useState<string>('');
  // const [lineNumList, setLineNumList] = useState<number[]>([1, 2, 5]);
  const [current, setCurrent] = useState({호선: '', 역명: ''});

  useEffect(() => {
    let currentStation = searchStationName;
    let currentStationNum = searchStationNum;
    const splitStation = searchStationName.split('');
    if (splitStation[splitStation.length - 1] === '역') {
      currentStation = currentStation.slice(0, -1);
      currentStationNum = currentStationNum.slice(0, -2);
      setStationName(currentStation);
      setCurrent({호선: currentStationNum, 역명: currentStation});
    } else {
      setStationName(currentStation);
    }
    getPreNextFacilityData(currentStationNum, currentStation);
    getCurrentFacilityData(currentStationNum, currentStation);
  }, [searchStationName, searchStationNum]);

  /** 오브젝트 비었는지 확인 */
  const isEmptyObj = (obj: object) => {
    if (obj.constructor === Object && Object.keys(obj).length === 0) {
      return true;
    }

    return false;
  };
  const PreNextFacilityBox = (preFacility: any, nextFacility: any) => {
    let preFacilityList = [];
    let nextFacilityList = [];

    setPreStation(preFacility['전철역명']);
    setNextStation(nextFacility['전철역명']);

    if (preFacility !== null) {
      for (let key in preFacility) {
        const value = preFacility[key];
        if (key === '엘레베이터' && !isEmptyObj(preFacility?.엘레베이터)) {
          preFacilityList.push([key, value]);
        } else if (
          key === '에스컬레이터' &&
          !isEmptyObj(preFacility?.에스컬레이터)
        ) {
          preFacilityList.push([key, value]);
        } else if (key === '화장실' && !isEmptyObj(preFacility?.화장실)) {
          preFacilityList.push([key, value]);
        } else if (
          key === '장애인화장실' &&
          !isEmptyObj(preFacility?.장애인화장실)
        ) {
          preFacilityList.push([key, value]);
        }
      }
      setPreFacilitiesList(preFacilityList);
    }
    if (nextFacility !== null) {
      for (let key in nextFacility) {
        const value = nextFacility[key];
        if (key === '엘레베이터' && !isEmptyObj(nextFacility?.엘레베이터)) {
          nextFacilityList.push([key, value]);
        } else if (
          key === '에스컬레이터' &&
          !isEmptyObj(nextFacility?.에스컬레이터)
        ) {
          nextFacilityList.push([key, value]);
        } else if (key === '화장실' && !isEmptyObj(nextFacility?.화장실)) {
          nextFacilityList.push([key, value]);
        } else if (
          key === '장애인화장실' &&
          !isEmptyObj(nextFacility?.장애인화장실)
        ) {
          nextFacilityList.push([key, value]);
        }
      }
      setNextFacilitiesList(nextFacilityList);
    }
  };

  const getCurrentFacilityData = async (currentStationNum: string, currentStation: string) => { // 호선도 매개변수로 넘어가게함
    /** (예시) selectedLine으로 호선 버튼 선택되게 하면 되고 , data는 층별로 더 자세하게 수정함.
     * {"lines":["5","6","경의선","공항철도"],
     * "selectedLine":"5",
     * "data":{
     * "에스컬레이터":{"지하1층":[{"상하행구분":"상행","상세위치":"(B1)B1대합실"},{"상하행구분":"상행","상세위치":"(B1)B1대합실"},{"상하행구분":"하행","상세위치":"(B1)"},{"상하행구분":"하행","상세위치":"(B1)"}],"지하3층":[{"상하행구분":"상행","상세위치":"(B3)"},{"상하행구분":"상행","상세위치":"(B3)"}],"지하2층":[{"상하행구분":"하행","상세위치":"(B2)"},{"상하행구분":"하행","상세위치":"(B2)"},{"상하행구분":"상행","상세위치":"(B2)"},{"상하행구분":"상행","상세위치":"(B2)"}],"지상1층":[{"상하행구분":"하행","상세위치":"(F1)4번출입구"}]},
     * "엘레베이터":{"지하1층":[{"구분":1,"상세위치":"(B1-B3)승강장"},{"구분":2,"상세위치":"(F1-B1)2번 출입구"}],"지하2층":[{"구분":1,"상세위치":"(B1-B3)승강장"}],"지하3층":[{"구분":1,"상세위치":"(B1-B3)승강장"}],"지상1층":[{"구분":2,"상세위치":"(F1-B1)2번 출입구"}]},
     * "장애인화장실":{"지하1층":[{"게이트내외":"외","상세위치":" 대합실 1층 3번출구 앞"}]},
     * "화장실":{"지하1층":[{"게이트내외":"외","상세위치":" 대합실 1층 3번출구 앞"}]}
     * }}
     */
    await axiosInstance
      .get(
        `/api/facility/${currentStationNum}/${currentStation}`,
      )
      .then(function (res: any) {
        setCurrentFacilitiesList(res.data.data);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };
  const getPreNextFacilityData = async (
    currentLine: string | undefined,
    currentStation: string | undefined,
  ) => {
    axiosInstance
      .get(
        `/api/maps/${currentLine}/${currentStation}`, // currentLine을 넘겨서 같은 호선만 검색됨
      )
      .then(function (res: any) {
        PreNextFacilityBox(res.data.전역, res.data.후역);
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
          {/* <LineNumberListBox>
            {lineNumList.map((value: number, index: number) => {
              return (
                <LineNumberListItem key={index}>{value}</LineNumberListItem>
              );
            })}
          </LineNumberListBox>
          <LineNumberListBorderBottom /> */}
        </LineNumberListContainer>
      </ContentHeader>
      <ContentMain>
        <StationContainer>
          <StationBox>
            <StationText>&lt;&nbsp;&nbsp;</StationText>
            <StationText>{preStation}</StationText>
          </StationBox>
          <StationMainBox>
            <BlackText>
              {current.호선} {stationName}
            </BlackText>
          </StationMainBox>
          <StationBox>
            <StationText>{nextStation}</StationText>
            <StationText>&nbsp;&nbsp;&gt;</StationText>
          </StationBox>
        </StationContainer>
        <FacilityHeader>역 내 주요 시설</FacilityHeader>
        <FacilityContainer>
          <WhiteText>
            <PointText>{stationName}역</PointText> 의 주요 시설물
          </WhiteText>
          <FacilityView>
            {currentFacilitiesList.map((value: string, index: number) => {
              if (value === '엘레베이터') {
                return (
                  <FacilityPointIcon
                    key={index}
                    source={require('../assets/icons/facility/ElevatorPoint.png')}
                    alt=""
                  />
                );
              } else if (value === '에스컬레이터') {
                return (
                  <FacilityPointIcon
                    key={index}
                    source={require('../assets/icons/facility/EscalatorPoint.png')}
                    alt=""
                  />
                );
              } else if (value === '화장실') {
                return (
                  <FacilityPointIcon
                    key={index}
                    source={require('../assets/icons/facility/RestroomPoint.png')}
                    alt=""
                  />
                );
              } else if (value === '장애인화장실') {
                return (
                  <FacilityPointIcon
                    key={index}
                    source={require('../assets/icons/facility/DisabledPoint.png')}
                    alt=""
                  />
                );
              }
            })}
          </FacilityView>
        </FacilityContainer>

        <Congestion
          stationName={stationName}
          WhiteText={WhiteText}
          BlackText={BlackText}
        />
        <FacilityPreNextContainer>
          <FacilityBox>
            <WhiteText>
              <PointText>{preStation}역</PointText> 의 시설물
            </WhiteText>
            <FacilityList>
              {preFacilitiesList.map((list: any, index: number) => {
                if (list[0] === '엘레베이터') {
                  return (
                    <FacilityIcon
                      key={index}
                      source={require('../assets/icons/facility/ElevatorWhite.png')}
                      alt=""
                    />
                  );
                } else if (list[0] === '에스컬레이터') {
                  return (
                    <FacilityIcon
                      key={index}
                      source={require('../assets/icons/facility/EscalatorWhite.png')}
                      alt=""
                    />
                  );
                } else if (list[0] === '화장실') {
                  return (
                    <FacilityIcon
                      key={index}
                      source={require('../assets/icons/facility/RestroomWhite.png')}
                      alt=""
                    />
                  );
                } else if (list[0] === '장애인화장실') {
                  return (
                    <FacilityIcon
                      key={index}
                      source={require('../assets/icons/facility/DisabledWhite.png')}
                      alt=""
                    />
                  );
                }
              })}
            </FacilityList>
          </FacilityBox>
          <FacilityBox>
            <WhiteText>
              <PointText>{nextStation}역</PointText> 의 시설물
            </WhiteText>
            <FacilityList>
              {nextFacilitiesList.map((list: any, index: number) => {
                if (list[0] === '엘레베이터') {
                  return (
                    <FacilityIcon
                      key={index}
                      source={require('../assets/icons/facility/ElevatorWhite.png')}
                      alt=""
                    />
                  );
                } else if (list[0] === '에스컬레이터') {
                  return (
                    <FacilityIcon
                      key={index}
                      source={require('../assets/icons/facility/EscalatorWhite.png')}
                      alt=""
                    />
                  );
                } else if (list[0] === '화장실') {
                  return (
                    <FacilityIcon
                      key={index}
                      source={require('../assets/icons/facility/RestroomWhite.png')}
                      alt=""
                    />
                  );
                } else if (list[0] === '장애인화장실') {
                  return (
                    <FacilityIcon
                      key={index}
                      source={require('../assets/icons/facility/DisabledWhite.png')}
                      alt=""
                    />
                  );
                }
              })}
            </FacilityList>
          </FacilityBox>
        </FacilityPreNextContainer>
      </ContentMain>
      <GuideFooter />
    </ContentContainer>
  );
};
const WhiteText = styled.Text`
  color: white;
`;
const BlackText = styled.Text`
  color: black;
`;
const PointText = styled.Text`
  color: #00ffd1;
`;
const ContentContainer = styled.View`
  width: 100%;
  height: 89%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const ContentHeader = styled.View`
  width: 100%;
`;
const LineNumberListContainer = styled.View`
  height: 20px;
  width: 100%;
`;
const LineNumberListBox = styled.View`
  display: flex;
  flex-direction: row;
  margin-left: 15px;
`;
const LineNumberListItem = styled.Text`
  width: 35px;
  height: 35px;
  border: 1px solid white;
  margin: 2px;
  color: white;
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
  background-color: #00ffd1;
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
  color: black;
`;
const StationMainBox = styled.View`
  width: 40%;
  height: 45px;
  top: -6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 5px solid #00ffd1;
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
  border: 1px solid white;
  border-radius: 15px;
  height: 95px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
`;
const FacilityView = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
  height: 63%;
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
  border: 1px solid white;
  border-radius: 15px;
  padding-top: 5px;
`;
const FacilityList = styled.View`
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
`;
const FacilityIcon = styled.Image`
  width: 23px;
  height: 23px;
`;
const FacilityPointIcon = styled.Image`
  width: 32px;
  height: 32px;
`;
export default Content;
