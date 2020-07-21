import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import './styles/index.scss'

// admin-base-frame 自定义组件
import AbLayout from './components/layout/index.js'
import AbDialog from './components/dialog/index.js'
import AbFilter from './components/filter/index.js'
import AbPageTable from './components/page-table/index.js'
import AbForm from './components/form/index.js'
import AbUpload from './components/upload/index.js'

import routerInstance, { resetRouter } from './router'
import { baseStore } from './store'
import * as utils from './utils'

import directives from './directive'
import prototype from './prototype'

const data = {
  el: '',
  routeMap: {},
  storeMap: {},
  App: null,
  otherArg: {},
  store: null
}

const components = [
  AbLayout,
  AbDialog,
  AbFilter,
  AbPageTable,
  AbForm,
  AbUpload
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

// 创建路由
const createRouter = async({ roles = [] }) => {
  const { store, routeMap } = data
  await store.dispatch('adminBaseFrame/permission/generateRoutes', { roles, routeMap })
  routerInstance.options.routes = store.getters.adminBaseFrame.permission.routes
  routerInstance.addRoutes(store.getters.adminBaseFrame.permission.addRoutes)
}

function initData({ el, routeMap, storeMap, App, otherArg }) {
  data.el = el
  data.routeMap = routeMap
  data.storeMap = storeMap
  data.App = App
  data.otherArg = otherArg
}

function initVuePlugin() {
  Vue.use(ElementUI)
  Vue.use(Vuex)
  Vue.use(directives)
  Vue.use(prototype)
  install(Vue)
}

function initStore() {
  const newStore = utils.mixin(data.storeMap, baseStore)
  const storeInstance = new Vuex.Store(newStore)
  data.store = storeInstance
  if (!Vue.$store) {
    Vue.prototype.$store = storeInstance
  }
}

function initRoute() {
  const { routerArg = {}} = data.otherArg
  routerInstance.beforeEach(routerArg.beforeEach)
  routerInstance.afterEach(routerArg.afterEach)
}

// 暴露给外接应用的全局对象
function initWinAdminBaseFrameData() {
  window.ADMIN_BASE_FRAME = {
    createRouter,
    version: '1.0.0',
    store: data.store,
    setUserInfo({ name, avatar }) {
      data.store.dispatch('adminBaseFrame/user/setUserInfo', { name, avatar })
    },
    resetRouter() {
      resetRouter()
      data.store.dispatch('adminBaseFrame/tagsView/delAllViews', null, { root: true })
    },
    setLastVisitedView(path) {
      data.store.dispatch('adminBaseFrame/app/setLastVisitedView', path)
    }
  }
}

function initVue() {
  const { vueArg } = data.otherArg
  Vue.config.productionTip = false
  window.Vue = new Vue({
    el: data.el,
    router: routerInstance,
    store: data.store,
    ...vueArg,
    data() {
      return {
        eventHub: new Vue()
      }
    },
    render: h => h(data.App)
  })
}

// 初始化 otherArg: vueArg, routerArg
function init({ el = '#app', routeMap, storeMap, App, otherArg }) {
  // todo 参数校验
  initData({ el, routeMap, storeMap, App, otherArg })
  initVuePlugin()
  return new Promise(resolve => {
    initStore()
    initRoute()
    initWinAdminBaseFrameData()
    initVue()
    resolve('admin-base-frame init success.')
  })
}

export default {
  version: '1.0.0',
  init
}
