import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Search, Content, GuideFooter} from '../components/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

interface Props {
  route: any;
  navigation: any;
}

const MainScreen: React.FC<Props> = ({route, navigation}) => {
  const [openMenu, setMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const moveMenuScreen = (menu: string) => {
    setMenuOpen(false);
    navigation.navigate(menu);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('my-token');
    await AsyncStorage.removeItem('my-expiration');
    setIsLogin(false);
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused) {
      loadUserData();
    }
  }, [isFocused]);

  const loadUserData = async () => {
    console.log("loaduserdata");
    const myToken : any = await AsyncStorage.getItem('my-token');
    const expirationTime : any = await AsyncStorage.getItem('my-expiration');
    if (myToken !== null && expirationTime !== null) {
      console.log(new Date());
      console.log(new Date(expirationTime));
      if(new Date() > new Date(expirationTime)) {
        await AsyncStorage.removeItem('my-token');
        await AsyncStorage.removeItem('my-expiration');
        setIsLogin(false);
      } else {
        setIsLogin(true);
      }
    } else {
      setIsLogin(false);
    }
  };

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
        reLocation={route.params.reLocation}
      />

      {openMenu && isLogin ? (
        <MenuContainer>
          <MenuBox onPress={() => moveMenuScreen('CustomerService')}>
            <MenuText>고객의{'\n'}소리</MenuText>
          </MenuBox>
          <MenuBox onPress={() => logout()}>
            <MenuText>로그아웃</MenuText>
          </MenuBox>
        </MenuContainer>
      ) : openMenu && !isLogin ? (
        <MenuContainer>
          <MenuBox onPress={() => moveMenuScreen('CustomerService')}>
            <MenuText>고객의{'\n'}소리</MenuText>
          </MenuBox>
          <MenuBox onPress={() => moveMenuScreen('SignIn')}>
            <MenuText>로그인</MenuText>
          </MenuBox>
          <MenuBox onPress={() => moveMenuScreen('SignUp')}>
            <MenuText>회원가입</MenuText>
          </MenuBox>
        </MenuContainer>
      ) : (
        <></>
      )}

      <GuideFooter
        navigation={navigation}
        openMenu={openMenu}
        setMenuOpen={setMenuOpen}
      />
    </MainContainer>
  );
};

const MainContainer = styled.View`
  background-color: black;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  align-items: center;
`;

const MenuContainer = styled.View`
  width: 20%;
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
