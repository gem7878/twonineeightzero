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
      await axiosInstance
        .post('/board/post/write', formData, {
          headers: {'x-access-token': token},
        })
        .then(function (res: any) {
          console.log(res.data);
          Alert.alert('게시글 작성 완료!');
          return moveMenuScreen('CustomerService');
        })
        .catch(function (error: any) {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <BackHeader />
      <CustomerServiceWriteContainer>
        <Text>제목</Text>
        <CustomerServiceInput
          onChangeText={value => setTitle(value)}
          placeholder="제목을 입력하세요"
        />
        <Text>내용</Text>
        <CustomerServiceInput
          onChangeText={value => setContent(value)}
          numberOfLines={6}
          placeholder="내용을 입력하세요"
        />
        <TouchableOpacity onPress={() => postBoardData()}>
          <Text>게시글 작성</Text>
        </TouchableOpacity>
      </CustomerServiceWriteContainer>
    </>
  );
};

const CustomerServiceWriteContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const CustomerServiceInput = styled.TextInput`
  border: 1px solid black;
  width: 80%;
`;

export default CustomerServiceWrite;
