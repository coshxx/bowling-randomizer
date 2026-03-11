export interface DrinkType {
  id: string
  name: string
  price: number
}

export interface Player {
  id: string
  name: string
  drinks: Record<string, number>
}

export interface Session {
  players: Player[]
  drinkTypes: DrinkType[]
}
