<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap align-center>
      <v-flex lg6 sm12 xs12>
        <h1>Your Board</h1>
        <v-chip v-for="minion in myMinions" :key="minion.$" close @input="delMinion(minion.$, 'm')">
          {{ `${minion.a}/${minion.h}`}}
        </v-chip>
        <v-form>
          <v-text-field
            v-model="currentMy.a"
            label="Attack"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="currentMy.h"
            label="Health"
            type="number"
            required
          ></v-text-field>
          <v-btn color="primary" @click="addMinion('m')">
            Add Minion
          </v-btn>
        </v-form>
      </v-flex>
      <v-flex lg6 sm12 xs12>
        <h1>Enemy Board</h1>
        <v-chip v-for="minion in enemyMinions" :key="minion.$" close @input="delMinion(minion.$, 'e')">
          {{ `${minion.a}/${minion.h}`}}
        </v-chip>
        <v-form>
          <v-text-field
            v-model="currentEnemy.a"
            label="Attack"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="currentEnemy.h"
            label="Health"
            type="number"
            required
          ></v-text-field>
          <v-btn color="primary" @click="addMinion('e')">
            Add Minion
          </v-btn>
        </v-form>
      </v-flex>
      <v-layout column>
        <v-btn color="error" @click="simulate" :loading="simLoading">ＳＩＭＵＬＡＴＥ</v-btn>
      </v-layout >
      <v-snackbar
        v-model="snackbar"
        color="error"
        :timeout="6000"
      >
        {{ snackText }}
        <v-btn dark flat @click="snackbar = false">
          CLOSE
        </v-btn>
      </v-snackbar>
    </v-layout>
  </v-container>
</template>

<script>
  import shortid from 'shortid'
  import massHysteriaSim from '../simulate.js'

  export default {
    data: () => ({
      currentMy: {
        a: null,
        h: null,
        $: shortid.generate()
      },
      myMinions: [],
      currentEnemy: {
        a: null,
        h: null,
        $: shortid.generate()
      },
      enemyMinions: [],
      snackbar: false,
      snackText: null,
      simLoading: false
    }),
    methods: {
      addMinion (t) {
        let type =  t === 'e' ? 'enemy': 'my'
        let current = ['current' + type[0].toUpperCase() + type.slice(1)]
        if (!this.validateInput(current)) return
        this[type + 'Minions'].push(this[current])
        this[current] = {
          a: null,
          h: null,
          $: shortid.generate()
        }
      },
      delMinion (id, t) {
        let type =  t === 'e' ? 'enemy': 'my'
        this[type + 'Minions'].splice(this[type + 'Minions'].findIndex(e => e.$ === id), 1)
      },
      showSnack (text) {
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
      shakeItBoi (e) {
      let snackbarDiv = document.querySelector(e);
        if (!snackbarDiv.classList.contains('animated')) {
          snackbarDiv.classList.add('animated');
          setTimeout(function() {
            snackbarDiv.classList.remove('animated');

          }, 650);
        }
      },
      validateInput (currentString) {
        const current = this[currentString]
        if (current.a === null|| current.h === null) {
          this.showSnack('Please add some stats')
          return false
        } else if (!current.a.match(/[⌃0-9]/) || !current.h.match(/[⌃0-9]/)) {
          this.showSnack('Invalid Input')
          return false
        } else if (current.h === 0) {
          this.showSnack('No 0 HP minions')
          return true
        } else {
          return true
        }
      },
      simulate () {
        if (this.enemyMinions.length === 0 && this.myMinions.length === 0) {
          return this.showSnack('Please add some minions : )')
        } else if ((this.enemyMinions.length === 1 && this.myMinions.length === 0) || (this.enemyMinions.length === 0 && this.myMinions.length === 1)){
          return this.showSnack('Nothing is going to happen : )')
        }
        let myMinions = this.myMinions.map(e => [e.a, e.h, 0]).flat()
        let enemyMinions = this.enemyMinions.map(e => [e.a, e.h, 1]).flat()
        this.simLoading = true
        try {
          const result = massHysteriaSim(myMinions.concat(enemyMinions), 10000)
          console.log(result)
        } catch (e) {
          this.showSnack(e)
        }
        this.simLoading = false
      }
    },

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
</style>
