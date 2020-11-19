/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import {extend} from 'umi-request';
import {notification} from 'antd';
import * as cache from "./cache";
import {createHashHistory} from 'history';
// const history = createBrowserHistory() // history模式
const history = createHashHistory() // hash模式

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
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
    const {response = {}} = error;
    if (!response) {
        notification.error({
            message: '请求错误 ',
            description: '请求未响应',
        });
        return;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    const {status, url} = response;

    if (status === 400) {
        notification.error({
            message: `请求错误 ${status}: ${url}`,
            description: errortext,
        });
        return;
    }
    if (status === 401) {
        notification.error({
            message: '未登录或登录已过期，请重新登录。',
        });
        history.push("/login");
        return;
    }
    // environment should not be used
    if (status === 403) {
        notification.error({
            message: `请求错误 ${status}: ${url}`,
            description: errortext,
        });
        return;
    }
    if (status <= 504 && status >= 500) {
        notification.error({
            message: `请求错误 ${status}: ${url}`,
            description: errortext,
        });
        return;
    }
    if (status >= 404 && status < 422) {
        notification.error({
            message: `请求错误 ${status}: ${url}`,
            description: errortext,
        });
    }

};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
    prefix: 'http://www.java2e.com/erd',
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
            'Authorization': 'Basic Y2xpZW50MToxMjM0NTY='
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
request.interceptors.response.use(async (response) => {
    const data = await response.clone().json();
    if (data && data.code !== 200) {
        const errorText = codeMessage[data.code] || data.msg;
        const {code} = data;
        if (code) {
            if (code === 401) {

            }
            notification.error({
                message: `响应错误 ${code}`,
                description: errorText,
            });
        }
    }
    return response;
});


export default request;
