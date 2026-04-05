<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 80vh">
    <div style="max-width: 480px; width: 100%">
      <div class="text-center mb-8">
        <v-icon icon="mdi-bowling" size="72" color="primary" class="mb-3" />
        <h1 class="text-h4 font-weight-bold">Bowling Abend</h1>
      </div>

      <!-- Wer ist heute da? -->
      <template v-if="players.length === 0">
        <v-card class="mb-4" rounded="lg" elevation="2">
          <v-card-title class="pa-4 pb-2">Wer ist heute da?</v-card-title>
          <v-card-text class="pa-4 pt-0">
            <div class="d-flex flex-wrap gap-2 mb-4">
              <v-chip
                v-for="name in presetNames"
                :key="name"
                class="player-chip"
                :color="selectedNames.includes(name) ? 'primary' : 'default'"
                size="large"
                :variant="selectedNames.includes(name) ? 'flat' : 'outlined'"
                @click="toggleName(name)"
              >
                <v-icon size="16" start>
                  {{ selectedNames.includes(name) ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                </v-icon>
                {{ name }}
              </v-chip>
              <v-chip
                v-for="name in customNames"
                :key="name"
                class="player-chip"
                closable
                :color="selectedNames.includes(name) ? 'teal' : 'default'"
                size="large"
                :variant="selectedNames.includes(name) ? 'flat' : 'outlined'"
                @click="toggleName(name)"
                @click:close.stop="removeCustomName(name)"
              >
                <v-icon size="16" start>mdi-account-plus</v-icon>
                {{ name }}
              </v-chip>
            </div>

            <v-divider class="mb-3" />

            <div class="d-flex gap-2 align-center">
              <v-text-field
                v-model="newNameInput"
                class="flex-grow-1"
                density="compact"
                hide-details
                maxlength="20"
                placeholder="Weitere Person hinzufügen…"
                rounded="lg"
                variant="outlined"
                @keyup.enter="addCustomName"
              />
              <v-btn
                color="primary"
                :disabled="!newNameInput.trim() || allNames.includes(newNameInput.trim())"
                icon
                rounded="lg"
                size="default"
                variant="flat"
                @click="addCustomName"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-btn
          block
          class="py-4"
          color="primary"
          :disabled="selectedNames.length === 0"
          rounded="lg"
          size="x-large"
          @click="confirmPlayers"
        >
          <v-icon start>mdi-check</v-icon>
          Abend starten
        </v-btn>
      </template>

      <!-- Hauptmenü -->
      <template v-else>
        <v-card class="mb-4" rounded="lg" elevation="2" hover @click="$emit('continueSession')">
          <v-card-text class="d-flex align-center pa-5">
            <v-icon icon="mdi-play-circle-outline" size="40" color="success" class="mr-4" />
            <div>
              <p class="text-h6 mb-0">Getränke tracken</p>
              <p class="text-body-2 text-disabled mb-0">{{ players.length }} Spieler dabei</p>
            </div>
            <v-spacer />
            <v-icon icon="mdi-chevron-right" color="disabled" />
          </v-card-text>
        </v-card>

        <v-card class="mb-4" rounded="lg" elevation="2" hover @click="$emit('randomizer')">
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

        <v-card rounded="lg" elevation="2" hover @click="$emit('newSession')">
          <v-card-text class="d-flex align-center pa-5">
            <v-icon icon="mdi-plus-circle-outline" size="40" color="error" class="mr-4" />
            <div>
              <p class="text-h6 mb-0">Neuen Abend anlegen</p>
              <p class="text-body-2 text-disabled mb-0">Aktuellen Abend verwerfen und neu starten</p>
            </div>
            <v-spacer />
            <v-icon icon="mdi-chevron-right" color="disabled" />
          </v-card-text>
        </v-card>
      </template>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import { useDrinkTracker } from '@/composables/useDrinkTracker'

  const emit = defineEmits<{ newSession: []; continueSession: []; history: []; randomizer: [] }>()

  const { players, addPlayer } = useDrinkTracker()

  const presetNames = ['Coach', 'BM', 'Legende', 'Highko', 'El Tomas', 'Doc']
  const customNames = ref<string[]>([])
  const selectedNames = ref<string[]>([])
  const newNameInput = ref('')

  const allNames = computed(() => [...presetNames, ...customNames.value])

  // Reset local selection state when session is cleared
  watch(() => players.value.length, newLen => {
    if (newLen === 0) {
      selectedNames.value = []
      customNames.value = []
      newNameInput.value = ''
    }
  })

  function toggleName (name: string) {
    const idx = selectedNames.value.indexOf(name)
    if (idx === -1) {
      selectedNames.value.push(name)
    } else {
      selectedNames.value.splice(idx, 1)
    }
  }

  function addCustomName () {
    const name = newNameInput.value.trim()
    if (!name || allNames.value.includes(name)) return
    customNames.value.push(name)
    selectedNames.value.push(name)
    newNameInput.value = ''
  }

  function removeCustomName (name: string) {
    customNames.value = customNames.value.filter(n => n !== name)
    selectedNames.value = selectedNames.value.filter(n => n !== name)
  }

  function confirmPlayers () {
    for (const name of selectedNames.value) {
      addPlayer(name)
    }
    emit('continueSession')
  }
</script>

<style scoped>
.player-chip {
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.player-chip:active {
  transform: scale(0.95);
}
</style>
