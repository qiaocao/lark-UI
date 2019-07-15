import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import {
  VueAxios
} from '@/utils/request' // axios 不建议引入到 Vue 原型链上

import './core/use'
import bootstrap from './core/bootstrap'
import '@/permission' // permission control
import '@/utils/filter'
import wysiwyg from 'vue-wysiwyg'

// 定义全局变量 SocketGlobal
import {
  SocketApi
} from '@/utils/talk' // global filter
import { WS_SERVER_IP } from '@/utils/constants'

Vue.config.productionTip = false
Vue.use(VueAxios, router)
Vue.use(wysiwyg, {
  hideModules: {
    'bold': true,
    'italic': true,
    'underline': true,
    'justifyLeft': true,
    'justifyCenter': true,
    'justifyRight': true,
    'headings': true,
    'link': true,
    'code': true,
    'orderedList': true,
    'unorderedList': true,
    'image': true,
    'table': true,
    'removeFormat': true,
    'separator': true
  }
})
Vue.prototype.publicPath = process.env.BASE_URL
Vue.prototype.SocketGlobal = new SocketApi({
<<<<<<< HEAD
  ip: '10.11.24.136',
=======
  ip: WS_SERVER_IP,
>>>>>>> 299ed789782302091a0c72861c0aa939e9ea576f
  port: '9326'
})

new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
