import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'http://127.0.0.1:8000', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let jwtToken = getToken()
    if (jwtToken) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation

      // config.headers['X-Token'] = getToken()
      config.headers.Authorization = `JWT ${jwtToken}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response
  },
  error => {
    let res = error.response
    if (res !== undefined) {
      switch (res.status) {
        case 401:
        // 返回 401 清除token信息并跳转到登录页面
          MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
          console.log('未登录 或者token过期')
          break
        case 403:
          Message({
            message: '您没有该操作权限',
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 400:
          Message({
            message: res.data,
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 500:
          Message({
            message: '服务器错误',
            type: 'error',
            duration: 5 * 1000
          })
          break
      }
    }
    //   return Promise.reject(error.response.data) // 返回接口返回的错误信息
    return Promise.reject(error)
  }
)

export default service
