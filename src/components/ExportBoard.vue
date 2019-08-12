<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark @click="$refs.dialog.$emit('open')" v-on="on">Export Board</v-btn>
    </template>
    <export-board-dialog ref="dialog" @close="dialog = false" />
  </v-dialog>
</template>
<script>
const ExportBoardDialog = () => import(/* webpackChunkName: "ExportBoardDialog" */'./ExportBoardDialog')

export default {
  data() {
    return {
      dialog: false,
    }
  },
  components: {
    ExportBoardDialog
  },
}
</script>

<style>
</style>
