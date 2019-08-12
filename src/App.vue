<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Mass Hysteria</span>
        <span class="font-weight-light">Simulator</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <batch-edit />
      <export-board />
      <v-btn
        flat
        target="_blank"
        href="https://github.com/AyyKamp/mass-hysteria-sim"
        rel="noreferrer"
        id="github-link"
      >
        <span class="mr-2">GitHub</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container fluid grid-list-xl>
        <v-layout wrap align-center>
          <v-flex lg6 sm12 xs12>
            <board :friendly="true" @error="showSnack"/>
          </v-flex>
          <v-flex lg6 sm12 xs12>
            <board :friendly="false" @error="showSnack"/>
          </v-flex>
          <v-flex xs12>
            <simulation-results @error="showSnack"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer dark>
      <v-layout align-center justify-center row fill-height>
        <a
          target="_blank"
          href="https://github.com/AyyKamp/mass-hysteria-sim"
          rel="noreferrer"
          id="smile-link"
        >
          I Made This <img src="https://static-cdn.jtvnw.net/emoticons/v1/1/1.0" alt="S M I L E" width="20px" id="smile">
        </a>
      </v-layout>
    </v-footer>
    <v-snackbar v-model="snackbar" color="error" :timeout="6000">
      {{ snackText }}
      <v-btn dark flat @click="snackbar = false">CLOSE</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Board from './components/Board'
const SimulationResults = () => import(/* webpackChunkName: "SimulationResults" */ './components/SimulationResults')
import BatchEdit from './components/BatchEdit'
import ExportBoard from './components/ExportBoard'

import { stringToBoard } from './util'

export default {
  name: 'Mass-Hysteria-Simulator',
  components: {
    Board,
    SimulationResults,
    BatchEdit,
    ExportBoard
  },
  data () {
    return {
      snackbar: false,
      snackText: null,
    }
  },
  methods: {
    showSnack (text) {
      if (this.snackbar && text === this.snackText) {
        this.shakeItBoi('.v-snack__wrapper')
        return
      } else if (this.snackbar) {
        this.snackText = text
        return
      } else {
        this.snackbar = true
        this.snackText = text
        return
      }
    },
    shakeItBoi (e) {
      let snackbarDiv = document.querySelector(e)
      if (!snackbarDiv.classList.contains('animated')) {
        snackbarDiv.classList.add('animated')
        setTimeout(function() {
          snackbarDiv.classList.remove('animated')
        }, 650)
      }
    },
    parseQuery (query) {
      let queryObject = {}
      
      query = query.split('&')
      for (let parameter of query) {
        let temp = decodeURIComponent(parameter).split('=')
        queryObject[temp[0]] = temp[1]
      }
      return queryObject
    }
  },
  created () {
    // console.log('https://storage.googleapis.com/discbot-sounds/z/expect.wav')

    if (document.location.search !== '') {
      let query = document.location.search.slice(1)
      query = this.parseQuery(query)

      if (query.f) {
        const tempBoard = stringToBoard(query.f, true)
        for (const minion of tempBoard) {
          this.$store.commit('addMinion', minion)
        }
      }

      if (query.e) {
        const tempBoard = stringToBoard(query.e, false)
        for (const minion of tempBoard) {
          this.$store.commit('addMinion', minion)
        }
      }
    }
  }
}
</script>

<style>
#smile-link {
  text-decoration: none;
  color: white;
}

#smile {
  margin-left: 2px;
  position: relative;
  top: 3px;
}

.v-footer {
  margin-top: 50%;
  background-color: #424242;
}

@media only screen and (max-width: 440px) {
  #github-link {
    display: none;
  }
}

.animated {
  -webkit-animation: 650ms shake alternate ease-in-out;
  -moz-animation: 650ms shake alternate ease-in-out;
  -ms-animation: 650ms shake alternate ease-in-out;
  -o-animation: 650ms shake alternate ease-in-out;
  animation: 650ms shake alternate ease-in-out;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-2px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(2px, 0, 0);
  }
}
</style>

