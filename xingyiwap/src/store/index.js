import Vue from 'vue'  // 引用vue
import Vuex from 'vuex'  // 引用vuex

// modules
import vuex from './vuex'

Vue.use(Vuex)  // 安装vuex

// 暴露vuex（返回定义好的模块）

export default new Vuex.Store({
  modules: {
    vuex
  }
})

