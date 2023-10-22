import React, {useEffect, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import axiosInstance from '../apis/service/client';
import {BackHeader} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  route: any;
  navigation: any;
}
export const bodyDatas = [
  {제목: '제목1', 아이디: '아이디1', 날짜: '날짜1', 내용: '내용1'},
  {제목: '제목2', 아이디: '아이디2', 날짜: '날짜2', 내용: '내용2'},
  {제목: '제목3', 아이디: '아이디3', 날짜: '날짜3', 내용: '내용3'},
];
const CustomerServiceContent: React.FC<Props> = ({route, navigation}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [contentId, setContentId] = useState();
  const [commment, setCommment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    loadData();
    console.log('오잉', route.params.id);

    setContentId(route.params.id);
    if (!isEditing) {
      getBoardData(route.params.id);
      getCommentData({id: route.params.id, page: route.params.page});
    }
    // setTitle(bodyDatas[route.params.id].제목);
    // setContent(bodyDatas[route.params.id].내용);
    // setDate(bodyDatas[route.params.id].날짜);
  }, [isEditing]);

  useEffect(() => {
    let today = new Date();
    let formattedMonth =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : `${today.getMonth() + 1}`;
    let formattedDate =
      today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;

    // setDate(`${today.getFullYear()}-${formattedMonth}-${formattedDate}`);
  }, [date]);

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

  const getBoardData = async (id: number) => {
    try {
      await axiosInstance
        .get(`/board/post/${id}`)
        .then(function (res: any) {
          // setTitle(res.data.title);
          // setContent(res.data.content);
          console.log('오호', res.data);

          // setDate(res.data.date);
        })
        .catch(function (error: any) {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const updateBoardData = async () => {
    let today = new Date();
    let formattedMonth =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : `${today.getMonth() + 1}`;
    let formattedDate =
      today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;
    try {
      let formData = {
        title: title,
        content: content,
        // date: `${today.getFullYear()}-${formattedMonth}-${formattedDate}`,
      };
      await axiosInstance
        .post(`/board/post/update/${contentId}`, formData, {
          headers: {'x-access-token': token},
        })
        .then(function (res: any) {
          console.log(res.data);
          Alert.alert('게시글 업데이트 완료!');
          return setIsEditing(false);
        })
        .catch(function (error: any) {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const deleteBoardData = async () => {
    try {
      await axiosInstance
        .delete(`/board/post/delete/${contentId}`)
        .then(function (res: any) {
          console.log(res.data);
          Alert.alert('게시글 삭제 완료!');
          return navigation.navigate('CustomerService');
        })
        .catch(function (error: any) {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const getCommentData = async ({id, page}: any) => {
    try {
      await axiosInstance
        .get(`/board/comment/${id}/page/${page}/`)
        .then(function (res: any) {
          console.log(res.data);
          // setCommentList(res.data.content);
        })
        .catch(function (error: any) {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const postCommentData = async () => {
    try {
      let formData = {
        content: commment,
        // date: date,
      };
      await axiosInstance
        .post(`/board/comment/${contentId}/write`, formData, {
          headers: {'x-access-token': token},
        })
        .then(function (res: any) {
          console.log(res.data);
          return Alert.alert('댓글 작성 완료!');
        })
        .catch(function (error: any) {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const updateCommentData = async () => {
    try {
      let formData = {
        content: content,
        // date: `${today.getFullYear()}-${formattedMonth}-${formattedDate}`,
      };
      await axiosInstance
        .post(`/board/comment/update/${contentId}`, formData, {
          headers: {'x-access-token': token},
        })
        .then(function (res: any) {
          console.log(res.data);
          Alert.alert('댓글 업로드 완료!');
          return setIsEditing(false);
        })
        .catch(function (error: any) {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const deleteCommentData = async () => {
    try {
      await axiosInstance
        .delete(`/board/comment/delete/${contentId}`)
        .then(function (res: any) {
          console.log(res.data);
          Alert.alert('댓글 삭제 완료!');
          return navigation.navigate('CustomerService');
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
      <CustomerServiceContentContainer>
        {isEditing ? (
          <>
            <Text>제목</Text>
            <TextInput
              onChangeText={value => setTitle(value)}
              placeholder={title}
            />
            <Text>내용</Text>
            <TextInput
              onChangeText={value => setContent(value)}
              numberOfLines={6}
              placeholder={content}
            />
            <TouchableOpacity onPress={() => updateBoardData()}>
              <Text>게시글 업데이트</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text>취소</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <CustomerEditView>
              <CustomerServiceButton onPress={() => setIsEditing(true)}>
                <CustomerServiceText>편집하기</CustomerServiceText>
              </CustomerServiceButton>
              <CustomerServiceButton onPress={() => deleteBoardData()}>
                <CustomerServiceText>삭제하기</CustomerServiceText>
              </CustomerServiceButton>
            </CustomerEditView>
            <CustomerTitleView>
              <CustomerTitleText>{title}</CustomerTitleText>
            </CustomerTitleView>
            <CustomerContentView>
              <CustomerContentText>{content}</CustomerContentText>
            </CustomerContentView>

            <CustomerDateText>{date}</CustomerDateText>

            <CustomerCommentView>
              <CustomerCommentInput
                numberOfLines={4}
                placeholder="댓글을 입력하세요"
                onChangeText={value => setCommment(value)}
              />
              <CustomerServiceButton>
                <CustomerServiceText onPress={() => postCommentData()}>
                  확인
                </CustomerServiceText>
              </CustomerServiceButton>
            </CustomerCommentView>
            <CustomerCommentList>
              {/* {getCommentData.map((value, index) => {
                return <Text>댓글1</Text>;
              })} */}

              <CustomerCommentEdit>
                <TouchableOpacity>
                  <Text>편집</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text>삭제</Text>
                </TouchableOpacity>
              </CustomerCommentEdit>
            </CustomerCommentList>
          </>
        )}
      </CustomerServiceContentContainer>
    </>
  );
};

const CustomerServiceContentContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CustomerTitleView = styled.View`
  width: 70%;
  height: fit-content;
`;
const CustomerTitleText = styled.Text`
  font-size: 25px;
`;
const CustomerContentView = styled.View`
  width: 70%;
  height: 40%;
  margin-top: 10px;
  border: 1px solid black;
`;
const CustomerContentText = styled.Text`
  font-size: 17px;
`;
const CustomerDateText = styled.Text`
  width: 70%;
  font-size: 13px;
  text-align: right;
`;
const CustomerEditView = styled.View`
  display: flex;
  flex-direction: row;
  gap: 5px;
  width: 70%;
  justify-content: flex-end;
`;
const CustomerCommentView = styled.View`
  width: 70%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
`;
const CustomerCommentInput = styled.TextInput`
  border: 1px solid black;
  width: 70%;
  height: 80px;
`;
const CustomerServiceButton = styled.TouchableOpacity`
  background-color: black;
  width: 60px;
  height: 30px;
  align-items: center;
  display: flex;
  justify-content: center;
`;
const CustomerServiceText = styled.Text`
  color: white;
  font-size: 12px;
`;
const CustomerCommentList = styled.View`
  display: flex;
  flex-direction: column;
  width: 70%;
`;
const CustomerCommentEdit = styled.View`
  display: flex;
  flex-direction: row;
`;
export default CustomerServiceContent;
