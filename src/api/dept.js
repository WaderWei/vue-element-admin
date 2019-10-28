import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/dept/',
    method: 'get'
  })
}
