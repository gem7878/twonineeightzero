import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {MainScreen} from './screens/index.js';
import styled from 'styled-components/native';
import {TextInput} from 'react-native';

interface AppStyle {
  $isMenu: boolean;
}

const RootStack = createStackNavigator();

function App(): JSX.Element {
  const navigationRef = useNavigationContainerRef<any>();

  const menuList = ['가이드1', '가이드2', '가이드3', '가이드4', 'MENU'];
  return (
    <View>
      {/* <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator initialRouteName="Main">
          <RootStack.Screen
            name="Main"
            component={MainScreen}
            options={{headerShown: false}}
          />
        </RootStack.Navigator>
      </NavigationContainer> */}
      <MainContainer>
        <HeaderContainer>
          <HeaderSearch>
            <SearchInput placeholder="‘화장실’의 위치를 알고 싶은가요?" />
            <Image
              source={require('./assets/icons/Search.png')}
              resizeMode="contain"
            />
          </HeaderSearch>
          <HeaderContent>
            <Text>여기는 O호선의 OO역 입니다.</Text>
            <ContentContainer>
              <ContentBox>
                <Text>(전)역</Text>
              </ContentBox>
              <ContentBox>
                <Text>(다음)역</Text>
              </ContentBox>
            </ContentContainer>
          </HeaderContent>

          <HeaderToggleBtn>
            <TouchableOpacity></TouchableOpacity>
          </HeaderToggleBtn>
        </HeaderContainer>
        <StationMapImg source={require('./assets/images/StationMap.png')} />
        <View>
          <CongestionBox>
            <Text>__역의 퍙군적인 혼잡도는 __%입니다.</Text>
          </CongestionBox>
        </View>
      </MainContainer>
      <Footer>
        {menuList.map((value: string) => {
          return (
            <FooterBtn $isMenu={value === 'MENU' ? true : false}>
              <TouchableOpacity>
                <FooterMenuText $isMenu={value === 'MENU' ? true : false}>
                  {value}
                </FooterMenuText>
              </TouchableOpacity>
            </FooterBtn>
          );
        })}
      </Footer>
    </View>
  );
}
const MainContainer = styled.View`
  background-color: #ffffff;
  height: 90%;
  display: flex;
  align-items: center;
`;
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
const StationMapImg = styled.Image`
  width: 100%;
  margin-top: 10;
`;
const CongestionBox = styled.View`
  width: 284;
  height: 100;
  border: 1px solid black;
`;
const Footer = styled.View`
  background-color: #d9d9d9;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 18;
`;
const FooterBtn = styled.View<AppStyle>`
  width: 48;
  height: 48;
  background-color: ${props => (props.$isMenu ? '#676767' : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FooterMenuText = styled.Text<AppStyle>`
  color: ${props => (props.$isMenu ? 'white' : 'black')};
  font-size: 12;
`;

export default App;
