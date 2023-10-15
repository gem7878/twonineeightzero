import React, {Dispatch, SetStateAction} from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';

interface GuideFooterStyle {
  $isMenu: Boolean;
}

interface GuideFooterProps {
  openMenu: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  navigation: any;
}
const GuideFooter: React.FC<GuideFooterProps> = ({
  navigation,
  openMenu,
  setMenuOpen,
}) => {
  const menuList = [
    [
      '탈선사고',
      require('../assets/icons/AwayIcon.png'),
      [
        '기관사 및 승무원의 안내방송에 따라 대피합니다.',
        '승무원이 승강문을 개방하면 질서 있게 대피합시다.(필요시, 비상사다리 설치) - 부상자, 노약자, 임산부가 먼저 대피할 수 있도록 배려하고 도와줍니다.',
        '승강문이 열리지 않으면 비상용 망치를 이용하여 비상창문을 깨고 탈출할 수 있습니다.',
        '',
        '터널내에서는 비상 유도등을 따라 가까운 터널 입구 및 비상대피소로 이동합니다.',
        '반대편 선로로 절대 대피하지 않도록 하고, 선로변내에 머무르지 않습니다. - 안전한 장소에서 구급차, 구원열차, 버스 등 연계수송 교통수단을 기다립니다.',
      ],
    ],
    [
      '화재사고',
      require('../assets/icons/FireIcon.png'),
      [
        '노약자·장애인석 옆에 있는 비상버튼을 눌러 승무원과 연락합니다.',
        '',
        '여유가 있다면 객차마다 2개씩 비치된 소화기를 이용하여 불을 끕니다.',
        '',
        '출입문이 자동으로 열리지 않으면 수동으로 문을 열고, 여의치 않으면 비상용 망치를 이용하여 유리창을 깨고, 망치가 없으면 소화기로 유리창을 깹니다.',
        '스크린도어(PSD)가 열리지 않을 경우는 스크린도어에 설치된 빨간색 바를 밀고 나갑니다. - 코와 입을 수건, 티슈, 옷소매 등으로 막고 비상구로 신속히 대피합시다.',
        '정전 시에는 대피유도 등을 따라 출구로 나가고, 유도등이 보이지 않을 때는 벽을 짚으면서 나가거나 시각장애인 안내용 보도블록을 따라 나갑시다.',
        '',
        '지상으로 대피가 여의치 않을 때는 전동차 진행방향 터널로 대피합시다.',
        '',
      ],
    ],
    [
      '추락사고',
      require('../assets/icons/FallIcon.png'),
      [
        '선로 위에 떨어졌을 때',
        '침착하게 승강장 밑, 벽면 여유공간에 엎드려 주십시오 - 큰소리로 도움을 청하여 주십시오.',
        '선로 위에 떨어진 사람을 보았을 때',
        '사람을 구하려고 무리하게 선로로 뛰어드는 것은 매우 위험한 일 입니다.',
        '선로 위에 물건을 떨어뜨렸을 때',
        '스스로 물건을 주우려고 선로로 뛰어드는 것은 매우 위험한 일 입니다.',
        '비상 상황 버튼을 사용하세요.',
        '지하철 역에는 플랫폼이나 열차 내에 비상 상황을 신고할 수 있는 버튼이 있을 수 있습니다. 역무원에게 도움을 요청하세요.',
      ],
    ],
    [
      '침수사고',
      require('../assets/icons/FloodIcon.png'),
      [
        '지하 역사',
        '지하공간 바닥에 물이 조금이라도 차오르거나 하수구에서 역류시 즉시 대피하세요. - 외부수심이 무릎 이상일 경우 혼자서 개방이 불가하므로, 전기전원 차단 후 여러명이 힘을 합쳐 문을 열고 신속히 대피하세요.',
        '지하 계단',
        '정강이 높이 정도로만 물이 유입되어도 성인이 올라가기 어렵기 때문에 조금이라도 흘러들어오면 즉시 대피하세요. - 어린이나 노약자는 계단에 유입되는 물이 발목 높이라도 계단을 올라갈 수 없으니 조금이라도 유입이 되면 즉시 대피해 주세요.',
      ],
    ],
    ['MENU', ''],
  ];

  return (
    <Footer>
      {menuList.map((value: any, index: number) => {
        return (
          <FooterBtn $isMenu={value[0] === 'MENU' ? true : false} key={index}>
            <TouchableOpacityBtn
              $isMenu={value[0] === 'MENU' ? true : false}
              onPress={() => {
                if (value[0] === 'MENU') {
                  setMenuOpen(!openMenu);
                } else {
                  navigation.navigate('DisasterGuides', {
                    guideInformation: value[2],
                  });
                }
              }}>
              {index !== menuList.length - 1 ? (
                <Image source={value[1]} />
              ) : (
                <></>
              )}
              <FooterMenuText $isMenu={value[0] === 'MENU' ? true : false}>
                {value[0]}
              </FooterMenuText>
            </TouchableOpacityBtn>
          </FooterBtn>
        );
      })}
    </Footer>
  );
};

const Footer = styled.View`
  background-color: #bebebe;
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const FooterBtn = styled.View<GuideFooterStyle>`
  width: 20%;
  height: 100%;
  background-color: ${props => (props.$isMenu ? '#676767' : 'white')};
  /* border: ${props => (props.$isMenu ? 'none' : '1px solid #fbff00')}; */
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FooterMenuText = styled.Text<GuideFooterStyle>`
  color: ${props => (props.$isMenu ? 'white' : 'black')};
  font-size: 12px;
  text-align: center;
  font-weight: 700;
  margin-top: 3px;
`;
const TouchableOpacityBtn = styled.TouchableOpacity<GuideFooterStyle>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
`;
export default GuideFooter;
