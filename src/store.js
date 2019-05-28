import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    friendlyMinions: {},
    enemyMinions: {}
  },
  mutations: {
    addMinion (state, data) {
      const { friendly, minion } = data
      if (friendly)
        state.friendlyMinions[minion.$] = minion
      else
        state.enemyMinions[minion.$] = minion
    },
    deleteMinion (state, data) {
      const { friendly, id } = data      
      if (friendly)
        delete state.friendlyMinions[id]
      else
        delete state.enemyMinions[id]
    },
    reset (state, friendly) {
      if (friendly)
        state.friendlyMinions = {}
      else
        state.enemyMinions = {}
    }
  },
  actions: {

  }
})
