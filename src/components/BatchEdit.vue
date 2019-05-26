<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark @click="$refs.dialog.$emit('openDialog')" v-on="on">Batch Edit</v-btn>
    </template>
    <batch-edit-dialog ref="dialog" @close="dialog = false" />
  </v-dialog>
</template>
<script>
const BatchEditDialog = () => import(/* webpackChunkName: "BatchEditDialog" */'./BatchEditDialog')

export default {
  data() {
    return {
      dialog: false,
    }
  },
  components: {
    BatchEditDialog
  },
}
</script>

<style>
</style>
