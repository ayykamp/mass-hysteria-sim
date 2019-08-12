<template>
  <v-card>
    <v-card-title class="headline">Export this Board State</v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 v-if="Object.keys(friendlyMinions).length > 0 || Object.keys(enemyMinions).length > 0">
            <v-text-field v-model="URL" ref="urlField" readonly>
              <template slot="append">
                <v-btn icon @click="copyToClipboard">
                  <file-copy></file-copy>
                </v-btn>
              </template>
            </v-text-field>
          </v-flex>
          <v-flex xs12 v-else>
            <span class="title">Please add some minions first!</span>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="$emit('close')">Dismiss</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import FileCopy from '../icons/FileCopy'

export default {
  data: () => {
    return {
      URL: null
    }
  },
  components: {
    FileCopy
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
    copyToClipboard () {
      // the actual input element behing the v-text-field
      this.$refs.urlField.$el.children[0].children[0].children[0].children[0].select()
      document.execCommand('copy')
    }
  },
  mounted () {
    this.$on('open', () => {
      const baseURL = window.location.origin
      let url = baseURL + '/?'
      let boardQuery = ''

      if (Object.keys(this.friendlyMinions).length > 0) {
        boardQuery += 'f='
        let tempQuery = ''
        for (let minion of Object.values(this.friendlyMinions))
          tempQuery += `${minion.a}/${minion.h}${minion.d ? 'd': ''}${minion.p ? 'p': ''} `
        boardQuery += encodeURIComponent(tempQuery)
      }

      if (Object.keys(this.enemyMinions).length > 0 && Object.keys(this.friendlyMinions).length > 0)
        boardQuery += '&'

      if (Object.keys(this.enemyMinions).length > 0) {
        boardQuery += 'e='
        let tempQuery = ''
        for (let minion of Object.values(this.enemyMinions))
          tempQuery += `${minion.a}/${minion.h}${minion.d ? 'd': ''}${minion.p ? 'p': ''} `
        boardQuery += encodeURIComponent(tempQuery)        
      }
      
      this.URL = url + boardQuery
    })
  },
}
</script>

<style>
</style>
