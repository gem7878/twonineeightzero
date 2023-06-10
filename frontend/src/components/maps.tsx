import React from 'react';
import {View, Text, Image} from 'react-native';
import {styled} from 'styled-components/native';

interface MapsProps {
}

const Maps: React.FC<MapsProps> = props => {

  return (
    <View>
   <Image source={require('../assets/images/StationMap.png')} />     
   {/* <StationMapImg source={require('../assets/images/StationMap.png')} /> */}
    
    </View>
  );
};

const StationMapImg = styled.Image`
  width: 50%;
  margin-top: 10px;
`;

export default Maps;