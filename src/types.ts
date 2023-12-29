export interface tCard {
  id: number,
  content:string,
  cards_in_game: number,
  spin_bottle: boolean,
  card_type: 'truth' | 'dare' | 'special',
  level: number,
}