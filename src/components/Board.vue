<template>
  <div>
    <v-btn :class="friendly ? 'reset-btn-friendly' : 'reset-btn-enemy'" @click="reset">
      Reset
    </v-btn>
    <h1>{{ friendly ? 'Your Board' : 'Enemy Board'}}</h1>
    <minion v-for="minion in minions" :key="minion.$" :friendly="friendly" :minion="minion" @delete="delMinion" />
    <v-form>
      <v-text-field v-model="current.a" label="Attack" type="number" ref="attackTextField" required></v-text-field>
      <v-text-field v-model="current.h" label="Health" type="number" required @keydown.enter="addMinion(true)"></v-text-field>
      <v-checkbox v-model="current.d" label="Divine Shield" :ripple="false" color="primary" class="divine-shield"></v-checkbox>
      <v-checkbox v-model="current.p" label="Poisonous" :ripple="false" color="primary" class="poisonous"></v-checkbox>
      <v-btn color="primary" class="add-minion" @click="addMinion()">Add Minion</v-btn>
    </v-form>
  </div>
</template>

<script>
import Minion from './Minion'
import { getDefaultMinion } from '../util.js'

export default {
  data: () => ({
    current: getDefaultMinion()
  }),
  computed: {
    minions: {
      get: function () {
        if (this.friendly) {
          return this.$store.state.friendlyMinions
        } else {
          return this.$store.state.enemyMinions
        }
      },
      set: function (minions) {
        if (this.friendly) {
          this.$store.commit('updateFriendly', minions)
        } else {
          this.$store.commit('updateEnemy', minions)
        }
      }
    }
  },
  components: {
    Minion
  },
  props: {
    friendly: Boolean
  },
  methods: {
    addMinion(kb) {
      if (!this.validateInput()) return
      this.$store.commit('addMinion', {
        friendly: this.friendly,
        minion: this.current
      })
      this.current = getDefaultMinion()
      
      // focus attack text box again after pressing enter. makes for better ux
      if (kb) this.focus()
    },
    delMinion(id) {
      this.$store.commit('deleteMinion', {
        friendly: this.friendly,
        id
      })
      this.$forceUpdate()
    },
    validateInput() {
      const current = this.current
      if (current.a === null || current.h === null) {
        this.$emit('error', 'Please add some stats')
        return false
      } else if (!current.a.match(/[⌃0-9]/) || !current.h.match(/[⌃0-9]/)) {
        this.$emit('error', 'Invalid Input')
        return false
      } else if (current.h === '0') {
        this.$emit('error', 'No 0 HP minions')
        return false
      } else if (this.minions.length >= 7) {
        this.$emit('error', 'Only 7 Minions allowed')
        return false
      } else {
        return true
      }
    },
    reset () {
      this.$store.commit('reset', this.friendly)
      this.current = getDefaultMinion()
    },
    focus () {
      this.$nextTick(this.$refs.attackTextField.focus)
    },
  },
}
</script>

<style>
th {
  font-size: 1em !important;
}

.friendly-minion {
  color: green;
}

.enemy-minion {
  color: red;
}

.simulate-btn {
  width: 100%;
  margin: 0px;
}

.reset-btn-friendly {
  float: right;
  background-color: rgba(0, 128, 0, .6) !important;
}

.reset-btn-enemy {
  float: right;
  background-color: rgba(128, 0, 0, .6) !important;
}

form > .v-text-field {
  clear: both;
}

.divine-shield {
  float: left;
}

.poisonous {
  float: right;
}

.add-minion {
  clear: both;
  display: block;
}

.emoji {
  color: black;
  display: inline;
}
</style>
