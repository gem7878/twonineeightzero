import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

const BackHeader = () => {
  const {goBack} = useNavigation();

  const moveMenuScreen = () => {
    goBack();
  };
  return (
    <LogInHeaderContainer>
      <TouchableOpacity onPress={() => moveMenuScreen()}>
        <BackBox>
          <BackIcon source={require('../assets/icons/BackIcon.png')} />
        </BackBox>
      </TouchableOpacity>
    </LogInHeaderContainer>
  );
};

const LogInHeaderContainer = styled.View`
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
  padding-left: 20px;
`;
const BackBox = styled.View`
  width: 40px;
  height: 40px;
`;
const BackIcon = styled.Image`
  width: 100%;
  height: 100%;
  /* width: 35px;
  height: 35px; */
`;
export default BackHeader;
