import axios from 'axios'

let apiBaseUrl = 'https://mock.vlice.cn/mock/5f89b3b86b5e9de75c10006f/pdman-web'
const service = axios.create({
    baseURL: apiBaseUrl
})

const err = (error) => {
    if (error.response) {
        let data = error.response.data
        console.group("异常响应")
        switch (error.response.status) {
            case 403:
                console.log({responseCode: 403, description: '拒绝访问'})
                break
            case 500:
                console.log({responseCode: 500, description: '服务器出现异常'})
                break
            case 404:
                console.log({responseCode: 404, description: '很抱歉，资源未找到'})
                break
            case 504:
                console.log({responseCode: 504, description: '网络超时'})
                break
            default:
                console.log({responseCode: error.response.status, data})
                break
        }
        console.groupEnd()
    }
    return Promise.reject(error)
};

// 发送请求前的处理，可以数据签名啥的
service.interceptors.request.use(config => {
    // config.headers[ 'App-Token' ] = 'asd'
    return config
}, (error) => {
    return Promise.reject(error)
})

// 接收到请求后的第一步操作，可以签名校验啥的
service.interceptors.response.use((response) => {
    return response.data
}, err)

export {
    service as axios
}