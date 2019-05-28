import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'
import VueWorker from 'vue-worker'
import store from './store'
import { ID } from './plugins/ga'
 
Vue.use(VueAnalytics, {
  id: ID,
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  }
})

Vue.use(VueWorker)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
