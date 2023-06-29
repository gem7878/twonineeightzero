import { KAKAO_API_KEY } from './secrets';

const API_BASE_URL: string = 'https://dapi.kakao.com/v2/local/search/category.json';

async function searchSubwayStations(longitude: Number, latitude: Number): Promise<any[]> {
  try {
    const size = 5;
    const response = await fetch(`${API_BASE_URL}?category_group_code=SW8&x=${longitude}&y=${latitude}&radius=3000&size=${size}&sort=accuracy`, {
      method: 'GET',
      headers: {
        'Authorization': `KakaoAK ${KAKAO_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('API 요청 중 오류가 발생했습니다.');
    }

    const data = await response.json();
    const subwayStations: any[] = data.documents;
    return subwayStations;
  } catch (error) {
    console.error('API 요청 중 오류가 발생했습니다:', error);
    return [];
  }
}

export default searchSubwayStations;