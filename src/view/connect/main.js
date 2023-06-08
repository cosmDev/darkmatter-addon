import Vue from 'vue'
import App from './App.vue'
import vuetify from '../../plugins/vuetify'
import router from '../../router'
import store from '../../store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  vuetify,
  store,
  render: h => h(App)
})
