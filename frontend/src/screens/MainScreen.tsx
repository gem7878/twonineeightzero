import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Search, Content, GuideFooter} from '../components/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

interface Props {
  route: any;
  navigation: any;
}

const MainScreen: React.FC<Props> = ({route, navigation}) => {
  const [openMenu, setMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const moveMenuScreen = (menu: string) => {
    navigation.navigate(menu);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('my-token');
    setIsLogin(false);
  }

  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    await AsyncStorage.getItem('my-token')
      .then((value) => {
        if(value != null) {
          setIsLogin(true);
        }
      }).catch((err) => {
        console.log(err);
      })
  }
  
  return (
    <MainContainer>
      <Search
        lat={route.params.lat}
        lon={route.params.lon}
        stationName={route.params.stationName}
        stationNum={route.params.stationNum}
        navigation={navigation}
      />
      <Content
        lat={route.params.lat}
        lon={route.params.lon}
        searchStationName={route.params.stationName}
        searchStationNum={route.params.stationNum}
        navigation={navigation}
      />

      {openMenu && isLogin ? (
        <MenuContainer>
          <MenuBox onPress={() => console.log("고객의 소리")}>
            <MenuText>고객의{'\n'}소리</MenuText>
          </MenuBox>
          <MenuBox onPress={() => logout()}>
            <MenuText>로그아웃</MenuText>
          </MenuBox>
        </MenuContainer>
      ) : ((openMenu && !isLogin) ? (
        <MenuContainer>
          <MenuBox onPress={() => moveMenuScreen('SignIn')}>
            <MenuText>로그인</MenuText>
          </MenuBox>
          <MenuBox onPress={() => moveMenuScreen('SignUp')}>
            <MenuText>회원가입</MenuText>
          </MenuBox>
        </MenuContainer>
      ) : (
        <></>
      ))}

      <GuideFooter navigation = {navigation} openMenu={openMenu} setMenuOpen={setMenuOpen} />
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

const MenuContainer = styled.View`
  width: 20%;
  /* height: 5%; */
  position: absolute;
  right: 0;
  bottom: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const MenuBox = styled.TouchableOpacity`
  background-color: #00ffd1;
  text-align: center;
  margin-bottom: 20px;
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MenuText = styled.Text`
  text-align: center;
  font-size: 12.5px;
  font-weight: 900;
`;
export default MainScreen;
