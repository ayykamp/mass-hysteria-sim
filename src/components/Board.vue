<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap align-center>
      <v-flex lg6 sm12 xs12>
        <v-btn class="reset-btn-friendly" @click="reset('friendly')">
          Reset
        </v-btn>
        <h1>Your Board</h1>
        <v-chip class="friendly-chip" v-for="minion in friendlyMinions" :key="minion.$">
          {{ `${minion.a}/${minion.h}`}}
          <div class="v-chip__close">
            <img
              src="/assets/material_cancel.svg"
              class="v-icon material-icons theme--light close"
              @click="delMinion(minion.$, 'friendly')"
            >
          </div>
        </v-chip>
        <v-form>
          <v-text-field v-model="friendlyCurrent.a" label="Attack" type="number" ref="friendlyAtk" required></v-text-field>
          <v-text-field v-model="friendlyCurrent.h" label="Health" type="number" required @keydown.enter="addMinion('friendly', true)"></v-text-field>
          <v-btn color="primary" @click="addMinion('friendly')">Add Minion</v-btn>
        </v-form>
      </v-flex>
      <v-flex lg6 sm12 xs12>
        <v-btn class="reset-btn-enemy" @click="reset('enemy')">
          Reset
        </v-btn>
        <h1>Enemy Board</h1>
        <v-chip v-for="minion in enemyMinions" :key="minion.$" class="enemy-chip">
          {{ `${minion.a}/${minion.h}`}}
          <div class="v-chip__close">
            <img
              src="/assets/material_cancel.svg"
              class="v-icon material-icons theme--light close"
              @click="delMinion(minion.$, 'enemy')"
            >
          </div>
        </v-chip>
        <v-form>
          <v-text-field v-model="enemyCurrent.a" label="Attack" type="number" ref="enemyAtk" required></v-text-field>
          <v-text-field v-model="enemyCurrent.h" label="Health" type="number" required @keydown.enter="addMinion('enemy', true)"></v-text-field>
          <v-btn color="primary" @click="addMinion('enemy')">Add Minion</v-btn>
        </v-form>
      </v-flex>
        <v-btn color="error" @click="simulate" :loading="simLoading" class="simulate-btn">ＳＩＭＵＬＡＴＥ</v-btn>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="results"
          :custom-sort="minionSort"
          sort-icon="fa-angle-up"
          class="elevation-1"
          hide-actions
          v-if="results.length > 0"
        >
        
          <template slot="items" slot-scope="props">
            <tr :class="props.item.isEnemy === 0 ? 'friendly-minion': 'enemy-minion'">
              <td>{{ props.item.stats }}</td>
              <td class="text-xs-left">{{ Number(props.item.healthAfter.toFixed(2)) }}</td>
              <td class="text-xs-left">{{ Number((props.item.survival) * 100).toFixed(2) + '%' }}</td>
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

const sortMinions = (a, b) => {
  if (a.isEnemy === b.isEnemy) {
    return 0
  } else if (a.isEnemy && !b.isEnemy) {
    return 1
  } else if (!a.isEnemy && b.isEnemy) {
    return -1
  }
}

export default {
  data: () => ({
    friendlyCurrent: {
      a: null,
      h: null,
      $: shortid.generate()
    },
    friendlyMinions: [],
    enemyCurrent: {
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
    addMinion(type, kb) {
      let current = [type + 'Current']
      if (!this.validateInput(current)) return
      this[type + 'Minions'].push(this[current])
      this[current] = {
        a: null,
        h: null,
        $: shortid.generate()
      }
      // focus attack text box again after pressing enter. makes for better ux
      if (kb) this.focus(type)
    },
    delMinion(id, type) {
      this[type + 'Minions'].splice(this[type + 'Minions'].findIndex(e => e.$ === id), 1)
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
        let result = massHysteriaSim(friendlyMinions.concat(enemyMinions).map(e => parseInt(e)), 10000)
        result = result.attack.map((e, i) => {
          return {
            stats: `${e}/${result.healthBefore[i]}`,
            healthAfter: result.healthAfter[i],
            survival: result.survival[i],
            isEnemy: result.isEnemy[i]
          }
        })
        this.results = result.sort(sortMinions)
      } catch (e) {
        this.showSnack(e)
      }
      this.simLoading = false
    },
    reset (type) {
      this[type + 'Minions'] = []
      let current = [type + 'Current']
      this[current] = {
        a: null,
        h: null,
        $: shortid.generate()
      }
    },
    minionSort (minions, header, isDescending) {
      const sortAscDesc = (isDescending, attr) => {
        const sortAsc = (a, b) => a[attr] - b[attr]
        const sortDesc = (a, b) => b[attr] - a[attr]
        return isDescending ? sortDesc : sortAsc
      }

      switch (header) {
        case 'stats':
          return minions.sort(sortMinions)
        case 'healthAfter':
          return minions.sort(sortAscDesc(isDescending, 'healthAfter'))

        case 'survival':
          return minions.sort(sortAscDesc(isDescending, 'survival'))
        default:
          break
      }
      return minions
    },
    focus (type) {
      this.$nextTick(this.$refs[type + 'Atk'].focus)
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
