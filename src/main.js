import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'
import store from './store'
import { ID } from './plugins/ga'
 
Vue.use(VueAnalytics, {
  id: ID,
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  }
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
