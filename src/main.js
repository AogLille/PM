import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/top.css'

// require('./mock/mock') //引入mock数据，关闭则注释该行

//导入axios
import axios from 'axios'
//全局配置axios
axios.defaults.baseURL = '/planAddPage'//配置接口基址
// axios.defaults.baseURL = '/template'//配置接口基址
// axios.defaults.baseURL = 'http://192.168.43.145:8888'//配置接口基址
Vue.prototype.$http = axios
Vue.prototype.$axios = axios


// 声明请求拦截器
// let loadingInstance = null
// axios.interceptors.request.use(config => {
//   // 展示loading效果
//   loadingInstance = Loading.service({ fullscreen: true })
//   return config
// })

// // 声明响应拦截器
// axios.interceptors.response.use(response => {
//   // 隐藏loading效果
//   loadingInstance.close()
//   return response
// })

router.beforeEach((to, from, next) => {
  //debugger
  if (to.meta.requireAuth) {
    if (store.state.user.username) {
      next()
    } else {
      next({
        path: 'login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
}
)



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
