<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark @click="$refs.dialog.$emit('open')" v-on="on" class="hidden-xs-only">
        Batch Edit
        <edit />
      </v-btn>
      <v-btn color="primary" icon dark @click="$refs.dialog.$emit('open')" v-on="on" class="hidden-sm-and-up">
        <edit />
      </v-btn>
    </template>
    <batch-edit-dialog ref="dialog" @close="dialog = false" />
  </v-dialog>
</template>
<script>
const BatchEditDialog = () => import(/* webpackChunkName: "BatchEditDialog" */'./BatchEditDialog')
import Edit from '../icons/Edit'

export default {
  data() {
    return {
      dialog: false,
    }
  },
  components: {
    BatchEditDialog,
    Edit
  },
}
</script>

<style>
</style>
