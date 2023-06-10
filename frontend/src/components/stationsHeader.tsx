import React from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import styled from 'styled-components/native';

interface StationsHeaderProps {
}

const StationsHeader: React.FC<StationsHeaderProps> = props => {

  return (
    <HeaderContainer>
        <HeaderSearch>
            <SearchInput placeholder="‘화장실’의 위치를 알고 싶은가요?" />
            <Image
                source={require('../assets/icons/Search.png')}
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
  );
};

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
export default StationsHeader;