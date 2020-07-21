import GneteDemo from './src/main';

/* istanbul ignore next */
GneteDemo.install = function(Vue) {
  Vue.component(GneteDemo.name, GneteDemo);
};

export default GneteDemo;
