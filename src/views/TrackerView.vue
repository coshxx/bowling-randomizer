<template>
  <v-container fluid class="pa-4">
    <v-row v-if="players.length > 0">
      <v-col
        v-for="player in players"
        :key="player.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <PlayerCard
          :player="player"
          :drink-types="drinkTypes"
          @remove="removePlayer(player.id)"
        />
      </v-col>
    </v-row>

    <div v-else class="d-flex flex-column align-center justify-center" style="min-height: 60vh">
      <v-icon icon="mdi-bowling" size="64" color="primary" class="mb-4" />
      <p class="text-h6 text-medium-emphasis">Noch keine Spieler</p>
      <p class="text-body-2 text-disabled mb-4">Füge Spieler hinzu, um den Abend zu starten</p>
      <v-btn
        prepend-icon="mdi-account-plus"
        color="primary"
        variant="tonal"
        @click="$emit('openAddPlayer')"
      >
        Ersten Spieler hinzufügen
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import { useDrinkTracker } from '@/composables/useDrinkTracker'
  import PlayerCard from '@/components/PlayerCard.vue'

  defineEmits<{ openAddPlayer: [] }>()

  const { players, drinkTypes, removePlayer } = useDrinkTracker()
</script>
