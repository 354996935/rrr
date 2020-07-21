import { resetRouter } from '../../router'

const state = {
  name: '',
  avatar: ''
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  setUserInfo({ commit }, { name, avatar }) {
    commit('SET_NAME', name)
    commit('SET_AVATAR', avatar)
  },
  // user logout
  logout({ dispatch }) {
    return new Promise((resolve, reject) => {
      resetRouter()
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('adminBaseFrame/tagsView/delAllViews', null, { root: true })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
