import React, {useEffect, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
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
  // const [token, setToken] = useState<string | null>(null);

  const [contentId, setContentId] = useState();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [postUserName, setPostUserName] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  const [commment, setCommment] = useState('');
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    (async () => {
      // console.log('오잉', route.params.id);
      setContentId(route.params.id);
      await getBoardData(route.params.id);
      await getCommentData(route.params.id);
    })();
  }, [isEditing]);

  const localDateTimeString = (utcString: string) => {
    const utc = new Date(utcString).getTime();
    const kst = new Date(utc + 9 * 60 * 60 * 1000);

    let formattedMonth =
      kst.getMonth() + 1 < 10
        ? `0${kst.getMonth() + 1}`
        : `${kst.getMonth() + 1}`;

    let formattedDate =
      kst.getDate() < 10 ? `0${kst.getDate()}` : `${kst.getDate()}`;

    return `${kst.getFullYear()}/${formattedMonth}/${formattedDate} ${kst.getHours()}:${kst.getSeconds()}:${kst.getMilliseconds()}`;
  };

  const loadToken = async () => {
    const myToken = await AsyncStorage.getItem('my-token');
    return myToken;
  };

  const getBoardData = async (postId: number) => {
    try {
      const token = await loadToken();
      const boardData = await axiosInstance.get(`/board/post/${postId}`, {
        headers: {'x-access-token': token},
      });

      // console.log(boardData.data);
      /** 객체
       * {"postId":포스트아이디,
       *  "title":"문의제목",
       *  "content":"문의내용",
       *  "updatedAt":"2023-10-23T05:58:58.511Z",
       *  "userName":"아이디",
       *  "editable":true}
       */
      setPostUserName(boardData.data.userName);
      setTitle(boardData.data.title);
      setContent(boardData.data.content);
      setDate(localDateTimeString(boardData.data.updatedAt));
      setIsEditable(boardData.data.editable);
    } catch (err) {
      console.error(err);
    }
  };

  const updateBoardData = async () => {
    try {
      const token = await loadToken();
      let formData = {
        title: title,
        content: content,
      };
      const updated = await axiosInstance
        .put(`/board/post/update/${contentId}`, formData, {
          headers: {'x-access-token': token},
        })

      if (updated.data.success == true) {
        Alert.alert('게시글 업데이트 완료!');
        setIsEditing(false);
      }
    
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBoardData = async () => {
    try {
      const token = await loadToken();
      const deleted = await axiosInstance
        .delete(`/board/post/delete/${contentId}`, {
          headers: {'x-access-token': token},
        })

      if (deleted.data.success == true) {
        Alert.alert('게시글 삭제 완료!');
        return navigation.navigate('CustomerService');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getCommentData = async (postId: number) => {
    try {
      const token = await loadToken();
      const commentData = await axiosInstance.get(`/board/comment/${postId}`, {
        headers: {'x-access-token': token},
      });

      console.log('hello', commentData.data);
      /** 배열
       * [{
       *  "commentID": "댓글인덱스아이디",
       *  "content": "댓글내용",
       *  "updatedAt": "2023-10-23T05:59:25.173Z",
       *  "userName": "아이디",
       *  "editable": false},
       *  {},...]
       */
      setCommentList(commentData.data);
    } catch (err) {
      console.error(err);
    }
  };
  const postCommentData = async () => {
    try {
      const token = await loadToken();
      let formData = {
        content: commment,
      };
      const posted = await axiosInstance
        .post(`/board/comment/${contentId}/write`, formData, {
          headers: {'x-access-token': token},
        })
      
      if(posted.data.success === true) {
        getCommentData(route.params.id);
        Alert.alert('댓글 작성 완료!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateCommentData = async (commentId: string) => {
    try {
      const token = await loadToken();
      let formData = {
        content: content,
      };
      const updated = await axiosInstance
        .put(`/board/comment/update/${commentId}`, formData, {
          headers: {'x-access-token': token},
        })
      
      if(updated.data.success === true) {
        Alert.alert('댓글 업로드 완료!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCommentData = async (commentId: string) => {
    try {
      const token = await loadToken();
      const deleted = await axiosInstance
        .delete(`/board/comment/delete/${commentId}`,{
          headers: {'x-access-token': token},
        })

      if(deleted.data.success === true) {
        Alert.alert('댓글 삭제 완료!');
        getCommentData(route.params.id);
      }
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
            {isEditable && (
              <CustomerEditView>
                <CustomerServiceButton onPress={() => setIsEditing(true)}>
                  <CustomerServiceText>편집하기</CustomerServiceText>
                </CustomerServiceButton>
                <CustomerServiceButton onPress={() => deleteBoardData()}>
                  <CustomerServiceText>삭제하기</CustomerServiceText>
                </CustomerServiceButton>
              </CustomerEditView>
            )}
            <CustomerTitleView>
              <CustomerTitleText>{title}</CustomerTitleText>
            </CustomerTitleView>
            <CustomerDateText>{postUserName}</CustomerDateText>
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
              <CustomerServiceButton onPress={() => postCommentData()}> 
                <CustomerServiceText>
                  확인
                </CustomerServiceText>
              </CustomerServiceButton>
            </CustomerCommentView>
            {commentList.length > 0 &&
              commentList.map((value : object, index : number) => {
                return (
                  <CustomerCommentList key={index}>
                    <CustomerCommentId>{value.userName}</CustomerCommentId>
                    <CustomerCommentContent>
                      {value.content}
                    </CustomerCommentContent>
                    {value.editable && (
                      <CustomerCommentEdit>
                        <CustomerCommentButton onPress={() => updateCommentData(value.commentId)}>
                          <CustomerCommentButtonText>
                            편집
                          </CustomerCommentButtonText>
                        </CustomerCommentButton>
                        <CustomerCommentButton onPress={() => deleteCommentData(value.commentId)}>
                          <CustomerCommentButtonText>
                            삭제
                          </CustomerCommentButtonText>
                        </CustomerCommentButton>
                      </CustomerCommentEdit>
                    )}
                  </CustomerCommentList>
                );
              })}
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
  margin-bottom: 20px;
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
  flex-direction: row;
  gap: 20px;
  width: 70%;
  margin-top: 5px;
  align-items: center;
`;
const CustomerCommentId = styled.Text`
  font-size: 12px;
`;
const CustomerCommentContent = styled.Text`
  font-size: 17px;
`;
const CustomerCommentButton = styled.TouchableOpacity`
  background-color: black;
  width: 40px;
  height: 20px;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-left: 5px;
`;
const CustomerCommentButtonText = styled.Text`
  color: white;
  font-size: 12px;
`;
const CustomerCommentEdit = styled.View`
  display: flex;
  flex-direction: row;
`;
export default CustomerServiceContent;
