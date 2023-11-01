import React from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import {BackHeader} from '../components/index';

interface Props {
  route: any;
}

const DisasterGuide: React.FC<Props> = ({route}) => {
  const [document, icon, guideInformation] = route.params.guideInformation;

  return (
    <>
    <BackHeader />
    <GuideContainer>
      <DocumentText>{document}</DocumentText>
      {guideInformation.map((value: string, index: number) => {
        if (index % 2 === 0) {
          return <TitleText>{value}</TitleText>;
        } else {
          if (value.length !== 0) {
            return (
              <FlatList
                data={value.split('-')}
                renderItem={({item, index}) => (
                  <ListText>
                    {index + 1}. {item}
                  </ListText>
                )}
              />
            );
          }
        }
      })}
    </GuideContainer>
  </>
  );
};

const GuideContainer = styled.View`
  margin: 5px 10px 10px 10px;
  padding: 10px;
`
const DocumentText = styled.Text`
  font-size: 20px;
  color: black;
  margin-bottom: 15px;
  margin-top: -30px;
`
const TitleText = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
  padding: 5px;
  color: black;
  background-color: lightgrey;
  border-radius: 5px;
`
const ListText = styled.Text`
  margin: 0px 5px 10px 5px;
  color: black;
`
export default DisasterGuide;
