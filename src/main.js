import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 即可  默认会去加载索引文件  index.js index.vue index.json
// 在vue-cli创建的项目中  @的前缀 代表的是根路径 src目录
import router from '@/router'

import axios from '@/api/axios'

import components from '@/components'

// 引入全局样式
import '@/styles/index.less'

Vue.use(components)

Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

// 职责1：依赖项目需要的资源（js模块 css资源 ...）
// 职责2：实例化根实例  render() 渲染APP组件   然后挂载到#app的容器内
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
