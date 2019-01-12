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
      <v-btn color="primary" @click="addMinion()">Add Minion</v-btn>
    </v-form>
  </div>
</template>

<script>
import shortid from 'shortid'
import Minion from './Minion'

export default {
  data: () => ({
    current: {
      a: null,
      h: null,
      $: shortid.generate()
    },
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
      this.minions = this.minions.concat([this.current])
      this.current = {
        a: null,
        h: null,
        $: shortid.generate()
      }
      // focus attack text box again after pressing enter. makes for better ux
      if (kb) this.focus()
    },
    delMinion(id) {
      this.minions.splice(this.minions.findIndex(e => e.$ === id), 1)
      this.minions = this.minions
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
      this.minions = []
      this.current = {
        a: null,
        h: null,
        $: shortid.generate()
      }
    },
    focus () {
      this.$nextTick(this.$refs.attackTextField.focus)
    }
  }
}
</script>

<style>
.animated {
  -webkit-animation: 650ms shake alternate ease-in-out;
  -moz-animation: 650ms shake alternate ease-in-out;
  -ms-animation: 650ms shake alternate ease-in-out;
  -o-animation: 650ms shake alternate ease-in-out;
  animation: 650ms shake alternate ease-in-out;
}

.close {
  width: 20px;
}

.v-chip__content {
  padding-right: 4px !important;
}

.v-icon.fa.fa-angle-up {
  margin-left: 10px;
}

th {
  font-size: 1em !important;
}

.enemy-chip {
  background-color: rgba(128, 0, 0, .5) !important;
}

.friendly-chip {
  background-color: rgba(0, 128, 0, .5) !important;
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

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-2px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(2px, 0, 0);
  }
}
</style>
