import AbFilter from './src/main'

/* istanbul ignore next */
AbFilter.install = function(Vue) {
  Vue.component(AbFilter.name, AbFilter)
}

export default AbFilter
