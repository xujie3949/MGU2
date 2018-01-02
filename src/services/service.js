import axios from 'axios';
import appStore from 'Stores/appStore';
import userStore from 'Stores/userStore';
import mockData from 'Services/mockData';

class Service {
  axiosInstance = null;
  cancelSource = null;

  constructor() {
      this.axiosInstance = this.createAxiosInstance();
      this.cancelSource = new Map();
  }

  createAxiosInstance() {
      const axiosInstance = axios.create({
          baseURL: 'http://192.168.4.129/service/mapspotter',
          timeout: 10000,
      });

      this.addInterceptor(axiosInstance);

      return axiosInstance;
  }

  addInterceptor(axiosInstance) {
      axiosInstance.interceptors.request.use(this.addCancelToken);
      axiosInstance.interceptors.request.use(this.addTokenToParams);
      axiosInstance.interceptors.response.use(this.removeCancelToken);
  }

  addCancelToken = config => {
      const source = axios.CancelToken.source();
      this.cancelSource.set(source.token, source);
      config.cancelToken = source.token;
      return config;
  };

  addTokenToParams = config => {
      if (!config.url.endsWith('/user/login')) {
          if (!config.params) {
              config.params = new URLSearchParams();
          }
          if (userStore.token) {
              config.params.append('access_token', userStore.token);
          } else {
              config.params.append('access_token', userStore.publicToken);
          }
      }
      return config;
  };

  removeCancelToken = response => {
      if (this.cancelSource.has(response.config.cancelToken)) {
          this.cancelSource.delete(response.config.cancelToken);
      }
      return response;
  };

  cancelRequest() {
      for (const [key, value] of this.cancelSource) {
          value.cancel();
      }

      this.cancelSource.clear();
  }

  handleTokenError(data) {
      if (data.errcode === -100) {
          appStore.setError(data.errmsg);
          return true;
      }
      return false;
  }

  async login(username, password) {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      // const response = await this.axiosInstance.get('user/login', { params: params });
      // return response.data;
      return mockData.loginSuccess;
  }
}

const service = new Service();
export default service;

