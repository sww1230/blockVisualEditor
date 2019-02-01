import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import moduleList from "./modules";
export default new Vuex.Store({
  modules: moduleList
})