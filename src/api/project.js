import request from '@/utils/request'
let localHost = 'http://127.0.0.1:8000'

export function getAppList (params) {
  return request({
    url: `${localHost}/apps/`,
    method: 'get',
    params
  })
}

export function apiCreateApp (data) {
  return request({
    url: `${localHost}/apps/`,
    method: 'post',
    data
  })
}

export function apiUpdateApp (data) {
  return request({
    url: `${localHost}/apps/${data.id}/`,
    method: 'patch',
    data
  })
}

export function apiDeleteApp (id) {
  return request({
    url: `${localHost}/apps/${id}/`,
    method: 'delete'
  })
}
