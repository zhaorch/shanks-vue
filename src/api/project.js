import request from '@/utils/request'
let localHost = 'http://127.0.0.1:8000'

export function getAppList (params) {
  return request({
    url: `${localHost}/apps/`,
    method: 'get',
    params
  })
}
