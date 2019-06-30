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

export function apiDeleteGrade (id) {
  return request({
    url: `/api/grades/${id}/`,
    method: 'delete'
  })
}

// -------------------------------------------------------
export function apiGetStudentList (params) {
  return request({
    url: `/api/students/`,
    method: 'get',
    params
  })
}

export function apiCreateStudent (data) {
  return request({
    url: `/api/students/`,
    method: 'post',
    data
  })
}

export function apiUpdateStudent (data) {
  return request({
    url: `/api/students/${data.id}/`,
    method: 'patch',
    data
  })
}

export function apiDeleteStudent (id) {
  return request({
    url: `/api/students/${id}/`,
    method: 'delete'
  })
}

// -------------------------------------------------------
export function apiGetCourseList (params) {
  return request({
    url: `/api/courses/`,
    method: 'get',
    params
  })
}

export function apiCreateCourse (data) {
  return request({
    url: `/api/courses/`,
    method: 'post',
    data
  })
}

export function apiUpdateCourse (data) {
  return request({
    url: `/api/courses/${data.id}/`,
    method: 'patch',
    data
  })
}

export function apiDeleteCourse (id) {
  return request({
    url: `/api/courses/${id}/`,
    method: 'delete'
  })
}
