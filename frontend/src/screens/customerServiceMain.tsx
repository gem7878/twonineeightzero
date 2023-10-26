import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {BackHeader} from '../components';
import axiosInstance from '../apis/service/client';
import {useIsFocused} from '@react-navigation/native';

interface Props {
  route: any;
  navigation: any;
}

interface boardDataInterface {
  id: any,
  title: string,
  createdAt: string,
}

export const heads = [
  '번호',
  '제목',
  '아이디',
  // '날짜'
];

export const bodyDatas = [
  {제목: '제목1', 아이디: '아이디1', 날짜: '날짜1', 내용: '내용1'},
  {제목: '제목2', 아이디: '아이디2', 날짜: '날짜2', 내용: '내용2'},
  {제목: '제목3', 아이디: '아이디3', 날짜: '날짜3', 내용: '내용3'},
];
const CustomerServiceMain: React.FC<Props> = ({route, navigation}) => {
  const [page, setPage] = useState(1);
  const [postData, setPostData] = useState<Array<boardDataInterface>>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getPosFindAll();
    }
  }, [isFocused]);

  const getPosFindAll = async () => {
    try {
      await axiosInstance
        .get(`/board/post/page/${page}`)
        .then(function (res: any) {
          //console.log('안녕', res.data.data);

          setPostData(res.data.data);
        })
        .catch(function (error: any) {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <CustomerServiceContainer>
      <BackHeader />
      <CustomerServiceTitle>고객의 소리</CustomerServiceTitle>
      <WriteButton onPress={() => navigation.navigate('CustomerServiceWrite')}>
        <WriteButtonText>글쓰기</WriteButtonText>
      </WriteButton>
      <BoardContainer>
        <BoardHeader>
          <BoardData>
            <Text>제목</Text>
          </BoardData>
        </BoardHeader>
        <BoardBody>
          {postData.map((value, index) => {
            return (
              <BoardRow
                key={index}
                onPress={() =>
                  navigation.navigate('CustomerServiceContent', {
                    id: value.id,
                    page: page,
                  })
                }>
                <BoardData key={index}>
                  <Text>{value.title}</Text>
                </BoardData>
              </BoardRow>
            );
          })}
        </BoardBody>
      </BoardContainer>
    </CustomerServiceContainer>
  );
};

const CustomerServiceContainer = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CustomerServiceTitle = styled.Text`
  font-size: 20px;
  /* margin-top: 10px; */
`;
const WriteButton = styled.TouchableOpacity`
  margin-top: 30px;
  width: 88%;
`;
const WriteButtonText = styled.Text`
  width: 45px;
  height: 22px;
  background-color: black;
  color: white;
  text-align: center;
`;
const BoardContainer = styled.View`
  width: 88%;
  height: 90%;
  margin-top: 10px;
`;
const BoardHeader = styled.View`
  height: 10%;
  max-height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: #00ffd1;
`;
const BoardBody = styled.View`
  display: flex;
  flex-direction: column;
  border: 1px solid #00ffd1;
`;
const BoardRow = styled.TouchableOpacity`
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: 1px solid #00ffd1;
`;
const BoardData = styled.View`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default CustomerServiceMain;
