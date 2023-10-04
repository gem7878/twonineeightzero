import React, {useRef} from 'react';
import {Text, Button, Alert, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import styled from 'styled-components/native';
import axiosInstance from '../apis/service/client';
import {BackHeader} from '../components';
import {useNavigation} from '@react-navigation/native';

const SignUpScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      ID: '',
      Password: '',
      Confirm: '',
    },
  });

  /**비밀번호와 비밀번호 확인란이 같은지 확인 */
  const password = useRef({});
  password.current = watch('Password', '');

  const {goBack} = useNavigation();
  const onSubmit = async (data: any) => {
    await axiosInstance
      .post('/auth/signup', {
        user_name: data.ID,
        user_password: data.Password,
        roles: []
      })
      .then(function (res: any) {
        if (res.status === 200) {
          console.log(res.data.message);
          goBack();
        }
      })
      .catch(function (error: any) {
        Alert.alert('오류', error.response.data.message);
      });
  };

  return (
    <ContentContainer>
      <BackHeader />

      <SignUpBox>
        <LeftText>아이디</LeftText>
        <Controller
          control={control}
          rules={{
            minLength: {
              value: 6,
              message: '아이디 6글자 이상 입력하시오',
            },
            maxLength: {
              value: 15,
              message: '아이디를 15글자 이하 입력하시오',
            },
            required: {
              value: true,
              message: '아이디를 입력하시오',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              placeholder="아이디를 입력하시오"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="ID"
        />
        {errors.ID && <Text style={{color: 'red'}}>{errors.ID.message}</Text>}

        <LeftText>비밀번호</LeftText>
        <Controller
          control={control}
          rules={{
            minLength: {
              value: 8,
              message: '비밀번호를 8글자 이상 입력하시오',
            },
            maxLength: {
              value: 20,
              message: '비밀번호를 20글자 이하 입력하시오',
            },
            required: {
              value: true,
              message: '비밀번호를 입력하시오',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              secureTextEntry={true}
              placeholder="비밀번호를 입력하시오"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="Password"
        />
        {errors.Password && (
          <Text style={{color: 'red'}}>{errors.Password.message}</Text>
        )}

        <LeftText>비밀번호 확인</LeftText>
        <Controller
          control={control}
          rules={{
            validate: value =>
              value === password.current || '비밀번호가 일치하지 않습니다',
            required: {
              value: true,
              message: '비밀번호를 입력하시오',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              secureTextEntry={true}
              placeholder="비밀번호 확인"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="Confirm"
        />
        {errors.Confirm && (
          <Text style={{color: 'red'}}>{errors.Confirm.message}</Text>
        )}

        <View style={{margin: 20}}>
          <Button
            color={'#00ffd1'}
            title="회원가입"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </SignUpBox>
      <SignUpFooter />
    </ContentContainer>
  );
};

const ContentContainer = styled.View`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const SignUpBox = styled.View`
  width: 80%;
`;

const LeftText = styled.Text`
  text-align: left;
  margin-top: 20px;
  color: black;
  font-size: 14px;
  font-weight: 200;
`;

const FormInput = styled.TextInput`
  border-radius: 4px;
  border: 1px solid black;
  padding: 10px 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 14px;
`;

const SignUpFooter = styled.View`
  height: 15%;
`;
export default SignUpScreen;
