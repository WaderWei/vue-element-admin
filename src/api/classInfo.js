import request from '@/utils/request'

export function findClassInfos(id) {
  return request({
    url: '/classInfo/get/' + id,
    method: 'get'
  })
}
export function findUsersByClassId(classId) {
  return request({
    url: '/classAssign/' + classId,
    method: 'get'
  })
}

export function updateClassInfo(classId) {
  return request({
    url: '/classInfo/updateClassInfo',
    method: 'post',
    params: {
      id: classId
    }
  })
}

export function deleteUser(classId, userId) {
  return request({
    url: '/classAssign/delete',
    method: 'delete',
    params: {
      classId: classId,
      userId: userId
    }
  })
}
