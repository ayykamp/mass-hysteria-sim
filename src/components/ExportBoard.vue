<template>
  <div>
    <v-btn dark @click.stop="openDialog">Export Board</v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">Export this Board State</v-card-title>
        <v-card-text>
          <v-text-field v-model="URL" append-icon="file_copy" @click:append="copyToClipboard"></v-text-field>
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
export default {
  data: () => {
    return {
      dialog: false,
      URL: null
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
    openDialog () {
      this.dialog = true

      const baseURL = window.location.origin 
      let url = baseURL

      if (Object.keys(this.friendlyMinions) > 0)
        for (let minion of Object.values(this.friendlyMinions))
          url += `${minion.a}/${minion.h}${minion.d ? 'd': ''}${minion.p ? 'p': ''} `
      
      if (Object.keys(this.enemyMinions) > 0)
        for (let minion of Object.values(this.enemyMinions))
          url += `${minion.a}/${minion.h}${minion.d ? 'd': ''}${minion.p ? 'p': ''} `
      
      this.URL = url

    },
    copyToClipboard () {

    }
  }
}
</script>

<style>
</style>
