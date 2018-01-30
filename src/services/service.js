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
        const axiosInstance = axios.create(
            {
                baseURL: 'http://192.168.4.129:8077/',
                timeout: 100000,
            },
        );

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
        this.cancelSource.set(source.token, {
            url: config.url,
            cancel: source.cancel,
        });
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
            value.cancel(`请求被取消:${value.url}`);
        }

        this.cancelSource.clear();
    }

    isCancelError(err) {
        return axios.isCancel(err);
    }

    handleTokenError(data) {
        if (data.errcode === -100) {
            appStore.setError(data.errmsg);
            return true;
        }
        return false;
    }

    async loginMap(username, password) {
        // const params = new URLSearchParams();
        // params.append('parameter', JSON.stringify(
        //     {
        //         userNickName: username,
        //         userPassword: password,
        //     },
        // ));
        // const response = await this.axiosInstance.get(
        //     'http://fastmap.navinfo.com/beta/service/man/userInfo/login',
        //     { params: params },
        // );
        // return response.data;
        return mockData.loginSuccess;
    }

    async login(username, password) {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        // const response = await this.axiosInstance.get('user/login', { params: params });
        // return response.data;
        return mockData.loginSuccess;
    }

    async getTrajectoryLineList(northWest, southEast) {
        const params = new URLSearchParams();
        params.append('latlon_1', `${northWest.lat}_${northWest.lng}`);
        params.append('latlon_2', `${southEast.lat}_${southEast.lng}`);
        // const response = await this.axiosInstance.get('photos/getSummaryByGeometry', { params: params });
        // return response.data;
        return mockData.trajectoryListSuccess;
        // const params = new URLSearchParams();
        // // params.append('minx', northWest.lng);
        // // params.append('maxx', southEast.lng);
        // // params.append('miny', southEast.lat);
        // // params.append('maxy', northWest.lat);
        // params.append('minx', 53);
        // params.append('maxx', 154.2);
        // params.append('miny', 6.1);
        // params.append('maxy', 53.4);
        // const response = await this.axiosInstance.get('esindex/getbyenvelop', { params: params });
        // return response.data;
    }

    async getTrajectoryLineDetail(trajectoryLine) {
        const params = new URLSearchParams();
        params.append('worker', trajectoryLine.worker);
        params.append('platform', trajectoryLine.platform);
        params.append('date', trajectoryLine.date);
        params.append('limit', -1);
        const response = await this.axiosInstance.get('tracks/queryTracks', { params: params });
        return response.data;
        // return mockData.trajectoryListSuccess;
    }

    async getTrajectoryPointDetail(trajectoryPoint) {
        const params = new URLSearchParams();
        params.append(
            'PointInfo',
            `${trajectoryPoint.rowKey}_${trajectoryPoint.latitude}_${trajectoryPoint.longitude}`
        );
        params.append('seqNum', 0);
        const response = await this.axiosInstance.get('photos/queryOnePhotosBypoint', { params: params });
        return response.data;
        // return mockData.trajectoryListSuccess;
    }
}

const service = new Service();
export default service;

