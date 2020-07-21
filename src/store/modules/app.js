import Cookies from 'js-cookie'

const state = {
  sidebar: {
    // hide: 隐藏  mini: 只显示图标  normal: 完全显示
    status: 'normal',
    withoutAnimation: false
  },
  device: 'desktop',
  // 当前访问的系统
  system: '',
  // 当前访问的视图层级
  viewLevel: 1,
  // 进入下级视图前访问的最后一个一级视图
  lastVisitedView: {
    lv_1: '',
    lv_2: ''
  }
}

const mutations = {
  TOGGLE_SIDEBAR: (state, { sidebarStatus = 'normal', withoutAnimation = false }) => {
    state.sidebar.status = sidebarStatus
    state.sidebar.withoutAnimation = withoutAnimation
    Cookies.set('sidebarStatus', sidebarStatus)
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SYSTEM: (state, system) => {
    state.system = system
  },
  SET_VIEW_LEVEL: (state, level = 1) => {
    state.viewLevel = level
  },
  SET_LAST_VISITED_VIEW: (state, path) => {
    state.lastVisitedView[`lv_${state.viewLevel}`] = path
  }
}

const actions = {
  toggleSideBar({ commit }, { sidebarStatus, withoutAnimation }) {
    commit('TOGGLE_SIDEBAR', { sidebarStatus, withoutAnimation })
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSystem({ commit }, system) {
    commit('SET_SYSTEM', system)
  },
  setViewLevel({ commit }, level) {
    commit('SET_VIEW_LEVEL', level)
  },
  setLastVisitedView({ commit }, path) {
    commit('SET_LAST_VISITED_VIEW', path)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
