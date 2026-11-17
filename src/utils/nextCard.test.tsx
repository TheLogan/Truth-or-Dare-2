// @vitest-environment jsdom
import { createElement, type ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";
import { tCard } from "../types";
import { currentCardAtom, deckAtom, discardPileAtom } from "../Jotai/Game";
import { initialShuffle, useDiscardSelected, useNextCard } from "./utils";

const makeCard = (card_id: number, card_type: tCard["card_type"], cards_in_game = 1): tCard => ({
  card_id,
  card_type,
  cards_in_game,
  content: `card ${card_id}`,
  level: 0,
  spin_bottle: false,
});

// 6 truths + 6 dares, all level 0 (the default game level when nothing is set up).
const baseCards = (cards_in_game = 1) => [
  ...[1, 2, 3, 4, 5, 6].map((id) => makeCard(id, "truth", cards_in_game)),
  ...[7, 8, 9, 10, 11, 12].map((id) => makeCard(id, "dare", cards_in_game)),
];

const idCounts = (cards: (tCard | null)[]) => {
  const counts: Record<number, number> = {};
  cards.forEach((c) => {
    if (c) counts[c.card_id] = (counts[c.card_id] ?? 0) + 1;
  });
  return counts;
};

function setup(cards: tCard[]) {
  const store = createStore();
  store.set(deckAtom, initialShuffle([...cards]));
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(Provider, { store }, children);
  const { result } = renderHook(
    () => ({ nextCard: useNextCard(), discardSelected: useDiscardSelected() }),
    { wrapper }
  );
  // Everything that exists in the game right now: deck + discard pile + the card on the table.
  const allInPlay = () => [
    ...store.get(deckAtom),
    ...store.get(discardPileAtom),
    store.get(currentCardAtom),
  ];
  return { store, result, allInPlay, expected: idCounts(initialShuffle([...cards])) };
}

describe("nextCard / reshuffle", () => {
  it("never duplicates or loses cards over many draws, including reshuffles", () => {
    const { result, allInPlay, expected } = setup(baseCards());

    for (let i = 0; i < 60; i++) {
      act(() => result.current.nextCard(i % 2 === 0 ? "truth" : "dare"));
      // the UI disables the buttons until the current card is swiped away
      act(() => result.current.discardSelected());
      expect(idCounts(allInPlay()), `after draw ${i + 1}`).toEqual(expected);
    }
  });

  it("keeps the card counts right when cards_in_game > 1", () => {
    const { result, allInPlay, expected } = setup(baseCards(3));
    expect(Object.values(expected).every((n) => n === 3)).toBe(true);

    for (let i = 0; i < 80; i++) {
      act(() => result.current.nextCard(i % 3 === 0 ? "dare" : "truth"));
      act(() => result.current.discardSelected());
      expect(idCounts(allInPlay()), `after draw ${i + 1}`).toEqual(expected);
    }
  });

  it("reshuffles when the deck has no card of the requested type left", () => {
    // deck contains only dares, so asking for a truth must reshuffle the discard pile in
    const cards = baseCards();
    const { store, result, allInPlay, expected } = setup(cards);
    store.set(deckAtom, cards.filter((c) => c.card_type === "dare"));
    store.set(discardPileAtom, cards.filter((c) => c.card_type === "truth"));

    act(() => result.current.nextCard("truth"));

    expect(store.get(currentCardAtom)?.card_type).toBe("truth");
    expect(idCounts(allInPlay())).toEqual(expected);
  });

  it("does not duplicate the current card if nextCard is called before it is discarded", () => {
    // The UI normally prevents this (buttons are disabled while a card is shown),
    // but the code explicitly handles a non-null currentCard.
    const { result, allInPlay, expected } = setup(baseCards());

    act(() => result.current.nextCard("truth"));
    act(() => result.current.nextCard("dare"));
    act(() => result.current.nextCard("truth"));

    expect(idCounts(allInPlay())).toEqual(expected);
  });

  it("does not draw the same card twice in a row within one pass of the deck", () => {
    const { store, result } = setup(baseCards());
    const seen: number[] = [];
    // 6 truths available: the first 6 truth draws must all be different
    for (let i = 0; i < 6; i++) {
      act(() => result.current.nextCard("truth"));
      seen.push(store.get(currentCardAtom)!.card_id);
      act(() => result.current.discardSelected());
    }
    expect(new Set(seen).size).toBe(6);
  });
});
