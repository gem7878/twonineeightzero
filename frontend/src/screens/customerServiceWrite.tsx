import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

interface Props {
    guideInformation: any
}

const DisasterGuide: React.FC<Props> = ({guideInformation}) => {
  
  return (
    <>
    {Object.keys(guideInformation[2]).map((key : string) => {
        <Text style={{fontSize: 20}}>{key}</Text>
        {guideInformation[2][key].map((value : string) => {
            return (
                <Text>{value}</Text>
            )
        })}
    })}
    </>
  );
};

export default DisasterGuide;
