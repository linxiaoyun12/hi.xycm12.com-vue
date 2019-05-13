// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false


// ElementUI
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI);

//es6-promise
import promise from 'es6-promise';
promise.polyfill();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
