import AbUpload from './src/main'

/* istanbul ignore next */
AbUpload.install = function(Vue) {
  Vue.component(AbUpload.name, AbUpload)
}

export default AbUpload
