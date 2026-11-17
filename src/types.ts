export interface tCard {
  card_id: number,
  content:string,
  cards_in_game: number,
  spin_bottle: boolean,
  card_type: 'truth' | 'dare' | 'special',
  level: number,
}