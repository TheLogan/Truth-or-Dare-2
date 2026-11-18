import { atom } from "jotai";
import { tCard } from "../types";

export const cardsAtom = atom<tCard[]>([]);

export const deckAtom = atom<tCard[]>([]);
export const currentCardAtom = atom<tCard | null>(null);
export const discardPileAtom = atom<tCard[]>([]);

export const startLevelAtom = atom(0);
export const endLevelAtom = atom(1);
export const startTimeAtom = atom(0);
export const timeBetweenLevelsAtom = atom(3);
export const cardsSinceLastSpecialAtom = atom(0);

// Clears all per-game state (not the settings or the loaded card list).
export const resetGameAtom = atom(null, (_get, set) => {
  set(deckAtom, []);
  set(discardPileAtom, []);
  set(currentCardAtom, null);
  set(cardsSinceLastSpecialAtom, 0);
});
