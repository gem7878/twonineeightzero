import React from 'react';
import {Text, View, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {LogInHeader} from '../components/index';

interface Props {
    navigation: any;
    route: any;
}

const DisasterGuide: React.FC<Props> = ({navigation, route}) => {
    const {guideInformation} = route.params;
  
  return (
    <View style={{margin:20}}>
        <LogInHeader />
        {guideInformation.map((value : string, index : number) => {
            if(index % 2 === 0) {
                return (
                    <Text style={{fontSize:18, marginBottom:10}}>{value}</Text>
                )
            } else {
                if (value.length !== 0) {
                    return (
                        <FlatList
                            data={value.split('-')}
                            renderItem={({item, index}) => <Text style={{marginBottom:10}}>{index+1}. {item}</Text>}
                        />
                    )
                }
            }
        })}
    </View>
  );
};

export default DisasterGuide;