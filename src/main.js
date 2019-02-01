import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'

import VueCodemirror from 'vue-codemirror'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'

Vue.use(VueCodemirror)

// 引入 element-ui.
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/global.css';
import ElementUI from 'element-ui';
Vue.use(ElementUI)


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
