const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  multiTab: state => state.app.multiTab,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name, // 用户
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  userId: state => state.user.info.pid, // 身份证
  userSecretLevel: state => state.user.info.secretLevel,

  addRouters: state => state.permission.addRouters,

  showSearchContent: state => state.talk.showSearchContent,
  searchResultList: state => state.talk.searchResultList,
  searchGroupResultList: state => state.talk.searchGroupResultList,
  searchContactsResultList: state => state.talk.searchContactsResultList,
  onlineState: state => state.talk.onlineState
}

export default getters
