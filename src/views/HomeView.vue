<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 80vh">
    <div style="max-width: 480px; width: 100%">
      <div class="text-center mb-8">
        <v-icon icon="mdi-bowling" size="72" color="primary" class="mb-3" />
        <h1 class="text-h4 font-weight-bold">Bowling Abend</h1>
      </div>

      <v-card v-if="hasActiveSession" class="mb-4" rounded="lg" elevation="2" hover @click="$emit('continueSession')">
        <v-card-text class="d-flex align-center pa-5">
          <v-icon icon="mdi-play-circle-outline" size="40" color="success" class="mr-4" />
          <div>
            <p class="text-h6 mb-0">Abend fortsetzen</p>
            <p class="text-body-2 text-disabled mb-0">Aktive Session mit {{ playerCount }} Spieler{{ playerCount === 1 ? '' : 'n' }} weitermachen</p>
          </div>
          <v-spacer />
          <v-icon icon="mdi-chevron-right" color="disabled" />
        </v-card-text>
      </v-card>

      <v-card class="mb-4" rounded="lg" elevation="2" hover @click="$emit('newSession')">
        <v-card-text class="d-flex align-center pa-5">
          <v-icon icon="mdi-plus-circle-outline" size="40" color="primary" class="mr-4" />
          <div>
            <p class="text-h6 mb-0">Neuen Abend anlegen</p>
            <p class="text-body-2 text-disabled mb-0">Starte einen neuen Bowling-Abend</p>
          </div>
          <v-spacer />
          <v-icon icon="mdi-chevron-right" color="disabled" />
        </v-card-text>
      </v-card>

      <v-card class="mb-4" rounded="lg" elevation="2" hover @click="$emit('history')">
        <v-card-text class="d-flex align-center pa-5">
          <v-icon icon="mdi-history" size="40" color="secondary" class="mr-4" />
          <div>
            <p class="text-h6 mb-0">Bestehende Abende ansehen</p>
            <p class="text-body-2 text-disabled mb-0">Gespeicherte Abende aus dem Backend</p>
          </div>
          <v-spacer />
          <v-icon icon="mdi-chevron-right" color="disabled" />
        </v-card-text>
      </v-card>

      <v-card rounded="lg" elevation="2" hover @click="$emit('randomizer')">
        <v-card-text class="d-flex align-center pa-5">
          <v-icon icon="mdi-shuffle-variant" size="40" color="teal" class="mr-4" />
          <div>
            <p class="text-h6 mb-0">Bahn Randomizer</p>
            <p class="text-body-2 text-disabled mb-0">Spieler zufällig auf Bahnen verteilen</p>
          </div>
          <v-spacer />
          <v-icon icon="mdi-chevron-right" color="disabled" />
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{ hasActiveSession?: boolean; playerCount?: number }>(), {
    hasActiveSession: false,
    playerCount: 0,
  })
  defineEmits<{ newSession: []; continueSession: []; history: []; randomizer: [] }>()
</script>
