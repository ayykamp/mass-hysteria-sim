<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Mass Hysteria</span>
        <span class="font-weight-light">Simulator</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        target="_blank"
      >
        <span class="mr-2">GitHub</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <Board/>
    </v-content>
    <!-- <v-footer dark>
      <v-layout align-center justify-center row fill-height>
        Made with <img src="https://cdn.frankerfacez.com/emoticon/103171/4" alt="gachiGASM" width="20px" class="gachi">
      </v-layout>
    </v-footer> -->
  </v-app>
</template>

<script>
import Board from './components/Board'

export default {
  name: 'Mass-Hysteria-Simulator',
  components: {
    Board
  },
  data () {
    return {
      
    }
  }
}
</script>

<style>
.gachi {
  margin-left: 5px;
}

.v-footer {
  margin-top: 50%;
  background-color: #424242;
}
</style>

