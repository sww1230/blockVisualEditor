import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'

// 引入 element-ui.
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/global.css';
import '@/assets/style.css';
const data = require('./config.json')
import ElementUI from 'element-ui';
Vue.use(ElementUI)


Vue.config.productionTip = false
App.data = () => {
  return {
    projectData: data
  }
}
new Vue({
  router,
  store,
  render: h => h(App, {
    class: 'fixed pin'
  })
}).$mount('#app')
