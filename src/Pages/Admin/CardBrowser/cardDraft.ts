import type { tCard } from "../../../types";

export type CardDraft = Omit<tCard, "card_id"> & { card_id?: number };

export const emptyCard: CardDraft = {
  content: "",
  cards_in_game: 1,
  spin_bottle: false,
  card_type: "truth",
  level: 0,
  avoid: false,
};
