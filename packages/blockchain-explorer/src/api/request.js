import axios from 'axios';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 60 * 1000,
  withCredentials: false,
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);


service.interceptors.response.use(
  (response) => {
    return response.data.data;

  },
  (err) => {
    return Promise.reject(err);
  },
);

export default service;
