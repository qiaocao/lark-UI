import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import chat from './modules/chat'
import talk from './modules/talk'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    chat,
    talk
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
