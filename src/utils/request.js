// @ts-nocheck
/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import {extend} from 'umi-request';
import {notification} from 'antd';
import * as cache from "./cache";

import {history} from 'umi';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '当前用户权限不够，无法操作此功能。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请联系管理员。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  console.log(34, 'error', error)
  const {response = {}} = error;
  if (!response) {
    if (error) {
      return;
    }
    notification.error({
      message: '请求错误 ',
      description: '请求未响应',
    });
    return;
  }
  const errorText = codeMessage[response.status] || response.statusText;
  const {status, url} = response;

  if (status === 400) {
    notification.error({
      message: `请求提示 ${status}:`,
      description: errorText,
    });
    return;
  }
  if (status === 401) {
    history.push("/login");
    return;
  }
  // environment should not be used
  if (status === 403) {
    notification.error({
      message: `操作未授权 ${status}: `,
      description: errorText,
    });
    return;
  }
  if (status <= 504 && status >= 500) {
    notification.error({
      message: `请求提示 ${status}: `,
      description: errorText,
    });
    return;
  }
  if (status >= 404 && status < 422) {
    notification.error({
      message: `请求提示 ${status}:`,
      description: errorText,
    });
  }

};

export const BASE_URL = window._env_.API_URL || API_URL;

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: BASE_URL,
  errorHandler, // 默认错误处理
});


request.interceptors.request.use((url, options) => {
  if (url.indexOf('/oauth/token') < 0) {
    const authorization = cache.getItem('Authorization');
    if (authorization) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${authorization}`
      }
      return (
        {
          options: {
            ...options,
            interceptors: true,
          },
        }
      );
    }
  } else {
    options.headers = {
      ...options.headers,
      'Authorization': 'Basic Y2xpZW50MjoxMjM0NTY='
    }
    return (
      {
        options: {
          ...options,
          interceptors: true,
        },
      }
    );
  }
  return (
    {
      options: {
        ...options,
        interceptors: true,
      },
    }
  );
});


// clone response in response interceptor
request.interceptors.response.use(async (response, options) => {
  if (options.responseType === 'blob') {
    return response;
  }
  const data = await response.clone().json();
  if (data) {
    const {code, msg} = data;
    if (code && code !== 200) {
      const errorText = msg || codeMessage[code];
      notification.error({
        message: `请求提示 ${code}:`,
        description: errorText,
      });
    }
  }
  return response;
});


export default request;
