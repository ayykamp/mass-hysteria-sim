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

.enemy-chip {
  background-color: rgba(128, 0, 0, .5) !important;
}

.friendly-chip {
  background-color: rgba(0, 128, 0, .5) !important;
}
</style>
