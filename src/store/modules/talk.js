/**
 * 研讨状态模块
 * @author jihainan
 */
import modules from './conf'
import { getGroupList, getContactsTree, getRecentContacts, getTalkMap } from '@/api/chat'

const talk = {
  state: {
    /** 用户的在线状态
     *  0-离线，1-重连，2-在线
     */
    onlineState: 3,
    /** 最新联系人列表 */
    recentContacts: [],
    /** 群组列表 */
    groupList: [],
    /** 联系人树 */
    contactsTree: [],
    /** 存储研讨消息的Map */
    talkMap: new Map(),
    /** 当前正在进行的研讨 */
    currentTalk: {},
    /** 当前正在进行研讨的消息列表 */
    curMessageList: []
  },

  mutations: {
    SET_ONLINE_STATE (state, onlineState) {
      state.onlineState = onlineState
    },
    SET_RECENT_CONTACTS (state, recentContacts) {
      state.recentContacts = recentContacts
    },
    SET_GROUP_LIST (state, groupList) {
      state.groupList = groupList
    },
    SET_CONTACTS_TREE (state, contactsTree) {
      state.contactsTree = contactsTree
    },
    /**
     * 更新talkMap
     * @param {Object} state talk状态
     * @param {Array} talkMapList 赋值数组
     */
    SET_TALK_MAP (state, talkMapList) {
      talkMapList.forEach(function (item) {
        state.talkMap.set(item[0], item[1])
      })
    },
    SET_CURRENT_TALK (state, currentTalk) {
      state.currentTalk = currentTalk
    },
    SET_CUR_MESSAGE_LIST (state, curMessageList) {
      state.curMessageList = curMessageList
    }
  },

  actions: {
    /**
     * 获取群组列表
     */
    GetGroupList ({ commit }) {
      return new Promise((resolve, reject) => {
        getGroupList().then(response => {
          if (response.status === 200) {
            commit('SET_GROUP_LIST', [ ...response.result.data ])
          } else {
            reject(new Error('getGroupList: 服务器发生错误!'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取联系人树
     */
    GetContactsTree ({ commit }) {
      return new Promise((resolve, reject) => {
        getContactsTree().then(response => {
          if (response.status === 200) {
            commit('SET_CONTACTS_TREE', [ ...response.result.data ])
          } else {
            reject(new Error('getContactsTree: 服务器发生错误!'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取最近联系人列表(用于初始化最近联系人列表)
     */
    GetRecentContacts ({ commit }) {
      return new Promise((resolve, reject) => {
        getRecentContacts().then(response => {
          if (response.status === 200) {
            commit('SET_RECENT_CONTACTS', [ ...response.result.data ])
          } else {
            reject(new Error('getRecentContacts: 服务器发生错误'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 跟新最近联系人列表
     * @param {*} freshItem 更新的项，结构同最近联系人项
     */
    UpdateRecentContacts ({ commit, state }, freshItem) {
      // TODO: 写处理逻辑
      // ···
    },
    /**
     * 获取所有未读消息的map(初始化缓存中的消息列表)
     */
    GetTalkMap ({ commit }) {
      return new Promise((resolve, reject) => {
        getTalkMap().then(response => {
          if (response.status === 200) {
            commit('SET_TALK_MAP', [ ...response.result.data ])
          } else {
            reject(new Error('getTalkMap: 服务器发生错误'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
}

export default talk
