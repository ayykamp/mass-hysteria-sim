import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    friendlyMinions: [],
    enemyMinions: []
  },
  mutations: {
    updateFriendly (state, friendlyMinions) {
      state.friendlyMinions = friendlyMinions
    },
    updateEnemy (state, enemyMinions) {
      state.enemyMinions = enemyMinions
    },
    reset (state) {
      state.friendlyMinions = []
      state.enemyMinions = []    
    }
  },
  actions: {

  }
})
