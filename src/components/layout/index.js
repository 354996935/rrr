import AbLayout from './src/main'

/* istanbul ignore next */
AbLayout.install = function(Vue) {
  Vue.component(AbLayout.name, AbLayout)
}

export default AbLayout
