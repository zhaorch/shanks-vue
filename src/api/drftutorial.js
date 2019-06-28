import request from '@/utils/request'
// let localHost = 'http://127.0.0.1:8000'

export function apiGetGradeList (params) {
  return request({
    url: `/api/grades/`,
    method: 'get',
    params
  })
}

export function apiCreateGrade (data) {
  return request({
    url: `/api/grades/`,
    method: 'post',
    data
  })
}

export function apiUpdateGrade (data) {
  return request({
    url: `/api/grades/${data.id}/`,
    method: 'patch',
    data
  })
}

export function apiDeleteApp (id) {
  return request({
    url: `/apps/${id}/`,
    method: 'delete'
  })
}
