import AbDialog from './src/main'

/* istanbul ignore next */
AbDialog.install = function(Vue) {
  Vue.component(AbDialog.name, AbDialog)
}

export default AbDialog
