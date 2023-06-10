import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

interface GuideFooterProps {
  $isMenu: Boolean;
}

const GuideFooter: React.FC<GuideFooterProps> = props => {
  /*const navigationRef = useNavigationContainerRef<any>();*/
  const menuList = ['가이드1', '가이드2', '가이드3', '가이드4', 'MENU'];

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
  );
};

const Footer = styled.View`
  background-color: #d9d9d9;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 18;
`;
const FooterBtn = styled.View<GuideFooterProps>`
  width: 48;
  height: 48;
  background-color: ${props => (props.$isMenu ? '#676767' : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FooterMenuText = styled.Text<GuideFooterProps>`
  color: ${props => (props.$isMenu ? 'white' : 'black')};
  font-size: 12px;
`;
export default GuideFooter;