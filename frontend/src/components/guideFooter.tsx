import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

interface GuideFooterStyle {
  $isMenu: Boolean;
}

const GuideFooter: React.FC = () => {
  /*const navigationRef = useNavigationContainerRef<any>();*/
  const menuList = [
    ['탈선사고', require('../assets/icons/AwayIcon.png')],
    ['화재사고', require('../assets/icons/FireIcon.png')],
    ['추락사고', require('../assets/icons/FallIcon.png')],
    ['침수사고', require('../assets/icons/FloodIcon.png')],
    ['MENU', ''],
  ];

  return (
    <Footer>
      {/* <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator initialRouteName="Main">
          <RootStack.Screen
            name="Main"
            component={MainScreen}
            options={{headerShown: false}}
          />
        </RootStack.Navigator>
      </NavigationContainer> */}
      {menuList.map((value: any, index: number) => {
        return (
          <FooterBtn $isMenu={value[0] === 'MENU' ? true : false} key={index}>
            <TouchableOpacityBtn $isMenu={value[0] === 'MENU' ? true : false}>
              <Image source={value[1]} />
              <FooterMenuText $isMenu={value[0] === 'MENU' ? true : false}>
                {value[0]}
              </FooterMenuText>
            </TouchableOpacityBtn>
          </FooterBtn>
        );
      })}
    </Footer>
  );
};

const Footer = styled.View`
  background-color: #bebebe;
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const FooterBtn = styled.View<GuideFooterStyle>`
  width: 20%;
  height: 100%;
  background-color: ${props => (props.$isMenu ? '#676767' : 'white')};
  /* border: ${props => (props.$isMenu ? 'none' : '1px solid #fbff00')}; */
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FooterMenuText = styled.Text<GuideFooterStyle>`
  color: ${props => (props.$isMenu ? 'white' : 'black')};
  font-size: 12px;
  text-align: center;
  font-weight: 700;
  margin-top: 3px;
`;
const TouchableOpacityBtn = styled.TouchableOpacity<GuideFooterStyle>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
`;
export default GuideFooter;
