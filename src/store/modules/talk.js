// 研讨状态模块

const talk = {
  state: {
    /** 用户的在线状态
     * 0-离线，1-重连，2-在线
     */
    onlineState: 0,
    /** 最新联系人列表 */
    recentContacts: [],
    /** 群组列表 */
    groupList: [],
    /** 联系人树 */
    contactsTree: [],
    /** 存储研讨消息的Map */
    talkMap: new Map()
  },

  mutations: {
    SET_ONLINE_STATE (onlineState) {
      this.onlineState = onlineState
    },
    SET_RECENT_CONTACTS (recentContacts) {
      this.recentContacts = recentContacts
    },
    SET_GROUP_LIST (groupList) {
      this.groupList = groupList
    },
    SET_CONTACTS_TREE (contactsTree) {
      this.contactsTree = contactsTree
    },
    SET_TALK_MAP (talkMap) {
      this.talkMap = talkMap
    }
  },

  actions: {}
}

export default talk
