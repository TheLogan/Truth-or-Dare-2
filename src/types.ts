export interface tCard {
  card_id: number,
  content:string,
  cards_in_game: number,
  spin_bottle: boolean,
  card_type: 'truth' | 'dare' | 'special',
  level: number,
  // Secret per-owner filter: skipped on draws made after arming the hidden button.
  avoid?: boolean,
}