import React from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';

const Congestion: React.FC = () => {
  return (
    <View>
      <CongestionBox>
        <Text>__역의 퍙군적인 혼잡도는 __%입니다.</Text>
      </CongestionBox>
    </View>
  );
};

const CongestionBox = styled.View`
  width: 284px;
  height: 100px;
  border: 1px solid black;
`;

export default Congestion;
