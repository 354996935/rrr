import Vue from 'vue'

const state = {
  // lv_1: 一级视图 lv_2：二级视图
  visitedViewsMap: {
    lv_1: [],
    lv_2: []
  },
  cachedViewsMap: {
    lv_1: [],
    lv_2: []
  }
}

const mutations = {
  ADD_VISITED_VIEW: (state, { level, view }) => {
    if (!state.visitedViewsMap[`${level}`]) {
      Vue.set(state.visitedViewsMap, level, [])
      Vue.set(state.cachedViewsMap, level, [])
    }
    const visitedViews = state.visitedViewsMap[`${level}`]
    if (visitedViews.some(v => v.path === view.path)) {
      return
    }
    state.visitedViewsMap[`${level}`].push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW: (state, { level, view }) => {
    const cachedViews = state.cachedViewsMap[`${level}`]
    if (cachedViews.includes(view.name)) {
      return
    }
    if (!view.meta.noCache) {
      state.cachedViewsMap[`${level}`].push(view.name)
    }
  },

  DEL_VISITED_VIEW: (state, { level, view }) => {
    const visitedViews = state.visitedViewsMap[`${level}`]
    for (const [i, v] of visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViewsMap[`${level}`].splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, { level, view }) => {
    const cachedViews = state.cachedViewsMap[`${level}`]
    const index = cachedViews.indexOf(view.name)
    index > -1 && state.cachedViewsMap[`${level}`].splice(index, 1)
  },
  DEL_OTHERS_VISITED_VIEWS: (state, { level, view }) => {
    const visitedViews = state.visitedViewsMap[`${level}`]
    state.visitedViewsMap[`${level}`] = visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, { level, view }) => {
    const cachedViews = state.cachedViewsMap[`${level}`]
    const index = cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViewsMap[`${level}`] = cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViewsMap[`${level}`] = []
    }
  },
  DEL_ALL_VISITED_VIEWS_BY_LV: (state, { level }) => {
    const visitedViews = state.visitedViewsMap[`${level}`]
    // keep affix tags
    const affixTags = visitedViews.filter(tag => tag.meta.affix)
    state.visitedViewsMap[`${level}`] = affixTags
  },
  DEL_ALL_CACHED_VIEWS_BY_LV: (state, { level }) => {
    state.cachedViewsMap[`${level}`] = []
  },
  DEL_ALL_VISITED_VIEWS: (state) => {
    state.visitedViewsMap = {}
  },
  DEL_ALL_CACHED_VIEWS: (state) => {
    state.cachedViewsMap = {}
  },
  UPDATE_VISITED_VIEW: (state, { level, view }) => {
    for (let v of state.visitedViewsMap[`${level}`]) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  },
  // affix: true 的页面也会被清除
  CLEAN_TAGS_VIEW: (state, { level }) => {
    state.visitedViewsMap[`${level}`] = []
    state.cachedViewsMap[`${level}`] = []
  },
  // 初始化 visitedViews、cachedViews
  INIT_TAGS_VIEW: (state, { level }) => {
    if (!state.visitedViewsMap[`${level}`]) {
      Vue.set(state.visitedViewsMap, level, [])
      Vue.set(state.cachedViewsMap, level, [])
    }
  }
}

const actions = {
  addView({ dispatch }, { level = 'lv_1', view }) {
    dispatch('addVisitedView', { level, view })
    dispatch('addCachedView', { level, view })
  },
  addVisitedView({ commit }, { level = 'lv_1', view }) {
    commit('ADD_VISITED_VIEW', { level, view })
  },
  addCachedView({ commit }, { level = 'lv_1', view }) {
    commit('ADD_CACHED_VIEW', { level, view })
  },
  delView({ dispatch, state }, { level = 'lv_1', view }) {
    return new Promise(resolve => {
      dispatch('delVisitedView', { level, view })
      dispatch('delCachedView', { level, view })
      resolve({
        visitedViews: [...state.visitedViewsMap[`${level}`]],
        cachedViews: [...state.cachedViewsMap[`${level}`]]
      })
    })
  },
  delVisitedView({ commit, state }, { level = 'lv_1', view }) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', { level, view })
      resolve([...state.visitedViewsMap[`${level}`]])
    })
  },
  delCachedView({ commit, state }, { level = 'lv_1', view }) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', { level, view })
      resolve([...state.cachedViewsMap[`${level}`]])
    })
  },
  delOthersViews({ dispatch, state }, { level = 'lv_1', view }) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', { level, view })
      dispatch('delOthersCachedViews', { level, view })
      resolve({
        visitedViews: [...state.visitedViewsMap[`${level}`]],
        cachedViews: [...state.cachedViewsMap[`${level}`]]
      })
    })
  },
  delOthersVisitedViews({ commit, state }, { level = 'lv_1', view }) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', { level, view })
      resolve([...state.visitedViewsMap[`${level}`]])
    })
  },
  delOthersCachedViews({ commit, state }, { level = 'lv_1', view }) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', { level, view })
      resolve([...state.cachedViewsMap[`${level}`]])
    })
  },
  delAllViewsByLv({ dispatch, commit, state }, { level }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS_BY_LV', { level })
      commit('DEL_ALL_CACHED_VIEWS_BY_LV', { level })
      resolve({
        visitedViews: [...state.visitedViewsMap[`${level}`]],
        cachedViews: [...state.cachedViewsMap[`${level}`]]
      })
    })
  },
  delAllViews({ dispatch }) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews')
      dispatch('delAllCachedViews')
      resolve({
        visitedViews: [],
        cachedViews: []
      })
    })
  },
  delAllVisitedViews({ commit }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([])
    })
  },
  delAllCachedViews({ commit }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([])
    })
  },
  updateVisitedView({ commit }, { level = 'lv_1', view }) {
    commit('UPDATE_VISITED_VIEW', { level, view })
  },
  cleanTagsView({ commit }, { level = 'lv_1' }) {
    commit('CLEAN_TAGS_VIEW', { level })
  },
  initTagsView({ commit }, { level = 'lv_1' }) {
    commit('INIT_TAGS_VIEW', { level })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
