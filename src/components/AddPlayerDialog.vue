<template>
  <v-dialog v-model="open" max-width="400">
    <v-card rounded="lg">
      <v-card-title class="pa-4 pb-2">Spieler hinzufügen</v-card-title>
      <v-card-text class="pa-4 pt-2">
        <v-text-field
          v-model="name"
          label="Name"
          variant="outlined"
          autofocus
          clearable
          @keyup.enter="submit"
        />
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="open = false">Abbrechen</v-btn>
        <v-btn color="primary" variant="tonal" :disabled="!name.trim()" @click="submit">
          Hinzufügen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDrinkTracker } from '@/composables/useDrinkTracker'

  const open = defineModel<boolean>({ default: false })

  const { addPlayer } = useDrinkTracker()
  const name = ref('')

  function submit() {
    if (!name.value.trim()) return
    addPlayer(name.value.trim())
    name.value = ''
    open.value = false
  }
</script>
