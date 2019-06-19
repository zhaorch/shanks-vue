import request from '@/utils/request'
import axios from 'axios'
let localHost = 'http://127.0.0.1:8000'

export function login (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// post请求参数放在data里面，get请求参数放在params里
export const login2 = data => {
  // return axios.post(`${localHost}/login/`, params)
  return request({
    url: `${localHost}/login/`,
    method: 'post',
    data
  })
}
export const getInfo2 = () => {
  // return axios.get(`${localHost}/users/0/userInfo/`, params)
  return request({
    url: `${localHost}/users/0/userInfo/`,
    method: 'get'
  })
}

export const getGoodsList2 = () => {
  return axios.get(`${localHost}/goods/`)
}

export const getGoodsList = () => {
  return request({
    url: `${localHost}/goods/`,
    method: 'get'
  })
}

export function getUserList (params) {
  return request({
    url: `${localHost}/users/`,
    method: 'get',
    params
  })
}

export function fetchPv (params) {
  return request({
    url: `${localHost}/users/`,
    method: 'get',
    params
  })
}
export function createUser (data) {
  return request({
    url: `${localHost}/users/`,
    method: 'post',
    data
  })
}
export function updateUser (data) {
  return request({
    url: `${localHost}/users/${data.id}/`,
    method: 'patch',
    data
  })
}
export function deleteUser (id) {
  return request({
    url: `${localHost}/users/${id}/`,
    method: 'delete'
  })
}

export function resetUserPwd (id) {
  return request({
    url: `${localHost}/users/${id}/reset_pwd/`,
    method: 'post'
  })
}
