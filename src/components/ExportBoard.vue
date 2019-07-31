<template>
  <div>
    <v-btn dark @click.stop="openDialog">Export Board</v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">Export this Board State</v-card-title>
        <v-card-text>
          <v-text-field v-model="URL" ref="urlField">
            <template slot="append">
              <v-btn icon @click="copyToClipboard">
                <file-copy></file-copy>
              </v-btn>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialog = false">Dismiss</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FileCopy from '../icons/FileCopy'

export default {
  data: () => {
    return {
      dialog: false,
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
    openDialog () {
      this.dialog = true

      const baseURL = window.location.origin 
      let url = baseURL + '/?'
      let boardQuery = ''

      if (Object.keys(this.friendlyMinions).length > 0)
        for (let minion of Object.values(this.friendlyMinions))
          boardQuery += `${minion.a}/${minion.h}${minion.d ? 'd': ''}${minion.p ? 'p': ''} `
      
      if (Object.keys(this.enemyMinions).length > 0)
        for (let minion of Object.values(this.enemyMinions))
          boardQuery += `${minion.a}/${minion.h}${minion.d ? 'd': ''}${minion.p ? 'p': ''} `
      
      this.URL = url + encodeURIComponent(boardQuery)

    },
    copyToClipboard () {
      // the actual input element behing the v-text-field
      this.$refs.urlField.$el.children[0].children[0].children[0].children[0].select()
      document.execCommand('copy')
    }
  }
}
</script>

<style>
</style>
