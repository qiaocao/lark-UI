import { axios } from '@/utils/request'

const api = {
  talkMembers: 'chat/members',
  groupInfo: 'chat/group/info',
  groupList: 'chat/zzGroup/queryGroupListByUserId',
  contactsInfo: 'admin/user/',
  contactsTree: 'admin/org/orgUsers',
  recentContacts: 'chat/recent/list',
  talkMap: 'chat/message/map',
  talkHistory: 'chat/history',
  upload: 'chat/zzFileManage/singleFileUpload'
}

export default api

/**
 * 获取当前研讨中的成员
 * @param {String} contactId
 */
export function getTalkMembers (contactId) {
  return axios({
    url: api.talkMembers,
    method: 'get',
    params: {
      contactId: contactId
    }
  })
}

/**
 * 通过群组id获取群组详细信息
 * @param {String} groupId 群组id
 */
export function getGroupInfo (groupId) {
  return axios({
    url: api.groupInfo,
    method: 'GET',
    params: {
      groupId: groupId
    }
  })
}

/**
 * 通过联系人id获取联系人详细信息
 * @param {String} contactsId 联系人id
 */
export function getContactsInfo (id) {
  return axios({
    url: api.contactsInfo + id,
    method: 'GET'
  })
}

/**
 * 获取群组列表
 * @param {String} userId 当前用户id
 */
export function getGroupList (userId) {
  return axios({
    url: api.groupList,
    method: 'GET',
    params: {
      userId: userId
    }
  })
}

/**
 * 获取联系人树
 */
export function getContactsTree () {
  return axios({
    url: api.contactsTree,
    method: 'GET',
    params: { parentTreeId: 'root' }
  })
}

/**
 * 获取最近联系人列表
 * @param {String} userId 当前用户id
 */
export function getRecentContacts (userId) {
  return axios({
    url: api.recentContacts,
    method: 'GET',
    params: {
      userId: userId
    }
  })
}

/**
 * 获取未读消息
 * @param {String} userId 当前用户id
 */
export function getTalkMap (userId) {
  return axios({
    url: api.talkMap,
    method: 'GET',
    params: {
      userId: userId
    }
  })
}

/**
 * 获取指定联系人的研讨记录
 * @param {String} userId 当前用户id
 * @param {String} contactId 指定联系人id
 */
export function getTalkHistory (userId, contactId) {
  return axios({
    url: api.talkHistory,
    method: 'GET',
    params: {
      userId: userId,
      contactId: contactId
    }
  })
}

/**
 * 文件上传
 */
export function uploadFile (parameter) {
  return axios({
    url: api.upload,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
