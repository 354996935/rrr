import AbForm from './src/main'

/* istanbul ignore next */
AbForm.install = function(Vue) {
  Vue.component(AbForm.name, AbForm)
}

export default AbForm
