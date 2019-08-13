<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark @click="$refs.dialog.$emit('open')" v-on="on" class="hidden-xs-only">
        Export Board
        <open-in-new-icon />
      </v-btn>
      <v-btn color="primary" icon @click="$refs.dialog.$emit('open')" v-on="on" class="hidden-sm-and-up">
        <open-in-new-icon />
      </v-btn>
    </template>
    <export-board-dialog ref="dialog" @close="dialog = false" />
  </v-dialog>
</template>
<script>
const ExportBoardDialog = () => import(/* webpackChunkName: "ExportBoardDialog" */'./ExportBoardDialog')
import OpenInNewIcon from '../icons/OpenInNewIcon'

export default {
  data() {
    return {
      dialog: false,
    }
  },
  components: {
    ExportBoardDialog,
    OpenInNewIcon
  },
}
</script>

<style>
</style>
