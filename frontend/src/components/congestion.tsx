import React from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';

interface CongestionProps {
}

const Congestion: React.FC<CongestionProps> = props => {

  return (
    <View>
        <CongestionBox>
            <Text>__역의 퍙군적인 혼잡도는 __%입니다.</Text>
        </CongestionBox>
    </View>
  );
};

const CongestionBox = styled.View`
  width: 284;
  height: 100;
  border: 1px solid black;
`;

export default Congestion;