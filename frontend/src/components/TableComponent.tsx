import React from 'react';
import styled from 'styled-components/native';

interface Props {
    index: any,
    title: string,
    userName: string,
    disabled: boolean,
    onPressFunction: Function,
    isTitle?: boolean,
}

const TableComponent: React.FC<Props> = ({index, title, userName, disabled, onPressFunction, isTitle = false}) => {
  return (
    <Table disabled={disabled} onPress={() => onPressFunction()} isTitle={isTitle}>
        <TableCell style={{width:'20%'}}>
            <TableText>{index}</TableText>
        </TableCell>
        <TableCell style={{width:'55%'}}>
            <TableText>{title}</TableText>
        </TableCell>
        <TableCell style={{width:'25%'}}>
            <TableText>{userName}</TableText>
        </TableCell>
    </Table>
  );
};

const Table = styled.TouchableOpacity<{ isTitle: boolean }>`
  background-color: ${(props) => (props.isTitle ? '#00ffd1' : '')};
  flex-direction: row;
  justify-content: space-around;
`;

const TableCell = styled.View`
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid #00ffd1;
`;

const TableText = styled.Text`
    color: black;
`;

export default TableComponent;
