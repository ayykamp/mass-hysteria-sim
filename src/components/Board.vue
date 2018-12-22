<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap align-center>
      <v-flex lg6 sm12 xs12>
        <v-btn class="reset-btn" @click="reset(0)">
          Reset
        </v-btn>
        <h1>Your Board</h1>
        
        <v-chip v-for="minion in friendlyMinions" :key="minion.$" class="friendly-chip">
          {{ `${minion.a}/${minion.h}`}}
          <div class="v-chip__close">
            <img
              src="/assets/material_cancel.svg"
              class="v-icon material-icons theme--light close"
              @click="delMinion(minion.$, 0)"
            >
          </div>
        </v-chip>
        <v-form>
          <v-text-field v-model="currentFriendly.a" label="Attack" type="number" required></v-text-field>
          <v-text-field v-model="currentFriendly.h" label="Health" type="number" required @keydown.enter="addMinion(0)"></v-text-field>
          <v-btn color="primary" @click="addMinion(0)">Add Minion</v-btn>
        </v-form>
      </v-flex>
      <v-flex lg6 sm12 xs12>
        <v-btn class="reset-btn" @click="reset(1)">
          Reset
        </v-btn>
        <h1>Enemy Board</h1>
        <v-chip v-for="minion in enemyMinions" :key="minion.$" class="enemy-chip">
          {{ `${minion.a}/${minion.h}`}}
          <div class="v-chip__close">
            <img
              src="/assets/material_cancel.svg"
              class="v-icon material-icons theme--light close"
              @click="delMinion(minion.$, 1)"
            >
          </div>
        </v-chip>
        <v-form>
          <v-text-field v-model="currentEnemy.a" label="Attack" type="number" required></v-text-field>
          <v-text-field v-model="currentEnemy.h" label="Health" type="number" required @keydown.enter="addMinion(1)"></v-text-field>
          <v-btn color="primary" @click="addMinion(1)">Add Minion</v-btn>
        </v-form>
      </v-flex>
        <v-btn color="error" @click="simulate" :loading="simLoading" class="simulate-btn">ＳＩＭＵＬＡＴＥ</v-btn>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="results"
          class="elevation-1"
          hide-actions
          v-if="results.length > 0"
        >
          <template slot="items" slot-scope="props">
            <tr :class="props.item.isEnemy === 0 ? 'friendly-minion': 'enemy-minion'">
              <td>{{ props.item.stats }}</td>
              <td class="text-xs-left">{{ props.item.healthAfter }}</td>
              <td class="text-xs-left">{{ props.item.survival }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
      <v-snackbar v-model="snackbar" color="error" :timeout="6000">
        {{ snackText }}
        <v-btn dark flat @click="snackbar = false">CLOSE</v-btn>
      </v-snackbar>
    </v-layout>
  </v-container>
</template>

<script>
import shortid from 'shortid'
import massHysteriaSim from '../simulate.js'

export default {
  data: () => ({
    currentFriendly: {
      a: null,
      h: null,
      $: shortid.generate()
    },
    friendlyMinions: [],
    currentEnemy: {
      a: null,
      h: null,
      $: shortid.generate()
    },
    enemyMinions: [],
    snackbar: false,
    snackText: null,
    simLoading: false,
    headers: [
      {
        text: 'Minion',
        sortable: false,
        value: 'stats'
      },
      {
        text: 'Average health after',
        value: 'healthAfter'
      },
      {
        text: 'Chance of Survival',
        value: 'survival'
      }
    ],
    results: []
  }),
  methods: {
    addMinion(t) {
      let type = t === 1 ? 'enemy' : 'friendly'
      let current = ['current' + type[0].toUpperCase() + type.slice(1)]
      if (!this.validateInput(current)) return
      this[type + 'Minions'].push(this[current])
      this[current] = {
        a: null,
        h: null,
        $: shortid.generate()
      }
    },
    delMinion(id, t) {
      let type = t === 1 ? 'enemy' : 'friendly'
      this[type + 'Minions'].splice(
        this[type + 'Minions'].findIndex(e => e.$ === id), 1)
    },
    showSnack(text) {
      if (this.snackbar && text === this.snackText) {
        this.shakeItBoi('.v-snack__wrapper')
        return
      } else if (this.snackbar) {
        this.snackText = text
        return
      } else {
        this.snackbar = true
        this.snackText = text
        return
      }
    },
    shakeItBoi(e) {
      let snackbarDiv = document.querySelector(e)
      if (!snackbarDiv.classList.contains('animated')) {
        snackbarDiv.classList.add('animated')
        setTimeout(function() {
          snackbarDiv.classList.remove('animated')
        }, 650)
      }
    },
    validateInput(currentString) {
      const current = this[currentString]
      if (current.a === null || current.h === null) {
        this.showSnack('Please add some stats')
        return false
      } else if (!current.a.match(/[⌃0-9]/) || !current.h.match(/[⌃0-9]/)) {
        this.showSnack('Invalid Input')
        return false
      } else if (current.h === 0) {
        this.showSnack('No 0 HP minions')
        return false
      } else if (this.friendlyMinions.length >= 7 || this.enemyMinions.length >= 7) {
        this.showSnack('Only 7 Minions allowed')
        return false
      } else {
        return true
      }
    },
    simulate() {
      if (this.enemyMinions.length === 0 && this.friendlyMinions.length === 0) {
        return this.showSnack('Please add some minions : )')
      } else if (
        (this.enemyMinions.length === 1 && this.friendlyMinions.length === 0) ||
        (this.enemyMinions.length === 0 && this.friendlyMinions.length === 1)
      ) {
        return this.showSnack('Nothing is going to happen : )')
      }
      let friendlyMinions = this.friendlyMinions.map(e => [e.a, e.h, 0]).flat()
      let enemyMinions = this.enemyMinions.map(e => [e.a, e.h, 1]).flat()
      this.simLoading = true
      try {
        let result = massHysteriaSim(friendlyMinions.concat(enemyMinions), 10000)
        result = result.attack.map((e, i) => {
          return {
            stats: `${e}/${result.healthBefore[i]}`,
            healthAfter: Number(result.healthAfter[i].toFixed(2)),
            survival: Number(result.survival[i].toFixed(2)),
            isEnemy: result.isEnemy[i]
          }
        })
        this.results = result
      } catch (e) {
        this.showSnack(e)
      }
      this.simLoading = false
    },
    reset (t) {
      let type = t === 1 ? 'enemy' : 'friendly'
      this[type + 'Minions'] = []
      let current = ['current' + type[0].toUpperCase() + type.slice(1)]
      this[current] = {
        a: null,
        h: null,
        $: shortid.generate()
      }
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

th > i {
  display: none !important;
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

.flex > button.reset-btn.v-btn.theme--light {
  float: right;
  background-color: #FF6666;
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
