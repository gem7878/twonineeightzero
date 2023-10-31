import React, {useEffect, useReducer, useState} from 'react';
import {TouchableOpacity, Text, ScrollView, Alert, View, RefreshControl} from 'react-native';
import styled from 'styled-components/native';
import {BackHeader, TableComponent} from '../components';
import axiosInstance from '../apis/service/client';
import {useIsFocused} from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';

interface Props {
  route: any;
  navigation: any;
}

interface boardDataInterface {
  postId: number,
  title: string,
  userName: string,
}

type Action = { type: 'reset' } | { type: 'addItem'; payload: Array<BorderlessButton> };

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

const reducer = (state: Array<boardDataInterface>, action: any) => {
  switch (action.type) {
    case 'reset':
      return [];
    case 'newItem':
      return [...action.payload];
    case 'addItem':
      return [...state, ...action.payload];
    default:
      return state;
  }
};

const CustomerServiceMain: React.FC<Props> = ({route, navigation}) => {
  const [page, setPage] = useState(1);
  const [postData, disPatch] = useReducer(reducer, []);
  const [countPage, setCountPage] = useState<number>(0);
  const [countAllPost, setCountAllPost] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused) {
      getPostFindAll(1,'newItem');
    }
  }, [isFocused])

  useEffect(() => {
    console.log('총 포스트 수: '+countAllPost);
  }, [countAllPost])

  // 새로고침 함수
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getPostFindAll(1,'newItem');
      setPage(1);
      setRefreshing(false);
    }, 2000);
    
  }

  const getPostFindAll = async (page: number, type: string = 'addItem') => {
    try {
      const res = await axiosInstance
        .get(`/board/post/page/${page}`)

      disPatch({ type: type, payload: res.data.data}); 
      setCountPage(res.data.countPage);
      setCountAllPost(res.data.countAllPost);
    } catch (error:any) {
      console.error(error.response.data.message);
    }
  };

  return (
    <>
    <BackHeader/>
    <CustomerServiceContainer>
      <CustomerServiceTitle>고객의 소리</CustomerServiceTitle>
      <WriteButton>
        <TouchableOpacity onPress={() => navigation.navigate('CustomerServiceWrite')}>
          <WriteButtonText>글쓰기</WriteButtonText>
        </TouchableOpacity>
      </WriteButton>
    </CustomerServiceContainer>
    <Container>
      <TableComponent 
        index='번호' 
        title='제목' 
        userName='글쓴이' 
        disabled={true} 
        onPressFunction={()=> {}} 
        isTitle={true}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <ScrollContent>
          {postData.map((value, idx) => 
            (<TableComponent 
              key={idx}
              index={countAllPost-idx} 
              title={value.title} 
              userName={value.userName}
              disabled={false} onPressFunction={async ()=> {
                navigation.navigate('CustomerServiceContent', {
                  id: value.postId
                });
              }}
            />))}
          <MoreButton
            onPress={async () => {
              if(page+1 <= countPage) {
                setPage(page+1);
                getPostFindAll(page+1);
              } else {
                Alert.alert('마지막 글입니다.');
              }
            }}
          >
            <MoreText>더보기</MoreText>
          </MoreButton>
        </ScrollContent>
      </ScrollView>
    </Container>
    </>
  );
};

const CustomerServiceContainer = styled.View` 
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CustomerServiceTitle = styled.Text`
  font-size: 20px;
  margin-bottom: 20px;
`;
const WriteButton = styled.View`
  width: 88%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
const WriteButtonText = styled.Text`
  width: 45px;
  height: 22px;
  background-color: black;
  color: white;
  text-align: center;
`;
const Container = styled.View`
  flex: 1;
  padding: 10px;
  margin: 10px;
`;
const ScrollContent = styled.View`
  flex-grow: 1;
  justify-content: space-between;
`;
const MoreButton = styled.TouchableOpacity`
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: rgb(150,150,150);
  padding: 10px;
`;
const MoreText = styled.Text`
  color: white;
`;

export default CustomerServiceMain;
