<template>
    <v-chip
      :class="friendly ? 'friendly-chip' : 'enemy-chip'"
      close
      @input="$emit('delete', minion.$, 'friendly')"
    >
      {{ `${minion.a}/${minion.h}${minion.d ? ' 🛡️': ''} ${minion.p ? ' ☠️': ''}`}}
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
.v-chip__content {
  font-size: 14px;
}
</style>
