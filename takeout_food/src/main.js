import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import {
  Button
} from 'mint-ui'
import './mock/mockServer'
Vue.component(Button.name, Button)
Vue.config.productionTip = false
Vue.prototype.$http = axios // 将ajax请求挂在到vue原形上
// 默认请求地址
axios.defaults.baseURL = '/'
axios.defaults.withCredentials = true
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
