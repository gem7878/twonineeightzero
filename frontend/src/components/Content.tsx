import axiosInstance from '../apis/service/client';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Congestion, Refresh} from './index';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Alert, ScrollView, Text} from 'react-native';

interface StationContainerStyle {
  $number: string;
}

interface ContentProps {
  lat: Number;
  lon: Number;
  searchStationName: any;
  searchStationNum: any;
  navigation: any;
  reLocation: Function;
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
  navigation,
  reLocation,
}) => {
  const [currentFacilitiesList, setCurrentFacilitiesList] = useState<any>({});
  const [preFacilitiesList, setPreFacilitiesList] = useState<any>([]);
  const [nextFacilitiesList, setNextFacilitiesList] = useState<any>([]);

  const [stationName, setStationName] = useState<string>('');
  const [preStation, setPreStation] = useState<string>('');
  const [nextStation, setNextStation] = useState<string>('');
  // const [lineNumList, setLineNumList] = useState<number[]>([1, 2, 5]);
  const [current, setCurrent] = useState({호선: '', 역명: ''});
  const [currentLines, setCurrentLine] = useState<any>([]);
  const [isOpenPos, setIsOpenPos] = useState('');

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

    setPreStation(preFacility['전철역명'] || ''); // "전철역명" 데이터 없을때는 빈문자열로 저장
    setNextStation(nextFacility['전철역명'] || '');

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

  const getCurrentFacilityData = async (
    currentStationNum: string,
    currentStation: string,
  ) => {
    await axiosInstance
      .get(`/api/facility/${currentStationNum}/${currentStation}`)
      .then(function (res: any) {
        setCurrentFacilitiesList(res.data.data);
        setCurrentLine(res.data.lines);
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

  // 역 이동
  const moveStationName = (name: string) => {
    if (name === '') return;
    navigation.navigate('Main', {
      lat: lat,
      lon: lon,
      stationName: name,
      stationNum: current.호선,
    });
    setCurrent({호선: current.호선, 역명: name});
  };
  // 호선 이동
  const moveStationNum = (value: string) => {
    if (value === '5' || value === '6' || value === '7' || value === '8') {
      navigation.navigate('Main', {
        lat: lat,
        lon: lon,
        stationName: stationName,
        stationNum: value,
      });
      setCurrent({호선: value, 역명: stationName});
    } else {
      Alert.alert('아직 5호선~8호선만 지원합니다.');
    }
  };

  return (
    <ContentContainer>
      <ContentHeader>
        <Refresh lat={lat} lon={lon} reLocation={reLocation} />
        <LineNumberListContainer>
          <LineNumberListBox>
            {currentLines.map((value: string, index: number) => {
              if (['5', '6', '7', '8'].includes(value)) {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => moveStationNum(value)}>
                    <LineNumberListItem $number={value}>
                      {value}
                    </LineNumberListItem>
                  </TouchableOpacity>
                );
              }
            })}
          </LineNumberListBox>
          <LineNumberListBorderBottom />
        </LineNumberListContainer>
      </ContentHeader>
      <ContentMain>
        <StationContainer $number={current.호선}>
          <StationBox onPress={() => moveStationName(preStation)}>
            <StationText textLength={5}>&lt;&nbsp;&nbsp;</StationText>
            <StationText textLength={preStation.length}>
              {preStation}
            </StationText>
          </StationBox>
          <StationMainBox $number={current.호선}>
            <BlackText textLength={stationName.length}>
              {current.호선} {stationName}
            </BlackText>
          </StationMainBox>
          <StationBox onPress={() => moveStationName(nextStation)}>
            <StationText textLength={nextStation.length}>
              {nextStation}
            </StationText>
            <StationText textLength={5}>&nbsp;&nbsp;&gt;</StationText>
          </StationBox>
        </StationContainer>
        <FacilityHeader>역 내 주요 시설</FacilityHeader>
        <FacilityContainer onPress={() => isOpenPos && setIsOpenPos('')}>
          <WhiteText>
            {isOpenPos ? (
              <>
                <PointText textLength={5}>{stationName}역</PointText>{' '}
                {isOpenPos}의 위치
              </>
            ) : (
              <>
                <PointText textLength={5}>{stationName}역</PointText> 의 주요
                시설물
              </>
            )}
          </WhiteText>
          {isOpenPos ? (
            <FacilityView>
              {Object.keys(currentFacilitiesList).includes(isOpenPos) ? (
                Object.keys(currentFacilitiesList[isOpenPos]).map(pos => {
                  return currentFacilitiesList[isOpenPos][pos].map(
                    (detailValue: object, index: number) => {
                      return (
                        <FacilityViewDetail key={index}>
                          {pos}[ {detailValue['상세위치']} ],
                        </FacilityViewDetail>
                      );
                    },
                  );
                })
              ) : (
                <></>
              )}
            </FacilityView>
          ) : (
            <FacilityView>
              {Object.keys(currentFacilitiesList).includes('에스컬레이터') ? (
                Object.keys(currentFacilitiesList['에스컬레이터'])?.length >
                  0 && (
                  <TouchableOpacity
                    onPress={() => setIsOpenPos('에스컬레이터')}>
                    <FacilityPointIcon
                      source={require('../assets/icons/facility/EscalatorPoint.png')}
                      alt=""
                    />
                  </TouchableOpacity>
                )
              ) : (
                <></>
              )}
              {Object.keys(currentFacilitiesList).includes('엘레베이터') ? (
                Object.keys(currentFacilitiesList['엘레베이터'])?.length >
                  0 && (
                  <TouchableOpacity onPress={() => setIsOpenPos('엘레베이터')}>
                    <FacilityPointIcon
                      source={require('../assets/icons/facility/ElevatorPoint.png')}
                      alt=""
                    />
                  </TouchableOpacity>
                )
              ) : (
                <></>
              )}
              {Object.keys(currentFacilitiesList).includes('화장실') ? (
                Object.keys(currentFacilitiesList['화장실'])?.length > 0 && (
                  <TouchableOpacity onPress={() => setIsOpenPos('화장실')}>
                    <FacilityPointIcon
                      source={require('../assets/icons/facility/RestroomPoint.png')}
                      alt=""
                    />
                  </TouchableOpacity>
                )
              ) : (
                <></>
              )}
              {Object.keys(currentFacilitiesList).includes('장애인화장실') ? (
                Object.keys(currentFacilitiesList['장애인화장실'])?.length >
                  0 && (
                  <TouchableOpacity
                    onPress={() => setIsOpenPos('장애인화장실')}>
                    <FacilityPointIcon
                      source={require('../assets/icons/facility/DisabledPoint.png')}
                      alt=""
                    />
                  </TouchableOpacity>
                )
              ) : (
                <></>
              )}
            </FacilityView>
          )}
        </FacilityContainer>
        <Congestion
          stationName={stationName}
          WhiteText={WhiteText}
          BlackText={BlackText}
        />
        <FacilityPreNextContainer>
          <FacilityBox>
            <WhiteText>
              <PointText textLength={preStation.length}>
                {preStation}역
              </PointText>{' '}
              의 시설물
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
              <PointText textLength={nextStation.length}>
                {nextStation}역
              </PointText>{' '}
              의 시설물
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
    </ContentContainer>
  );
};
const WhiteText = styled.Text`
  color: white;
`;
const BlackText = styled.Text<{textLength: number}>`
  color: black;
  font-size: ${props => (props.textLength >= 7 ? '10px' : '14px')};
`;
const PointText = styled.Text<{textLength: number}>`
  color: #00ffd1;
  font-size: ${props => (props.textLength >= 6 ? '11px' : '14px')};
`;
const ContentContainer = styled.View`
  width: 100%;
  height: 79%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  align-items: center;
`;
const ContentHeader = styled.View`
  width: 100%;
`;
const LineNumberListContainer = styled.View`
  height: 35px;
  width: 100%;
`;
const LineNumberListBox = styled.View`
  display: flex;
  height: 100%;
  flex-direction: row;
  margin-left: 15px;
`;
const LineNumberListItem = styled.Text<StationContainerStyle>`
  width: 35px;
  height: 100%;
  border: ${props =>
    props.$number === '5'
      ? '4px solid #996CAC'
      : props.$number === '6'
      ? '4px solid #CD7C2F'
      : props.$number === '7'
      ? '4px solid #747F00'
      : props.$number === '8'
      ? '4px solid #E6186C'
      : '4px solid #00ffd1'};
  background-color: white;
  color: black;
  font-size: 11px;
  line-height: 35px;
  text-align: center;
`;
const LineNumberListBorderBottom = styled.View`
  height: 2px;
  width: 100%;
  background-color: black;
`;
const ContentMain = styled.View`
  width: 90%;
  /* position: relative; */
`;
const StationContainer = styled.View<StationContainerStyle>`
  width: 100%;
  height: 33px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: 15px;
  background-color: ${props =>
    props.$number === '5'
      ? '#996CAC'
      : props.$number === '6'
      ? '#CD7C2F'
      : props.$number === '7'
      ? '#747F00'
      : props.$number === '8'
      ? '#E6186C'
      : '#00ffd1'};
  border-radius: 20px;
`;
const StationBox = styled.TouchableOpacity`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const StationText = styled.Text<{textLength: number}>`
  color: black;
  font-size: ${props => (props.textLength >= 6 ? '10px' : '14px')};
`;
const StationMainBox = styled.View<StationContainerStyle>`
  width: 40%;
  height: 45px;
  top: -6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: ${props =>
    props.$number === '5'
      ? '5px solid #996CAC'
      : props.$number === '6'
      ? '5px solid #CD7C2F'
      : props.$number === '7'
      ? '5px solid #747F00'
      : props.$number === '8'
      ? '5px solid #E6186C'
      : '5px solid #00ffd1'};
  border-radius: 20px;
  background-color: white;
`;
const FacilityHeader = styled.Text`
  margin-top: 20px;
  width: 100%;
  color: white;
`;
const FacilityContainer = styled.TouchableOpacity`
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
  row-gap: 6px;
  column-gap: 12px;
  height: 63%;
  flex-wrap: wrap;
  margin-top: 10px;
  padding: 0 5px;
`;
const FacilityViewDetail = styled.Text`
  font-size: 11px;
  color: white;
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
