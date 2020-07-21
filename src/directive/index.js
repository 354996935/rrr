import focus from './focus'
import intervalClick from './interval-click'
import waves from './waves'

export default {
  install(Vue) {
    Vue.directive('focus', focus)
    Vue.directive('interval-click', intervalClick)
    Vue.directive('waves', waves)
  }
}
