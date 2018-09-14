import axios from 'axios'
import store from '@/store/index'
import { url } from "api/url-config"
const instance = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});


instance.interceptors.request.use(function(config) {
    // Do something before request is sent
    const token = sessionStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    config.headers['Content-Type'] = 'application/json'
    return config;
}, function(error) {
    // Do something with request error
    return Promise.reject(error);
});

instance.interceptors.response.use(function(response) {
    // Do something with response data

    if (response.data.code == 20001) {
        sessionStorage.token = '';
        // store.commit('setToken', '');
        $vm.$router.push('/')
        $vm.$message({
            message: '登录已过期，请重新登录！',
            type: 'warning'
        })

    }
    return response;
}, function(error) {
    // Do something with response error
    // if (error && error.response == 408) {
    // $vm.$message.error(error.response || '请求超时')
    // }
    return Promise.reject(error.response);
});

export default instance