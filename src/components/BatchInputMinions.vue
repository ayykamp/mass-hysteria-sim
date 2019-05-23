<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Batch Input Minions</span>
      </v-card-title>
        <v-card-text>
        Input minions space seperated with stats seperated with '/'. Denote Divine Shield and poisonous with d/p.
        <br>
        E.g.: <code>6/7 1/1dp 3/3d</code>
        <br>
        For Boulderfist Ogre, Stoneskin Basilisk and Silvermoon Guardian
      </v-card-text>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>  
              <v-text-field
                label="Your Board"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>  
              <v-text-field
                label="Enemy Board"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialog: false
    }
  }
}
</script>

<style>
</style>
