import AbPageTable from './src/main'

/* istanbul ignore next */
AbPageTable.install = function(Vue) {
  Vue.component(AbPageTable.name, AbPageTable)
}

export default AbPageTable
