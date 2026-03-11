<template>
  <v-card elevation="2" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between pa-3 pb-1">
      <span class="text-h6">{{ player.name }}</span>
      <div class="d-flex align-center gap-2">
        <v-chip color="primary" size="small" label>
          {{ totalDrinks }} Getränke
        </v-chip>
        <v-chip color="success" size="small" label>
          {{ formatCost(totalCost) }}
        </v-chip>
        <v-btn
          icon="mdi-close"
          variant="text"
          density="compact"
          color="error"
          @click="$emit('remove')"
        />
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-2">
      <div
        v-for="drinkType in drinkTypes"
        :key="drinkType.id"
        class="d-flex align-center justify-space-between py-1 px-1"
      >
        <span class="text-body-2 flex-grow-1">{{ drinkType.name }}</span>
        <div class="d-flex align-center gap-1">
          <v-btn
            icon="mdi-minus"
            variant="tonal"
            density="compact"
            size="small"
            :disabled="!player.drinks[drinkType.id]"
            @click="decrement(player.id, drinkType.id)"
          />
          <span class="text-body-1 font-weight-bold mx-1" style="min-width: 1.5rem; text-align: center">
            {{ player.drinks[drinkType.id] ?? 0 }}
          </span>
          <v-btn
            icon="mdi-plus"
            variant="tonal"
            density="compact"
            size="small"
            color="primary"
            @click="increment(player.id, drinkType.id)"
          />
        </div>
      </div>

      <div v-if="drinkTypes.length === 0" class="text-center text-disabled text-body-2 py-2">
        Keine Getränketypen konfiguriert
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import type { Player, DrinkType } from '@/types'
  import { useDrinkTracker } from '@/composables/useDrinkTracker'

  const props = defineProps<{
    player: Player
    drinkTypes: DrinkType[]
  }>()

  defineEmits<{ remove: [] }>()

  const { increment, decrement } = useDrinkTracker()

  const totalDrinks = computed(() =>
    Object.values(props.player.drinks).reduce((sum, n) => sum + n, 0),
  )

  const totalCost = computed(() =>
    props.drinkTypes.reduce(
      (sum, dt) => sum + (props.player.drinks[dt.id] ?? 0) * (dt.price ?? 0),
      0,
    ),
  )

  function formatCost(value: number) {
    return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
  }
</script>
