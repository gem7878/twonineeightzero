import axios from 'axios';

const KAKAO_API_KEY = '430228e76dbe2cbc629d6209742bb370';

const kakaoApiClient = axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Authorization': `${KAKAO_API_KEY}`,
    }
});

export default {kakaoApiClient, KAKAO_API_KEY};