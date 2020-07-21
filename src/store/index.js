import getters from './getters'
import persistedState from 'vuex-persistedstate'
import modules from './admin-base-frame'

export const baseStore = {
  modules,
  getters,
  plugins: [
    persistedState({
      storage: window.sessionStorage,
      // 指定到储存本地store
      reducer(val) {
        return {
          app: val.app,
          settings: val.settings
        }
      }
    })
  ]
}
