const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  multiTab: state => state.app.multiTab,

  token: state => state.user.token,
<<<<<<< HEAD
  avatar: state => state.user.avatar,
  nickname: state => state.user.name, // 用户
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  userId: state => state.user.info.pid, // 身份证
=======
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  /** 用户身份证号 */
  userId: state => state.user.info.pId,
  /** 用户头像 */
  avatar: state => state.user.avatar,
  /** 用户名 */
  nickname: state => state.user.name,
  /** 用户密级 */
>>>>>>> e9145ba911fbb4f691464f4ee45e52a132bd4595
  userSecretLevel: state => state.user.info.secretLevel,

  addRouters: state => state.permission.addRouters,

  /** websocket连接状态 */
  onlineState: state => state.talk.onlineState,
  showSearchContent: state => state.talk.showSearchContent,
  searchResultList: state => state.talk.searchResultList,
  searchGroupResultList: state => state.talk.searchGroupResultList,
  searchContactsResultList: state => state.talk.searchContactsResultList
}

export default getters
