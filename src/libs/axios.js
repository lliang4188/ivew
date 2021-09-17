import axios from 'axios'
// import store from '@/store'
import publicConfig from '@/config'
import errorHandle from './errorHandle'
// import { Spin } from 'view-design'
import { getToken } from '@/libs/util'
const CancelToken = axios.CancelToken

class HttpRequest {
  constructor (baseURL) {
    this.baseURL = baseURL
    this.pending = {}
  }

  // 获取 axios 配置
  getInsideConfig () {
    const config = {
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: 10000
    }
    return config
  }

  removePending (key, isRequest = false) {
    if (this.pending[key] && isRequest) {
      this.pending[key]('取消重复的请求')
    }
    delete this.pending[key]
  }

  // 设定拦截器
  interceptors (instance) {
    // 请求拦截器
    instance.interceptors.request.use((config) => {
      let isPublic = false
      publicConfig.publicPath.map((path) => {
        isPublic = isPublic || path.test(config.url)
      })
      const token = getToken()
      if (!isPublic && token) {
        config.headers.Authorization = 'Bearer ' + token
      }
      // Do something before request is sent
      const key = config.url + '&' + config.method
      this.removePending(key, true)
      config.cancelToken = new CancelToken((c) => {
        this.pending[key] = c
      })
      // console.log('config' + config)
      return config
    },
    err => {
      errorHandle(err)
      // Do something with request error
      return Promise.reject(err)
    }
    )

    // 响应请求拦截器
    instance.interceptors.response.use(
      res => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        // console.log('res is: ' + res)
        const key = res.config.url + '&' + res.config.method
        this.removePending(key)
        if (res.status === 200) {
          return Promise.resolve(res.data)
        } else {
          return Promise.reject(res)
        }
      },
      err => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // debugger
        errorHandle(err)
        return Promise.reject(err)
      }
    )
  }

  // 创建实例
  request (options) {
    const instance = axios.create()
    const newOptions = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance)
    return instance(newOptions)
  }

  get (url, config) {
    const options = Object.assign(
      {
        method: 'get',
        url: url
      },
      config
    )
    return this.request(options)
  }

  post (url, data) {
    return this.request({
      method: 'post',
      url: url,
      data: data
    })
  }
}

export default HttpRequest
