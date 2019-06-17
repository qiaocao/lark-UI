/**
 * 研讨状态模块
 * @author jihainan
 */
import modules from './conf'
import router from '@/router'
import { getGroupList, getContactsTree, getRecentContacts, getTalkMap } from '@/api/talk'
import { Tweet, RecentContact } from '@/utils/talk'

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
    curMessageList: [],
    /** 草稿Map */
    draftMap: new Map(),

    // ***********************************
    // 是否显示搜索结果
    showSearchContent: null,
    searchResultList: [],
    searchGroupResultList: [],
    searchContactsResultList: []
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
    },
    /**
     * 更新draftMap
     * @param {Object} state talk状态
     * @param {Array} draft 赋值数组[id, message]
     */
    SET_DRAFT_MAP (state, draft) {
      state.draftMap.set(draft[0], draft[1])
    },

    // ***********************************
    SET_SHOW_SEARCH_CONTENT: function (state, showSearchContent) {
      state.showSearchContent = showSearchContent
    },
    SET_SEARCH_RESULT_LIST: function (state, searchResultList) {
      state.searchResultList = searchResultList
    },
    SET_SEARCH_GROUP_RESULT_LIST: function (state, searchGroupResultList) {
      state.searchGroupResultList = searchGroupResultList
    },
    SET_SEARCH_CONTACTS_RESULT_LIST: function (state, searchContactsResultList) {
      state.searchContactsResultList = searchContactsResultList
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
     * 更新最近联系人列表
     * @param {...Tweet.contactInfo, reOrder, addUnread} freshItem
     * { id, name, avatar, secretLevel, memberNum, isGroup, reOrder, addUnread }
     * reOrder: 重新排序
     * addUnread: 增加未读消息数量
     */
    UpdateRecentContacts ({ commit, state }, freshItem) {
      const recentContacts = state.recentContacts

      let oldItem = {}
      const newItem = new RecentContact(freshItem)
      const { lastMessage, time, atMe } = newItem

      const index = recentContacts.findIndex(element => element.id === newItem.id)
      if (index > -1) {
        oldItem = recentContacts[index]
        this._vm.$delete(recentContacts, index)
      }
      const TopNum = recentContacts.filter(element => element.isTop).length

      // 设置未读消息数
      if (freshItem.addUnread && router.currentRoute.query.id !== newItem.id) {
        newItem.unreadNum = oldItem.unreadNum + 1
      } else if (index > -1) {
        newItem.lastMessage = lastMessage || oldItem.lastMessage
        newItem.time = time || oldItem.time
        newItem.atMe = atMe || oldItem.atMe
        newItem.unreadNum = 0
        // TODO: 告知服务器消息的状态
        // ···
      }

      // 更新列表顺序
      if (freshItem.reOrder) {
        newItem.isTop
          ? recentContacts.unshift(newItem)
          : recentContacts.splice(TopNum, 0, newItem)
      } else {
        if (index > -1) {
          recentContacts.splice(index, 0, newItem)
        } else {
          newItem.isTop
            ? recentContacts.unshift(newItem)
            : recentContacts.splice(TopNum, 0, newItem)
        }
      }
      commit('SET_RECENT_CONTACTS', recentContacts)
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
    },
    /**
     * 更新缓存中的消息map
     * @param {Tweet} newMessage 新消息
     */
    UpdateTalkMap ({ state, commit }, newMessage) {
      const tempMessageList = state.talkMap.get(newMessage.contactInfo.id) || []
      tempMessageList.push(new Tweet(newMessage))
      commit('SET_TALK_MAP', [newMessage.contactInfo.id, tempMessageList])
    },
    /**
     * 更新缓存中的草稿信息
     * @param {Array} draft 草稿信息[id, message]
     */
    UpdateDraftMap ({ state, commit }, draft) {
      return new Promise((resolve) => {
        if (draft[0]) commit('SET_DRAFT_MAP', draft)
        resolve(draft)
      }).catch(error => {
        throw (error)
      })
    }
  },
  modules,
  strict: process.env.NODE_ENV !== 'production'
}

export default talk
