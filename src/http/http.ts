import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';

import qs from 'qs';
import { StoreTypes } from '/@store/types';
import { getStorage } from '/@utils/utils';

const axiosInit = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? (location.origin.includes('uat.heybooks.net') ? 'https://dev.heybooks.net/front' : 'https://api.heybooks.net/front')  : '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    
    withCredentials: process.env.NODE_ENV === 'production' ? false : true
});

axiosInit.interceptors.request.use((config: AxiosRequestConfig) => {
    const _token = !!getStorage(StoreTypes.TOKEN);
    if(_token) {
        config.headers['token'] = getStorage(StoreTypes.TOKEN);
    }
    return config;
}, err => {
    Promise.reject(err);
});

axiosInit.interceptors.response.use(config => {
    switch (config.data.code) {
        case 0:
            return config.data.data ?? { code: 200 };
        default:
            message.error(config.data.message);
            return config.data;
    }
}, (err) => {
    console.log(err.response.status, 'ttt');
    switch (err.response.status) {
        case 401:
            setTimeout(() => {
                // const _href = ( process.env.NODE_ENV !== "production" ? location.origin + '/#/login' : location.origin + "/app_h5/index.html#/login");
                // location.href = _href;
            }, 1200);
            localStorage.removeItem(StoreTypes.TOKEN);
            break;
        default:
            break;
    }
    return Promise.reject(err);
});


/**
 * 请求
 * @param {string} url 
 * @param {object} params 
 */
export const get = (url:string, params = {}): Promise<any> => axiosInit({ url, params, method: 'GET' }) ;

export const post = (url:string, data = {}): Promise<any> => axiosInit({ url, data: qs.stringify(data), method: "POST" }) ;

export const put = (url:string, data = {}): Promise<any> => axiosInit({url, data: qs.stringify(data), method: "PUT"});

export const dele = (url:string, data = {}): Promise<any> => axiosInit({ url, data, method: "DELETE" });

/**
 * 上传图片
 * @param {string} param0  地址
 * @param {object} param1  请求头
 * @param {File}   param2  上传内容
 */
export const uploadFile  = ({ uploadUrl, headers, file }: {
    uploadUrl:string, headers: {
        Authorization: string,
        'x-oss-Date': string,
        'Content-Type':string
    }, file: File
}) => axios({
    method: 'PUT',
    url: uploadUrl,
    withCredentials: false,
    headers: {
        Authorization: headers.Authorization,
        'x-oss-Date': headers['x-oss-Date'],
        'Content-Type': headers['Content-Type']
    },
    data: file
})