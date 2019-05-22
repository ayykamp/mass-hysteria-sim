<template>
    <v-chip :class="friendly ? 'friendly-chip' : 'enemy-chip'">
      {{ `${minion.a}/${minion.h}${minion.d ? ' 🛡️': ''} ${minion.p ? ' ☠️': ''}`}}
      <div class="v-chip__close">
        <img
          src="/assets/material_cancel.svg"
          class="v-icon material-icons theme--light close"
          @click="$emit('delete', minion.$, 'friendly')"
        >
      </div>
  </v-chip>
</template>

<script>
export default {
  props: {
    minion: Object,
    friendly: Boolean
  },
}
</script>

<style>

</style>
