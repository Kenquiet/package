/**
 * 需要用到几个库
 * 1. axios ==> cnpm install axios --save
 * 2. vant ==>  cnpm install vant --save
 * 3. qs ==> cnpm install qs --save
 */

import axios from 'axios'
import QS from 'qs'  // 引用qs 主要是为序列化 post 请求时对参数的序列化
import { Toast } from 'vant'  //使用的是vant 移动端轻量级的库

import store from '@/store/index';


/**
* 开发环境和生产环境的判断
* 当然如果在 vue-cli3.x版本设置了跨域代理，那么
* http://127.0.0.1 可以变成 /api
*/
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://127.0.0.1'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://prod.xxx.xxx'
}

/* 设置请求头和设置超时时间 */
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

/**
 * 可以设置请求拦截，比如请求时带上token
 */
axios.interceptors.request.use(
  config => {
    // 请求前判断token是否存在
    // 存在了，则统一在 http 请求 header 头部加上token，这样后台根据token判断登录情况
    const token = window.localStorage.token || store.state.token;
    token && (config.headers.Authorization = token);
    return config
  },
  error => {
    return Promise.error(error)
  }
);

/**
 * 1.响应拦截，这里响应拦截的话主要是对后端返回的
 * 2.状态码进行判断，看看是否登录或者token是否过期
 * 3.对请求错误里面封装了几个常见的状态码，可以根据项目需求进行添加
 */
axios.interceptors.response.use(response => {
  // 如果返回状态码为 200 说明请求数据成功，否则失败
  if (response.status === 200) {
    if (response.data.code === 511) {
      //接口为授权,这里需要用到提示插件
    }else if (response.data.code === 510) {
      // 未登录需要进行页面跳转到 login 页面
    }else {
      return Promise.resolve(response);
    }
  }else {
    return Promise.reject(response);
  }
}, error => {
  if (error.response.status) {
    switch (error.response.status) {
      // 401: 未登录
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        });
        break;

      // 403 token过期
      // 登录过期对用户进行提示
      // 清除本地token和清空vuex中token对象
      // 跳转登录页面
      case 403:
        Toast({
          message: '登录过期，请重新登录',
          duration: 1000,
          forbidClick: true
        });
        // 清除token
        localStorage.removeItem('token');
        store.commit('loginSuccess', null);
        // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        setTimeout(() => {
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
        }, 1000);
        break;

      // 404请求不存在
      case 404:
        Toast({
          message: '网络请求不存在',
          duration: 1500,
          forbidClick: true
        });
        break;
      // 其他错误，直接抛出错误提示
      default:
        Toast({
          message: error.response.data.message,
          duration: 1500,
          forbidClick: true
        });
    }
    return Promise.reject(error.response);
  }
});



/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){
  return new Promise((resolve, reject) =>{
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data);
    }).catch(err =>{
      reject(err.data)
    })
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err =>{
        reject(err.data)
      })
  });
}
