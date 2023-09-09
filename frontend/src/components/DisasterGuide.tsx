import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

interface Props {
    guideInformation: any
}

const DisasterGuide: React.FC<Props> = ({guideInformation}) => {
  
  return (
    <>
    {guideInformation[2].map((value: string, index: number) => {
        if(index === 0) {
            return (
                <Text style={{fontSize: 20}}>{value}</Text>
            )
        } else {
            return (
                <Text>{value}</Text>
            )
        }
    })}
    </>
  );
};

export default DisasterGuide;
