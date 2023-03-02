import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const axiosIns = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

//请求拦截
axiosIns.interceptors.request.use(config => {
  // 如果有一个接口需要认证才可以访问，就在这统一设置
  const token = window.localStorage.getItem('accessToken')

  if (token) {
    config.headers['token'] = token
  }

  // 放行
  return config
}, err => {
  console.log(err)
})

//响应拦截
axiosIns.interceptors.response.use(res => {
  //对于需要授权的请求接口，还未授权则统一去登录页面授权
  //"401" 即未授权，需要请求要求身份验证
  if (res.data.code == 401) {
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    location.href = '/login'
  }
  return res ? res.data : res
})
export default axiosIns
