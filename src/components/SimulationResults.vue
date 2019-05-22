<template>
  <div>
    <v-text-field v-model="numberOfRuns" label="Number of Runs" type="number"></v-text-field>
    <v-btn color="error" @click="simulate" :loading="simLoading" class="simulate-btn">ＳＩＭＵＬＡＴＥ</v-btn>

    <div v-if="results.length > 0">
      <h2 id="clear-chance" class="important-results">
        Chance to clear the enemy Board: {{ Number((clearChance) * 100).toFixed(2) + '%' }}
      </h2>
      <h2 id="remaining-damage" class="important-results">
        Average remaining Damage: {{ Number(remainingDamage.toFixed(2)) }}
      </h2>
      <v-data-table
        :headers="headers"
        :items="results"
        :custom-sort="minionSort"
        sort-icon="fa-angle-up"
        class="elevation-1"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr :class="props.item.isEnemy === 0 ? 'friendly-minion': 'enemy-minion'">
            <td>{{ props.item.stats }}</td>
            <td class="text-xs-left">{{ Number(props.item.healthAfter.toFixed(2)) }}</td>
            <td class="text-xs-left">{{ Number((props.item.survival) * 100).toFixed(2) + '%' }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
    
  </div>
</template>

<script>
import massHysteriaSim from '../simulate.js'



export default {
  data() {
    return {
      results: [],
      clearChance: null,
      remainingDamage: null,
      numberOfRuns: 10000,
      simLoading: false,
      headers: [
        {
          text: 'Minion',
          value: 'stats'
        },
        {
          text: 'Average health after',
          value: 'healthAfter'
        },
        {
          text: 'Chance of Survival',
          value: 'survival'
        }
      ],
    }
  },
  computed: {
    friendlyMinions: function () {
      return this.$store.state.friendlyMinions 
    },
    enemyMinions: function () {
      return this.$store.state.enemyMinions 
    },
  },
  methods: {
    simulate() {
      if (this.enemyMinions.length === 0 && this.friendlyMinions.length === 0) {
        return this.$emit('error', 'Please add some minions : )')
      } else if (
        (this.enemyMinions.length === 1 && this.friendlyMinions.length === 0) ||
        (this.enemyMinions.length === 0 && this.friendlyMinions.length === 1)
      ) {
        return this.$emit('error', 'Nothing is going to happen : )')
      }
      let runs = parseInt(this.numberOfRuns)
      let friendlyMinions = this.friendlyMinions.map(e => [e.a, e.h, 0, e.d ? 1: 0, e.p ? 1: 0]).flat()
      let enemyMinions = this.enemyMinions.map(e => [e.a, e.h, 1, e.d ? 1: 0, e.p ? 1: 0]).flat()
      this.simLoading = true
      try {
        let result = massHysteriaSim(friendlyMinions.concat(enemyMinions).map(e => parseInt(e)), runs)
        this.clearChance = result.clearChance
        this.remainingDamage = result.remainingDamage
        result = result.attack.map((e, i) => {
          return {
            stats: `${e}/${result.healthBefore[i]}` + 
              `${result.divineShield[i] ? ' 🛡️': ''}` +
              `${result.poisonous[i] ? ' ☠': ''}`,
            healthAfter: result.healthAfter[i],
            survival: result.survival[i],
            isEnemy: result.isEnemy[i],
            divineShield: result.divineShield[i],
            poisonous: result.poisonous[i]
          }
        })
        this.results = result

      } catch (e) {
        this.$emit('error', e.message)
      }
      this.simLoading = false
    },
    minionSort (minions, header, isDescending) {
      const sortAscDesc = (isDescending, attr) => {
        const sortAsc = (a, b) => a[attr] - b[attr]
        const sortDesc = (a, b) => b[attr] - a[attr]
        return isDescending ? sortDesc : sortAsc
      }

      function sortMinionsAscDesc (isDescending) {
        const factor = isDescending ? -1 : 1
        return (a, b) => {
          if (a.isEnemy === b.isEnemy) {
            return 0
          } else if (a.isEnemy && !b.isEnemy) {
            return 1 * factor
          } else if (!a.isEnemy && b.isEnemy) {
            return -1 * factor
          }
        }
      }

      switch (header) {
        case 'stats':
          return minions.sort(sortMinionsAscDesc(isDescending))
        case 'healthAfter':
          return minions.sort(sortAscDesc(isDescending, 'healthAfter'))
        case 'survival':
          return minions.sort(sortAscDesc(isDescending, 'survival'))
        default:
          break
      }
      return minions
    }
  },
}
</script>

<style>
  #clear-chance {
    padding: 15px 15px 0px 15px;
  }
  #remaining-damage {
    padding: 15px;
  }
  .important-results {
    font-size: 1.2em;
  }
</style>
