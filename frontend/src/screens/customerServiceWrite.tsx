import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import axiosInstance from '../apis/service/client';
import {BackHeader} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: any;
}

const CustomerServiceWrite: React.FC<Props> = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    let today = new Date();
    let formattedMonth =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : `${today.getMonth() + 1}`;
    let formattedDate =
      today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;

    setDate(`${today.getFullYear()}-${formattedMonth}-${formattedDate}`);
  }, [date]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await AsyncStorage.getItem('my-token')
      .then(value => {
        if (value != null) {
          setToken(value);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const moveMenuScreen = (menu: string) => {
    navigation.navigate(menu);
  };

  const postBoardData = async () => {
    try {
      let formData = {
        title: title,
        content: content,
        // userName:
      };
      const res = await axiosInstance
        .post('/board/post/write', formData, {
          headers: {'x-access-token': token},
        })
      console.log(res.data);
      Alert.alert('게시글 작성 완료!');
      moveMenuScreen('CustomerService');

    } catch (error:any) {
      console.error(error.response.data.message);
      Alert.alert('권한이 없습니다.', '로그인하시겠습니까?',
      [
        {
          text: '아니요',
          onPress: () => moveMenuScreen('CustomerService'),
        },
        {
          text: '네',
          onPress: () => moveMenuScreen('SignIn'),
        }
      ])
    }
  };
  return (
    <>
      <BackHeader/>
      <CustomerServiceWriteContainer>
        <BigText>새로운 글쓰기</BigText>
        <MiddleText>제목</MiddleText>
        <CustomerServiceInput
          onChangeText={value => setTitle(value)}
          placeholder="제목을 입력하세요"
        />
        <MiddleText>내용</MiddleText>
        <CustomerServiceInput
          onChangeText={value => setContent(value)}
          numberOfLines={10}
          placeholder="내용을 입력하세요"
        />
        <SubmitButton onPress={() => postBoardData()}>
          <SubmitText>게시글 작성</SubmitText>
        </SubmitButton>
      </CustomerServiceWriteContainer>
    </>
  );
};

const CustomerServiceWriteContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  padding: 5px;
`;
const CustomerServiceInput = styled.TextInput`
  border: 1px solid black;
  width: 80%;
`;
const BigText = styled.Text`
  font-size: 20px;
  color: black;
`
const MiddleText = styled.Text`
  width: 80%;
  color: black;
  font-size: 16px;
  margin: 10px;
`
const SubmitButton = styled.TouchableOpacity`
  margin:10px;
`
const SubmitText = styled.Text`
  color: black;
  font-size: 16px;
  margin: 10px;
  padding: 10px;
  background-color: #00ffd1;
`
export default CustomerServiceWrite;
