import axios, {InternalAxiosRequestConfig} from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http:/api.tula.vyatkaowls.ru/api', // API URL
  // baseURL: 'http://localhost:8000/api', // API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor для установки токена авторизации
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.authorization = token;
  return config;
});

// Interceptor для показа ошибок
/*axios.interceptors.response.use(function (response) {
  if (response.data && response.data.success && response.data.success === false) {
    toast.error(response.data.message);
  }
  return response;
}, function (e: AxiosError) {
  console.error(e);
  toast.error(e.message);
  return e;
});*/

export default axiosInstance;