import React, {useEffect, useState} from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import styled from 'styled-components/native';
import axiosInstance from '../apis/service/client';
import {BackHeader} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dimensions} from 'react-native';

const window = Dimensions.get('window');

interface Props {
  route: any;
  navigation: any;
}

interface commentDataInterface {
  commentId: number;
  content: string;
  updatedAt: string;
  userName: string;
  editable: boolean;
}

const CustomerServiceContent: React.FC<Props> = ({route, navigation}) => {
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(0);
  // const [token, setToken] = useState<string | null>(null);

  const [contentId, setContentId] = useState<any>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [postUserName, setPostUserName] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  const [commment, setCommment] = useState('');
  const [commentList, setCommentList] = useState<Array<commentDataInterface>>(
    [],
  );

  useEffect(() => {
    setContentId(route.params.id);
    (async () => {
      await getBoardData(route.params.id);
      await getCommentData(route.params.id);
    })();
  }, [isPostEditing]);

  const moveMenuScreen = (menu: string) => {
    navigation.navigate(menu);
  };

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
    const myToken: any = await AsyncStorage.getItem('my-token');
    const expirationTime: any = await AsyncStorage.getItem('my-expiration');
    if (myToken !== null && expirationTime !== null) {
      console.log(new Date());
      console.log(new Date(expirationTime));
      if (new Date() >= new Date(expirationTime)) {
        await AsyncStorage.removeItem('my-token');
        await AsyncStorage.removeItem('my-expiration');
        Alert.alert('권한이 없습니다.', '로그인하시겠습니까?', [
          {
            text: '아니요',
            onPress: () => moveMenuScreen('CustomerService'),
          },
          {
            text: '네',
            onPress: () => moveMenuScreen('SignIn'),
          },
        ]);
        setIsEditable(false);
        setIsPostEditing(false);
        return null;
      } else {
        return myToken;
      }
    } else {
      setIsEditable(false);
      setIsPostEditing(false);
      return null;
    }
  };

  const getBoardData = async (postId: number) => {
    try {
      const token = await loadToken();
      const boardData = await axiosInstance.get(`/board/post/${postId}`, {
        headers: {'x-access-token': token},
      });

      setPostUserName(boardData.data.userName);
      setTitle(boardData.data.title);
      setContent(boardData.data.content);
      setDate(localDateTimeString(boardData.data.updatedAt));
      setIsEditable(boardData.data.editable);
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  };

  const updateBoardData = async () => {
    try {
      const token = await loadToken();
      let formData = {
        title: title,
        content: content,
      };
      const updated = await axiosInstance.put(
        `/board/post/update/${contentId}`,
        formData,
        {
          headers: {'x-access-token': token},
        },
      );

      if (updated.data.success == true) {
        Alert.alert('게시글 업데이트 완료!');
        setIsPostEditing(false);
      }
    } catch (error: any) {
      if (error.response.status === 403) {
        Alert.alert('권한이 없습니다.', '로그인하시겠습니까?', [
          {
            text: '아니요',
            onPress: () => moveMenuScreen('CustomerService'),
          },
          {
            text: '네',
            onPress: () => moveMenuScreen('SignIn'),
          },
        ]);
      } else {
        Alert.alert(error.response.data.message);
      }
    }
  };

  const deleteBoardData = async () => {
    try {
      const token = await loadToken();
      const deleted = await axiosInstance.delete(
        `/board/post/delete/${contentId}`,
        {
          headers: {'x-access-token': token},
        },
      );

      if (deleted.data.success === true) {
        Alert.alert('게시글 삭제 완료!');
        return navigation.navigate('CustomerService');
      }
    } catch (error: any) {
      if (error.response.status === 403) {
        Alert.alert('권한이 없습니다.', '로그인하시겠습니까?', [
          {
            text: '아니요',
            onPress: () => moveMenuScreen('CustomerService'),
          },
          {
            text: '네',
            onPress: () => moveMenuScreen('SignIn'),
          },
        ]);
      } else {
        Alert.alert(error.response.data.message);
      }
    }
  };
  const getCommentData = async (postId: number) => {
    try {
      const token = await loadToken();
      const commentData = await axiosInstance.get(`/board/comment/${postId}`, {
        headers: {'x-access-token': token},
      });

      setCommentList(commentData.data);
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  };
  const postCommentData = async () => {
    try {
      const token = await loadToken();
      let formData = {
        content: commment,
      };
      const posted = await axiosInstance.post(
        `/board/comment/${contentId}/write`,
        formData,
        {
          headers: {'x-access-token': token},
        },
      );

      if (posted.data.success === true) {
        getCommentData(route.params.id);
        setCommment('');
        Keyboard.dismiss();
        Alert.alert('댓글 작성 완료!');
        setCommment('');
      }
    } catch (error: any) {
      if (error.response.status === 403) {
        Alert.alert('권한이 없습니다.', '로그인하시겠습니까?', [
          {
            text: '아니요',
            onPress: () => moveMenuScreen('CustomerService'),
          },
          {
            text: '네',
            onPress: () => moveMenuScreen('SignIn'),
          },
        ]);
      } else {
        Alert.alert(error.response.data.message);
      }
    }
  };

  const updateCommentData = async (commentID: number) => {
    try {
      const token = await loadToken();
      console.log(commentID);
      let formData = {
        content: commment,
      };
      const updated = await axiosInstance.put(
        `/board/comment/update/${commentID}`,
        formData,
        {
          headers: {'x-access-token': token},
        },
      );

      if (updated.data.success == true) {
        setIsPostEditing(false);
        setIsCommentEditing(0);
        getCommentData(contentId);
        Alert.alert('댓글 수정 완료!');
      }
    } catch (error: any) {
      if (error.response.status === 403) {
        Alert.alert('권한이 없습니다.', '로그인하시겠습니까?', [
          {
            text: '아니요',
            onPress: () => moveMenuScreen('CustomerService'),
          },
          {
            text: '네',
            onPress: () => moveMenuScreen('SignIn'),
          },
        ]);
      } else {
        Alert.alert(error.response.data.message);
      }
    }
  };

  const deleteCommentData = async (commentID: number) => {
    try {
      const token = await loadToken();
      const deleted = await axiosInstance.delete(
        `/board/comment/delete/${commentID}`,
        {
          headers: {'x-access-token': token},
        },
      );

      if (deleted.data.success === true) {
        Alert.alert('댓글 삭제 완료!');
        getCommentData(route.params.id);
      }
    } catch (error: any) {
      if (error.response.status === 403) {
        Alert.alert('권한이 없습니다.', '로그인하시겠습니까?', [
          {
            text: '아니요',
            onPress: () => moveMenuScreen('CustomerService'),
          },
          {
            text: '네',
            onPress: () => moveMenuScreen('SignIn'),
          },
        ]);
      } else {
        Alert.alert(error.response.data.message);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      extraHeight={250}
      enableOnAndroid={true}
      // enableAutomaticScroll={Platform.OS === 'android'}
      contentContainerStyle={commentStyles.container}
      resetScrollToCoords={{x: 0, y: 0}}
      scrollEnabled={true}
      enableAutomaticScroll={true}>
      <SafeAreaView style={{height: window.height * 1}}>
        <BackHeader />
        <CustomerServiceContentContainer>
          {isPostEditing ? (
            <CustomerServiceWriteContainer>
              <BigText>글 수정하기</BigText>
              <MiddleText>제목</MiddleText>
              <CustomerServiceInput
                defaultValue={title}
                onChangeText={value => setTitle(value)}
              />
              <MiddleText>내용</MiddleText>
              <CustomerServiceInput
                defaultValue={content}
                onChangeText={value => setContent(value)}
                numberOfLines={10}
              />
              <ButtonContainer>
                <SubmitButton onPress={() => updateBoardData()}>
                  <SubmitText>게시글 업데이트</SubmitText>
                </SubmitButton>
                <SubmitButton onPress={() => setIsPostEditing(false)}>
                  <SubmitText>취소</SubmitText>
                </SubmitButton>
              </ButtonContainer>
            </CustomerServiceWriteContainer>
          ) : (
            <>
              {isEditable && (
                <CustomerEditView>
                  <CustomerServiceButton onPress={() => setIsPostEditing(true)}>
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
                  value={commment}
                />
                <CustomerServiceButton onPress={() => postCommentData()}>
                  <CustomerServiceText>확인</CustomerServiceText>
                </CustomerServiceButton>
              </CustomerCommentView>
              {commentList.length > 0 &&
                commentList.map((value, index) => {
                  return (
                    <CustomerCommentList key={index}>
                      <CustomerCommentId>{value.userName}</CustomerCommentId>
                      {isCommentEditing === index + 1 ? (
                        <TextInput
                          defaultValue={value.content}
                          onChangeText={inputValue => setCommment(inputValue)}
                        />
                      ) : (
                        <CustomerCommentContent>
                          {value.content}
                        </CustomerCommentContent>
                      )}

                      {value.editable &&
                        (isCommentEditing === index + 1 ? (
                          <CustomerCommentEdit>
                            <CustomerCommentButton
                              onPress={() =>
                                updateCommentData(value.commentId)
                              }>
                              <CustomerCommentButtonText>
                                확인
                              </CustomerCommentButtonText>
                            </CustomerCommentButton>
                          </CustomerCommentEdit>
                        ) : (
                          <CustomerCommentEdit>
                            <CustomerCommentButton
                              onPress={() => setIsCommentEditing(index + 1)}>
                              <CustomerCommentButtonText>
                                편집
                              </CustomerCommentButtonText>
                            </CustomerCommentButton>
                            <CustomerCommentButton
                              onPress={() =>
                                deleteCommentData(value.commentId)
                              }>
                              <CustomerCommentButtonText>
                                삭제
                              </CustomerCommentButtonText>
                            </CustomerCommentButton>
                          </CustomerCommentEdit>
                        ))}
                    </CustomerCommentList>
                  );
                })}
            </>
          )}
        </CustomerServiceContentContainer>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const commentStyles = StyleSheet.create({
  container: {
    height: window.height * 2,
  },
});

const CustomerServiceContentContainer = styled.View`
  width: 100%;
  align-items: center;
`;
const CustomerTitleView = styled.View`
  width: 70%;
  height: fit-content;
  /* height: 50; */
`;
const CustomerTitleText = styled.Text`
  font-size: 25px;
`;
const CustomerContentView = styled.View`
  width: 70%;
  height: 250;
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
  flex-wrap: wrap;
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

const CustomerServiceWriteContainer = styled.View`
  width: 100%;
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
`;
const MiddleText = styled.Text`
  width: 80%;
  color: black;
  font-size: 16px;
  margin: 10px;
`;
const ButtonContainer = styled.View`
  flexdirection: row;
`;
const SubmitButton = styled.TouchableOpacity`
  margin-top: 15px;
`;
const SubmitText = styled.Text`
  color: black;
  font-size: 16px;
  margin: 5px;
  padding: 10px;
  background-color: #00ffd1;
`;

export default CustomerServiceContent;
