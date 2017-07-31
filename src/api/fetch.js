import axios from 'axios';
import { Message } from 'element-ui';

// 创建axios实例
const service = axios.create({
    timeout: 5000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    // if (store.getters.token) {
    //     config.headers['X-Token'] = getToken(); // 让每个请求携带token--['X-Token']为自定义key
    // }
    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code !== 200) {
            if (res.code == 500) {
                Message({
                    message: res.errmsg,
                    type: 'error',
                    duration: 3 * 1000
                });
            }
            return Promise.reject(res);
        } else {
            return res.data;
        }
    },
    error => {
        console.log('err' + error); // for debug
        //console.log(error.response);
        Message({
            message: '网络超时',
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
)

export default service;