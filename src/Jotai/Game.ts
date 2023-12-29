import { atom } from 'jotai'
import { tCard } from '../types';

export const cardsAtom = atom<tCard[]>([]);

export const deckAtom = atom<tCard[]>([]);
export const currentCardAtom = atom<tCard | null>(null);
export const discardPileAtom = atom<tCard[]>([]);


export const startLevelAtom = atom(0);
export const endLevelAtom = atom(0);
export const startTimeAtom = atom(0);
export const timeBetweenLevelsAtom = atom(0);
export const cardsSinceLastSpecialAtom = atom(0);