import axios from "axios";

const service = axios.create({
  timeout: 10000,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    /*    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }*/
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
