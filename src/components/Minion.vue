<template>
  <!-- v-for="minion in friendlyMinions" :key="minion.$" -->
    <v-chip :class="friendly ? 'friendly-chip' : 'enemy-chip'">
      {{ `${minion.a}/${minion.h}`}}
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
 /*  data() {
    return {
      key: value
    }
  }, */
  props: {
    minion: Object,
    friendly: Boolean
  },
  methods: {
    name() {
      
    }
  },
}
</script>

<style>

</style>
