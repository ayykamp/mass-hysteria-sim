<template>
  <v-card>
    <v-form v-model="formValid" ref="form">
      <v-card-title>
        <span class="headline">Batch Edit Minions</span>
      </v-card-title>
      <v-card-text>
        Input minions space seperated with stats seperated by '/'.
        <br>
        Denote Divine Shield and poisonous with d and p respectively.
        <br>
        E.g.:
        <code>6/7 1/1dp 3/3d</code>
        <br>
        For 
          <a href="https://hearthstone.gamepedia.com/Boulderfist_Ogre" target="_blank">Boulderfist Ogre</a>, 
          <a href="https://hearthstone.gamepedia.com/Boulderfist_Ogre" target="_blank">Stoneskin Basilisk</a> and 
          <a href="https://hearthstone.gamepedia.com/Boulderfist_Ogre" target="_blank">Silvermoon Guardian</a>
      </v-card-text>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                label="Your Board"
                v-model="friendlyTextField"
                :rules="minionRules.concat(friendlyRule)"
                required
                @keydown.enter="save()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Enemy Board"
                v-model="enemyTextField"
                :rules="minionRules.concat(enemyRule)"
                required
                @keydown.enter="save()"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="$emit('close')">Close</v-btn>
        <v-btn color="primary" @click="save()">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { stringToBoard } from '../util.js'
import { boardToString } from '../util.js'

export default {
  data() {
    return {
      formValid: null,
      friendlyTextField: '6/7 1/1dp 3/3d',
      enemyTextField: '',
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
        this.$store.commit('reset', true)
        this.$store.commit('reset', false)
        
        if (this.friendlyTextField) {
          const tempBoard = stringToBoard(this.friendlyTextField, true)
          for (const minion of tempBoard) {
            this.$store.commit('addMinion', minion)
          }
        }

        if (this.enemyTextField) {
          const tempBoard = stringToBoard(this.enemyTextField, false)
          for (const minion of tempBoard) {
            this.$store.commit('addMinion', minion)
          }
        }

        this.$refs.form.reset()
        this.$emit('close')
      }
    },
  },
  mounted () {
    this.$on('open', () => {
      if (Object.keys(this.friendlyMinions).length > 0)
        this.friendlyTextField = boardToString(this.friendlyMinions)

      if (Object.keys(this.enemyMinions).length > 0)
        this.enemyTextField = boardToString(this.enemyMinions)
    })
  },
}
</script>

<style>
</style>
