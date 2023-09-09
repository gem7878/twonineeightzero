import React from 'react';
import {ScrollView, Image, Text, TouchableOpacity, Button, View} from 'react-native';
import styled from 'styled-components/native';

interface Props {
    titles: object
}

const DisasterGuide: React.FC<Props> = ({titles}) => {
  
  return (
    <>
    <ScrollView>
        {/*Object.keys(titles).map((key : string) => {
            return (
                <TableConponent>
                    <Text>{titles[key]}</Text>
                </TableConponent>
            )
        })*/}
    </ScrollView>
    <TouchableOpacity style={{margin: 20}}>
        
    </TouchableOpacity>
    </>
  );
};

const TableConponent = styled.View`
    flexDirection: row,
    alignItems: center,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.BORDER_COLOR,
`
export default DisasterGuide;
