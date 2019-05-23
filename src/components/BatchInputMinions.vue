<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
    </template>
    <v-card>
      <v-form v-model=formValid ref="form">
        <v-card-title>
          <span class="headline">Batch Input Minions</span>
        </v-card-title>
          <v-card-text>
          Input minions space seperated with stats seperated with '/'. 
          Denote Divine Shield and poisonous with d and p respectively.
          <br>
          E.g.: <code>6/7 1/1dp 3/3d</code>
          <br>
          For Boulderfist Ogre, Stoneskin Basilisk and Silvermoon Guardian
        </v-card-text>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>  
                <v-text-field
                  label="Your Board"
                  v-model="friendlyBoard"
                  :rules="minionRules.concat(friendlyRule)"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Enemy Board"
                  v-model="enemyBoard"
                  :rules="minionRules.concat(enemyRule)"
                  required
                ></v-text-field>
              </v-flex>
              <small>Keep in mind this will delete previously added minions</small>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="primary" @click="save()">Save</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import { getDefaultMinion } from '../util'

export default {
  data() {
    return {
      formValid: null,
      dialog: false,
      friendlyBoard: '',
      enemyBoard: '',
      friendlyRule: v => (!!v || !!this.enemyMinions) || 'Enter some minions',
      enemyRule: v => (!!v || !!this.friendlyMinions) || 'Enter some minions',
      minionRules: [
        v => (!v || /^[0-9 \/dp]*$/gm.test(v)) || 'Invalid charcters',
        v => (!v || v.split(' ').length <= 7) || 'No more than 7 minions'
      ]
    }
  },
  computed: {
    friendlyMinions: {
      get: function () {
        return this.$store.state.friendlyMinions
      }
    },
    enemyMinions: {
      get: function () {
        return this.$store.state.enemyMinions
      }
    }
  },
  methods: {
    save () {
      if (this.$refs.form.validate()) {
        this.dialog = false
        this.$store.commit('reset')
        
        if (this.friendlyBoard) {
          let friendlyBoard = this.friendlyBoard.split(' ')
          const statsRegex = /[0-9]+\/[0-9]+/gm
          friendlyBoard.forEach((e, i) => {
            let minion = getDefaultMinion()
            let stats = e.match(statsRegex)[0].split('/')
            minion.a = stats[0]
            minion.h = stats[1]

            minion.d = e.includes('d')
            minion.p = e.includes('p')
            
            let minions = this.friendlyMinions.concat([minion])
            this.$store.commit('updateFriendly', minions)
          })
        }

        if (this.enemyBoard) {
          let enemyBoard = this.enemyBoard.split(' ')
          const statsRegex = /[0-9]+\/[0-9]+/gm

          enemyBoard.forEach((e, i) => {
            let minion = getDefaultMinion()
            let stats = e.match(statsRegex)[0].split('/')
            minion.a = stats[0]
            minion.h = stats[1]

            minion.d = e.includes('d')
            minion.p = e.includes('p')

            let minions = this.enemyMinions.concat([minion])
            this.$store.commit('updateEnemy', minions)
          })
        }

        this.$refs.form.reset()      
      }
    }
  }
}
</script>

<style>
</style>
