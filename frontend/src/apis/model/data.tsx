// 위도 경도
export interface Coordinate {
    latitude: number;
    longitude: number;
}

// 주소
export interface Address {
    region_type: string;
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_4depth_name: string;
    code: string;
    x: number;
    y: number;
}