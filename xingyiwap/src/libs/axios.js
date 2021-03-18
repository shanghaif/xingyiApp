import axios from "axios"
import Router from '@/router/index'

// 10秒钟超时
const timeout = 10000

// 设置请求服务ip
// const baseUrl = "http://192.168.171.42:30233"
// const baseUrl = "http://222.244.144.69:30233"
const baseUrl = "http://10.48.12.4:30233"

const baseUrl1 = "http://10.48.12.4:21008"

// 获取本地token
// const token   = localStorage.getItem("token")


// 实例化axios
const serve   = axios.create({
  baseURL: baseUrl,
  timeout: timeout,
  //withCredentials: true
})

// 请求拦截器
serve.interceptors.request.use(
  config => {
      let token = localStorage.getItem("token")
      if( !token ) {
        if( Router.currentRoute.path !== "/login" ) {
          Router.push({path: "/login"})
        }
      }
      if( config.url.indexOf("/identify") !== -1 ) {
        config.baseURL = baseUrl1
      }
      // if( token ) {
      //   // 带token请求数据
      //   config.headers['Authorization'] = `Bearer ${token}`;
      // } else {
      //   if( Router.currentRoute.path !== "/login" ) {
      //     Router.push({path: "/login"})
      //   }
      // }
      // console.log(config,"params")
      if( config.params && config.params.code && ( !config.params.codeType || config.params.codeType != "station" ) && config.url != "/AirApp-Service/map/StationCodeData"  && config.url != "http://192.168.171.42:30133//AirApp-Service/map/getTimeHeatMap" ) {
        config.params.code = "001"
      }
      return config
  }, error => {
      return Promise.reject(error);
  }
)

// 响应拦截器
serve.interceptors.response.use(
  response=>{
    if( response.data.code == 2 ) {  // 无效token，重新登录
      Router.push({path: "/login"})
    }

    return Promise.resolve(response)
  }, error => {
    if (error.response) {
      console.error(error)
    }
    return Promise.reject(error)
  }
)

export default serve
