<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-btn
        v-if="view !== 'home'"
        icon="mdi-arrow-left"
        @click="view = 'home'"
      />
      <v-app-bar-title>
        <v-icon icon="mdi-bowling" class="mr-2" />
        <span class="d-none d-sm-inline">Bowling Abend</span>
      </v-app-bar-title>
      <template #append>
        <v-btn icon="mdi-theme-light-dark" @click="$vuetify.theme.cycle()" />
        <template v-if="view === 'tracker'">
          <v-btn icon="mdi-glass-cocktail" variant="text" class="d-sm-none" @click="manageDrinksOpen = true" />
          <v-btn prepend-icon="mdi-glass-cocktail" variant="text" class="d-none d-sm-flex" @click="manageDrinksOpen = true">Posten</v-btn>
          <v-btn icon="mdi-account-plus" color="primary" variant="tonal" class="d-sm-none mr-1" @click="addPlayerOpen = true" />
          <v-btn prepend-icon="mdi-account-plus" color="primary" variant="tonal" class="d-none d-sm-flex mr-2" @click="addPlayerOpen = true">Spieler</v-btn>
        </template>
      </template>
    </v-app-bar>

    <v-main>
      <HomeView
        v-if="view === 'home'"
        :has-active-session="players.length > 0"
        :player-count="players.length"
        @new-session="startNewSession"
        @continue-session="view = 'tracker'"
        @history="view = 'history'"
        @randomizer="view = 'randomizer'"
      />
      <TrackerView
        v-else-if="view === 'tracker'"
        @open-add-player="addPlayerOpen = true"
      />
      <HistoryView v-else-if="view === 'history'" />
      <RandomizerView v-else-if="view === 'randomizer'" />
    </v-main>

    <v-footer v-if="view === 'tracker' && players.length > 0" elevation="1">
      <v-btn
        prepend-icon="mdi-refresh"
        variant="text"
        color="error"
        @click="confirmReset = true"
      >
        Session zurücksetzen
      </v-btn>
      <v-spacer />
      <v-btn
        prepend-icon="mdi-receipt-text-outline"
        color="secondary"
        variant="tonal"
        class="mr-2"
        @click="openAbrechnung"
      >
        Abrechnung erstellen
      </v-btn>
      <v-btn
        prepend-icon="mdi-content-save-outline"
        color="primary"
        variant="tonal"
        @click="saveSession"
      >
        Abend speichern
      </v-btn>
    </v-footer>

    <AddPlayerDialog v-model="addPlayerOpen" />
    <ManageDrinksDialog v-model="manageDrinksOpen" />

    <v-dialog v-model="confirmReset" max-width="360">
      <v-card rounded="lg">
        <v-card-title class="pa-4 pb-2">Session zurücksetzen?</v-card-title>
        <v-card-text class="pa-4 pt-0 text-body-2">
          Alle Spieler und ihre Getränke werden gelöscht. Die Posten bleiben erhalten.
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="confirmReset = false">Abbrechen</v-btn>
          <v-btn color="error" variant="tonal" @click="doReset">Zurücksetzen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="abrechnungOpen" max-width="500">
      <v-card rounded="lg">
        <v-card-title class="pa-4 pb-2">Abrechnung</v-card-title>
        <v-card-text class="pa-4 pt-0">
          <v-textarea
            :model-value="abrechnungText"
            readonly
            variant="outlined"
            rows="12"
            hide-details
            font-family="monospace"
            style="font-family: monospace"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-btn variant="text" @click="abrechnungOpen = false">Schließen</v-btn>
          <v-spacer />
          <v-btn
            prepend-icon="mdi-content-copy"
            color="primary"
            variant="tonal"
            @click="copyAbrechnung"
          >
            Copy to Clipboard
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="saveSnackbar" :timeout="3000" color="info">
      Backend-Anbindung folgt — Abend wurde noch nicht gespeichert.
    </v-snackbar>

    <v-snackbar v-model="copySnackbar" :timeout="2000" color="success">
      Abrechnung kopiert!
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDrinkTracker } from '@/composables/useDrinkTracker'
  import AddPlayerDialog from '@/components/AddPlayerDialog.vue'
  import ManageDrinksDialog from '@/components/ManageDrinksDialog.vue'
  import HomeView from '@/views/HomeView.vue'
  import TrackerView from '@/views/TrackerView.vue'
  import HistoryView from '@/views/HistoryView.vue'
  import RandomizerView from '@/views/RandomizerView.vue'

  type View = 'home' | 'tracker' | 'history' | 'randomizer'

  const { players, drinkTypes, resetSession } = useDrinkTracker()

  const view = ref<View>('home')
  const addPlayerOpen = ref(false)
  const manageDrinksOpen = ref(false)
  const confirmReset = ref(false)
  const saveSnackbar = ref(false)
  const abrechnungOpen = ref(false)
  const abrechnungText = ref('')
  const copySnackbar = ref(false)

  function startNewSession() {
    resetSession()
    view.value = 'tracker'
  }

  function doReset() {
    resetSession()
    confirmReset.value = false
  }

  function saveSession() {
    // TODO: POST to backend
    saveSnackbar.value = true
  }

  function openAbrechnung() {
    const lines: string[] = []
    for (const player of players.value) {
      lines.push(`${player.name}:`)
      for (const drinkType of drinkTypes.value) {
        const count = player.drinks[drinkType.id] ?? 0
        if (count === 0) continue
        const total = drinkType.price * count
        const formatted = total.toFixed(2).replace('.', ',') + '€'
        lines.push(`  ${formatted} ${drinkType.name} x${count}`)
      }
      lines.push('')
    }
    abrechnungText.value = lines.join('\n').trimEnd()
    abrechnungOpen.value = true
  }

  async function copyAbrechnung() {
    await navigator.clipboard.writeText(abrechnungText.value)
    copySnackbar.value = true
  }
</script>

<style>
html, body {
  overflow-x: hidden;
}
</style>
