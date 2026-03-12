<template>
  <v-dialog v-model="open" max-width="480">
    <v-card rounded="lg">
      <v-card-title class="pa-4 pb-2">Posten verwalten</v-card-title>

      <v-card-text class="pa-4 pt-0">
        <div
          v-for="drinkType in drinkTypes"
          :key="drinkType.id"
          class="d-flex align-center gap-2 mb-2"
        >
          <span class="text-body-2 flex-grow-1">{{ drinkType.name }}</span>
          <v-text-field
            :model-value="drinkType.price"
            type="number"
            min="0"
            step="0.1"
            prefix="€"
            variant="outlined"
            density="compact"
            hide-details
            style="max-width: 100px"
            @update:model-value="updateDrinkPrice(drinkType.id, parseFloat(String($event)) || 0)"
          />
          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            density="compact"
            color="error"
            @click="removeDrinkType(drinkType.id)"
          />
        </div>

        <p v-if="drinkTypes.length === 0" class="text-disabled text-body-2 mb-2">
          Noch keine Posten
        </p>

        <v-divider class="my-3" />

        <div class="d-flex gap-2">
          <v-text-field
            v-model="newName"
            label="Name"
            variant="outlined"
            density="compact"
            hide-details
            @keyup.enter="add"
          />
          <v-text-field
            v-model.number="newPrice"
            type="number"
            min="0"
            step="0.1"
            prefix="€"
            label="Preis"
            variant="outlined"
            density="compact"
            hide-details
            style="max-width: 100px"
            @keyup.enter="add"
          />
          <v-btn
            icon="mdi-plus"
            color="primary"
            variant="tonal"
            :disabled="!newName.trim()"
            @click="add"
          />
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="tonal" @click="open = false">Fertig</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDrinkTracker } from '@/composables/useDrinkTracker'

  const open = defineModel<boolean>({ default: false })

  const { drinkTypes, addDrinkType, updateDrinkPrice, removeDrinkType } = useDrinkTracker()
  const newName = ref('')
  const newPrice = ref(0)

  function add() {
    if (!newName.value.trim()) return
    addDrinkType(newName.value.trim(), newPrice.value || 0)
    newName.value = ''
    newPrice.value = 0
  }
</script>
