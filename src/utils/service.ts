// 这里是封装了一些Axios的功能
// 便于以后拓展
import axios from "axios";

// 新建一个Axios对象
const axiosInstance = axios.create({
    baseURL: '/api'
})
//请求拦截
axiosInstance.interceptors.request.use(config => {
    // 在这里添加对应的逻辑,例如一些筛选工作
    // console.log(config)
    // return,就是放行，否则就一直拦截
    return config
}, err => {
    console.log(err)
})
//响应拦截
axiosInstance.interceptors.response.use(config => {
    return config
}, err => {
    console.log(err.response.status)
    switch(err.response.status){
        case 404:
            console.log('请求连接有问题')
        //500 302 300
    }

})

//对外的公开方法
function requestFn(_config: { url: any; data: any; method: any; }) {
    let {url,data,method}=_config;
    url=url||'';
    data=data||{}
    method=method||'get'

    switch(method){
        case 'get':
            return axiosInstance.get(url,{params:data})
        case 'post':
            // return post内容 
            return axiosInstance.post(url,{params:data})
        default:
            //默认情况
        }
}
export default requestFn;