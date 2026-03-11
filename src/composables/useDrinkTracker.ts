import { ref, watch } from 'vue'
import type { DrinkType, Player, Session } from '@/types'

const STORAGE_KEY = 'bowling-recorder-session'

const DEFAULT_DRINK_TYPES: DrinkType[] = [
  { id: 'bier', name: 'Bier', price: 3.5 },
  { id: 'wasser', name: 'Wasser', price: 1.5 },
  { id: 'cola', name: 'Cola', price: 2.5 },
  { id: 'radler', name: 'Radler', price: 3.0 },
]

function loadSession(): Session {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: Session = JSON.parse(raw)
      // migrate: ensure all drinkTypes have a price
      parsed.drinkTypes = parsed.drinkTypes.map(d => ({ ...d, price: d.price ?? 0 }))
      return parsed
    }
  } catch {
    // ignore
  }
  return { players: [], drinkTypes: [...DEFAULT_DRINK_TYPES] }
}

const session = loadSession()
const players = ref<Player[]>(session.players)
const drinkTypes = ref<DrinkType[]>(session.drinkTypes)

watch(
  [players, drinkTypes],
  () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ players: players.value, drinkTypes: drinkTypes.value }),
    )
  },
  { deep: true },
)

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function addPlayer(name: string) {
  players.value.push({ id: uuid(), name, drinks: {} })
}

function removePlayer(id: string) {
  players.value = players.value.filter(p => p.id !== id)
}

function increment(playerId: string, drinkTypeId: string) {
  const player = players.value.find(p => p.id === playerId)
  if (!player) return
  player.drinks[drinkTypeId] = (player.drinks[drinkTypeId] ?? 0) + 1
}

function decrement(playerId: string, drinkTypeId: string) {
  const player = players.value.find(p => p.id === playerId)
  if (!player) return
  const current = player.drinks[drinkTypeId] ?? 0
  if (current <= 0) return
  player.drinks[drinkTypeId] = current - 1
}

function addDrinkType(name: string, price: number = 0) {
  drinkTypes.value.push({ id: uuid(), name, price })
}

function removeDrinkType(id: string) {
  drinkTypes.value = drinkTypes.value.filter(d => d.id !== id)
  for (const player of players.value) {
    delete player.drinks[id]
  }
}

function resetSession() {
  players.value = []
}

export function useDrinkTracker() {
  return {
    players,
    drinkTypes,
    addPlayer,
    removePlayer,
    increment,
    decrement,
    addDrinkType,
    removeDrinkType,
    resetSession,
  }
}
