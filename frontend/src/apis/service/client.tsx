import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'https://secure-unison-398308.du.r.appspot.com',
}); // http://10.0.2.2:3000

export default axiosInstance;
