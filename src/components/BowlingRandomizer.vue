<template>
  <v-container class="pa-4" max-width="480">
    <!-- Header -->
    <div class="text-center mb-6">
      <div class="text-h3 mb-1">🎳</div>
      <div class="text-h5 font-weight-bold text-white">Bahn Randomizer</div>
      <div class="text-caption text-medium-emphasis">Wer ist heute dabei?</div>
    </div>

    <!-- Player Selection -->
    <v-card class="mb-5" color="surface" elevation="2" rounded="xl">
      <v-card-text class="pa-4">
        <div class="text-overline text-medium-emphasis mb-3">Spieler auswählen</div>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <v-chip
            v-for="player in allPlayers"
            :key="player"
            class="player-chip"
            :closable="customPlayers.has(player)"
            :color="selectedPlayers.includes(player) ? (customPlayers.has(player) ? 'teal' : 'primary') : 'default'"
            size="large"
            :variant="selectedPlayers.includes(player) ? 'flat' : 'outlined'"
            @click="togglePlayer(player)"
            @click:close.stop="removeCustomPlayer(player)"
          >
            <v-icon v-if="!customPlayers.has(player)" size="16" start>
              {{ selectedPlayers.includes(player) ? 'mdi-check-circle' : 'mdi-circle-outline' }}
            </v-icon>
            <v-icon v-else size="16" start>mdi-account-plus</v-icon>
            {{ player }}
          </v-chip>
        </div>

        <v-divider class="mb-3" />

        <div class="d-flex gap-2 align-center">
          <v-text-field
            v-model="newPlayerName"
            class="flex-grow-1"
            density="compact"
            hide-details
            maxlength="20"
            placeholder="Gastspieler hinzufügen…"
            rounded="lg"
            variant="outlined"
            @keyup.enter="addPlayer"
          />
          <v-btn
            color="teal"
            :disabled="!newPlayerName.trim() || allPlayers.includes(newPlayerName.trim())"
            icon
            rounded="lg"
            size="default"
            variant="flat"
            @click="addPlayer"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Buttons -->
    <v-btn
      block
      class="mb-3 py-4"
      color="primary"
      :disabled="selectedPlayers.length < 2"
      :loading="isAnimating === 'randomize'"
      rounded="xl"
      size="x-large"
      @click="randomize"
    >
      <v-icon start>mdi-shuffle-variant</v-icon>
      Zufällig verteilen
    </v-btn>

    <v-btn
      block
      class="mb-5 py-4"
      color="amber-darken-2"
      :disabled="selectedPlayers.length === 0"
      :loading="isAnimating === 'grabgame'"
      rounded="xl"
      size="x-large"
      @click="grabgame"
    >
      <v-icon start>mdi-skull</v-icon>
      Grabgame
    </v-btn>

    <div
      v-if="selectedPlayers.length < 2 && selectedPlayers.length > 0 && !isAnimating"
      class="text-center text-caption text-medium-emphasis mb-4"
    >
      Mindestens 2 Spieler für Zufällig verteilen
    </div>

    <!-- Result -->
    <Transition name="slide-up">
      <div v-if="lanes.left.length > 0 || lanes.right.length > 0">
        <div class="text-overline text-medium-emphasis text-center mb-3">Einteilung</div>

        <!-- Single lane (grabgame or ≤3 players) -->
        <template v-if="lastMode === 'single'">
          <v-card :color="lastAction === 'grabgame' ? 'amber-darken-4' : 'surface-variant'" elevation="0" rounded="xl">
            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-center mb-3">
                <span class="text-h6 mr-2">{{ lastAction === 'grabgame' ? '💀' : (singleLane === 'left' ? '⬅️' : '➡️')
                }}</span>
                <div>
                  <div
                    class="text-caption font-weight-bold"
                    :class="lastAction === 'grabgame' ? 'text-amber-lighten-2' : (singleLane === 'left' ? 'text-blue-lighten-2' : 'text-purple-lighten-2')"
                  >
                    {{ lastAction === 'grabgame' ? 'GRABGAME' : (singleLane === 'left' ? 'LINKE BAHN' : 'RECHTE BAHN')
                    }}
                  </div>
                </div>
              </div>
              <TransitionGroup name="player-list" tag="div">
                <v-card
                  v-for="(player, i) in activeLanePlayers"
                  :key="player"
                  class="mb-2 player-card"
                  :color="lastAction === 'grabgame' ? 'amber-darken-3' : (singleLane === 'left' ? 'blue-darken-4' : 'purple-darken-4')"
                  elevation="0"
                  rounded="lg"
                >
                  <v-card-text class="pa-2 px-3">
                    <div class="d-flex align-center">
                      <v-avatar
                        class="mr-2"
                        :color="lastAction === 'grabgame' ? 'amber-darken-1' : (singleLane === 'left' ? 'blue-darken-2' : 'purple-darken-2')"
                        size="28"
                      >
                        <span class="text-caption font-weight-bold text-black">{{ i + 1 }}</span>
                      </v-avatar>
                      <span class="text-body-2 font-weight-medium text-capitalize">{{ player }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </TransitionGroup>
            </v-card-text>
          </v-card>
        </template>

        <!-- Split lanes -->
        <template v-else>
          <v-row class="gap-3" no-gutters>
            <!-- Left Lane -->
            <v-col cols="6">
              <v-card class="h-100" color="surface-variant" elevation="0" rounded="xl">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center mb-3">
                    <span class="text-h6 mr-2">⬅️</span>
                    <div class="text-caption font-weight-bold text-blue-lighten-2">LINKE BAHN</div>
                  </div>
                  <TransitionGroup name="player-list" tag="div">
                    <v-card
                      v-for="player in lanes.left"
                      :key="player"
                      class="mb-2 player-card"
                      color="blue-darken-4"
                      elevation="0"
                      rounded="lg"
                    >
                      <v-card-text class="pa-2 px-3">
                        <div class="d-flex align-center">
                          <v-avatar class="mr-2" color="blue-darken-2" size="28">
                            <span class="text-caption font-weight-bold">{{ player.charAt(0).toUpperCase() }}</span>
                          </v-avatar>
                          <span class="text-body-2 font-weight-medium text-capitalize">{{ player }}</span>
                        </div>
                      </v-card-text>
                    </v-card>
                  </TransitionGroup>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Right Lane -->
            <v-col cols="6">
              <v-card class="h-100" color="surface-variant" elevation="0" rounded="xl">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center mb-3">
                    <span class="text-h6 mr-2">➡️</span>
                    <div class="text-caption font-weight-bold text-purple-lighten-2">RECHTE BAHN</div>
                  </div>
                  <TransitionGroup name="player-list" tag="div">
                    <v-card
                      v-for="player in lanes.right"
                      :key="player"
                      class="mb-2 player-card"
                      color="purple-darken-4"
                      elevation="0"
                      rounded="lg"
                    >
                      <v-card-text class="pa-2 px-3">
                        <div class="d-flex align-center">
                          <v-avatar class="mr-2" color="purple-darken-2" size="28">
                            <span class="text-caption font-weight-bold">{{ player.charAt(0).toUpperCase() }}</span>
                          </v-avatar>
                          <span class="text-body-2 font-weight-medium text-capitalize">{{ player }}</span>
                        </div>
                      </v-card-text>
                    </v-card>
                  </TransitionGroup>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </div>
    </Transition>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue'

  const defaultPlayers = ['Coach', 'BM', 'Legende', 'Highko', 'El Tomas', 'Doc']
  const allPlayers = ref<string[]>([...defaultPlayers])
  const customPlayers = ref(new Set<string>())
  const newPlayerName = ref('')

  const selectedPlayers = ref<string[]>([...defaultPlayers])
  const isAnimating = ref<'randomize' | 'grabgame' | null>(null)
  const lastMode = ref<'split' | 'single' | null>(null)
  const lastAction = ref<'randomize' | 'grabgame' | null>(null)
  const singleLane = ref<'left' | 'right'>('left')

  const lanes = reactive<{ left: string[], right: string[] }>({
    left: [],
    right: [],
  })

  const activeLanePlayers = computed(() =>
    singleLane.value === 'left' ? lanes.left : lanes.right,
  )

  function togglePlayer (player: string) {
    const idx = selectedPlayers.value.indexOf(player)
    if (idx === -1) {
      selectedPlayers.value.push(player)
    } else {
      selectedPlayers.value.splice(idx, 1)
    }
  }

  function addPlayer () {
    const name = newPlayerName.value.trim()
    if (!name || allPlayers.value.includes(name)) return
    allPlayers.value.push(name)
    customPlayers.value.add(name)
    selectedPlayers.value.push(name)
    newPlayerName.value = ''
  }

  function removeCustomPlayer (player: string) {
    allPlayers.value = allPlayers.value.filter(p => p !== player)
    customPlayers.value.delete(player)
    selectedPlayers.value = selectedPlayers.value.filter(p => p !== player)
  }

  function shuffle<T> (arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = a[i] as T
      a[i] = a[j] as T
      a[j] = tmp
    }
    return a
  }

  async function randomize () {
    isAnimating.value = 'randomize'
    lanes.left = []
    lanes.right = []

    await new Promise(r => setTimeout(r, 400))

    const shuffled = shuffle(selectedPlayers.value)
    lastAction.value = 'randomize'

    if (selectedPlayers.value.length <= 3) {
      lastMode.value = 'single'
      singleLane.value = Math.random() < 0.5 ? 'left' : 'right'
      if (singleLane.value === 'left') {
        lanes.left = shuffled
      } else {
        lanes.right = shuffled
      }
    } else {
      lastMode.value = 'split'
      const half = Math.ceil(shuffled.length / 2)
      lanes.left = shuffled.slice(0, half)
      lanes.right = shuffled.slice(half)
    }

    isAnimating.value = null
  }

  async function grabgame () {
    isAnimating.value = 'grabgame'
    lanes.left = []
    lanes.right = []

    await new Promise(r => setTimeout(r, 400))

    const shuffled = shuffle(selectedPlayers.value)
    lastAction.value = 'grabgame'
    lastMode.value = 'single'
    singleLane.value = Math.random() < 0.5 ? 'left' : 'right'

    if (singleLane.value === 'left') {
      lanes.left = shuffled
    } else {
      lanes.right = shuffled
    }

    isAnimating.value = null
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

.player-card {
  transition: all 0.3s ease;
}

/* slide-up transition */
.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

/* player-list transition */
.player-list-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.player-list-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
