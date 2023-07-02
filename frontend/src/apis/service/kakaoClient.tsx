import {KAKAO_API_KEY} from './secrets';

const API_BASE_URL1: string =
  'https://dapi.kakao.com/v2/local/search/category.json';
const API_BASE_URL2: string = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json';

async function searchSubwayStations(
  longitude: Number,
  latitude: Number,
): Promise<any[]> {
  try {
    const size = 5;
    const response = await fetch(
      `${API_BASE_URL1}?category_group_code=SW8&x=${longitude}&y=${latitude}&radius=3000&size=${size}&sort=distance`,
      {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Station API 요청 중 오류가 발생했습니다.');
    }

    const data = await response.json();
    const subwayStations: any[] = data.documents;
    let filteredSubwayStations = subwayStations.filter(value => {
      let stationNameNumber = value.place_name.split(' ');
      return ['5','6','7','8'].includes(stationNameNumber[1].charAt(0))
    })
    
    return filteredSubwayStations;
  } catch (error) {
    console.error('Station API 요청 중 오류가 발생했습니다:', error);
    return [];
  }
}

async function searchAdress(
  longitude: Number,
  latitude: Number,
): Promise<string> {
  try {
    const response = await fetch(
      `${API_BASE_URL2}?x=${longitude}&y=${latitude}`,
      {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Address API 요청 중 오류가 발생했습니다.');
    }

    const data = await response.json();
    const Address: any[] = data.documents;
    console.log(Address);
    return Address[0].region_3depth_name;
  } catch (error) {
    console.error('Address API 요청 중 오류가 발생했습니다:', error);
    return '';
  }
}

export {searchSubwayStations, searchAdress};