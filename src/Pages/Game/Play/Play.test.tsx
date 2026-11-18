// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import {
  cardsAtom,
  cardsSinceLastSpecialAtom,
  currentCardAtom,
  deckAtom,
  discardPileAtom,
  endLevelAtom,
  resetGameAtom,
  startTimeAtom,
} from "../../../Jotai/Game";
import type { tCard } from "../../../types";
import Play from ".";

const makeCard = (card_id: number, card_type: tCard["card_type"], level = 0, cards_in_game = 1): tCard => ({
  card_id,
  card_type,
  cards_in_game,
  content: `card ${card_id}`,
  level,
  spin_bottle: false,
});

const sixAndSix = () => [
  ...[1, 2, 3, 4, 5, 6].map((id) => makeCard(id, "truth")),
  ...[7, 8, 9, 10, 11, 12].map((id) => makeCard(id, "dare")),
];

function renderPlay(setupStore?: (store: ReturnType<typeof createStore>) => void) {
  const store = createStore();
  setupStore?.(store);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/game/play"]}>
        <Routes>
          <Route path="/game/play" element={<Play />} />
          <Route path="/game/setup" element={<div>setup page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

const button = (name: "Truth" | "Dare") => screen.getByRole("button", { name }) as HTMLButtonElement;

afterEach(cleanup);

describe("resetGameAtom", () => {
  it("clears the per-game state but keeps the loaded cards", () => {
    const store = createStore();
    const cards = sixAndSix();
    store.set(cardsAtom, cards);
    store.set(deckAtom, cards);
    store.set(discardPileAtom, cards);
    store.set(currentCardAtom, cards[0]);
    store.set(cardsSinceLastSpecialAtom, 4);

    store.set(resetGameAtom);

    expect(store.get(deckAtom)).toEqual([]);
    expect(store.get(discardPileAtom)).toEqual([]);
    expect(store.get(currentCardAtom)).toBeNull();
    expect(store.get(cardsSinceLastSpecialAtom)).toBe(0);
    expect(store.get(cardsAtom)).toEqual(cards);
  });
});

describe("Play page", () => {
  it("redirects to setup when the game was never started (refresh or direct link)", () => {
    renderPlay((store) => store.set(cardsAtom, sixAndSix()));
    expect(screen.getByText("setup page")).toBeTruthy();
  });

  it("builds the deck from the loaded cards and enables the buttons", () => {
    const store = renderPlay((s) => {
      s.set(cardsAtom, sixAndSix());
      s.set(startTimeAtom, Date.now());
    });

    expect(store.get(deckAtom)).toHaveLength(12);
    expect(screen.getByText("Truth or Dare")).toBeTruthy();
    expect(button("Truth").disabled).toBe(false);
    expect(button("Dare").disabled).toBe(false);
  });

  it("starts every game from a clean slate (no leftovers from the previous game)", () => {
    const cards = sixAndSix();
    const store = renderPlay((s) => {
      s.set(cardsAtom, cards);
      s.set(startTimeAtom, Date.now());
      // leftovers from a previous game
      s.set(discardPileAtom, cards.slice(0, 5));
      s.set(currentCardAtom, cards[0]);
      s.set(cardsSinceLastSpecialAtom, 3);
    });

    expect(store.get(discardPileAtom)).toEqual([]);
    expect(store.get(currentCardAtom)).toBeNull();
    expect(store.get(cardsSinceLastSpecialAtom)).toBe(0);
    expect(store.get(deckAtom)).toHaveLength(12);
    // no stuck card from the last game, so the buttons work
    expect(button("Truth").disabled).toBe(false);
  });

  it("disables the buttons until cards arrive, then builds the deck", () => {
    const store = renderPlay((s) => s.set(startTimeAtom, Date.now()));

    expect(screen.getByText("No cards loaded yet")).toBeTruthy();
    expect(button("Truth").disabled).toBe(true);
    expect(button("Dare").disabled).toBe(true);
    expect(store.get(deckAtom)).toEqual([]);

    // the card fetch finishes after the page mounted
    act(() => store.set(cardsAtom, sixAndSix()));

    expect(store.get(deckAtom)).toHaveLength(12);
    expect(screen.getByText("Truth or Dare")).toBeTruthy();
    expect(button("Truth").disabled).toBe(false);
  });

  it("draws a card of the requested type and disables the buttons while it is showing", () => {
    const store = renderPlay((s) => {
      s.set(cardsAtom, sixAndSix());
      s.set(startTimeAtom, Date.now());
    });

    fireEvent.click(button("Truth"));

    expect(store.get(currentCardAtom)?.card_type).toBe("truth");
    expect(button("Truth").disabled).toBe(true);
    expect(button("Dare").disabled).toBe(true);
  });

  it("shows a message instead of failing silently when no card fits the level", () => {
    const store = renderPlay((s) => {
      // only a level 3 truth exists, but the game is capped at level 1
      s.set(cardsAtom, [makeCard(1, "truth", 3), makeCard(2, "dare", 0)]);
      s.set(endLevelAtom, 1);
      s.set(startTimeAtom, Date.now());
    });

    fireEvent.click(button("Truth"));

    expect(screen.getByText("No truth card available at this level")).toBeTruthy();
    expect(store.get(currentCardAtom)).toBeNull();
    expect(button("Truth").disabled).toBe(false);
  });

  it("clears the message after a successful draw", () => {
    renderPlay((s) => {
      s.set(cardsAtom, [makeCard(1, "truth", 3), makeCard(2, "dare", 0)]);
      s.set(endLevelAtom, 1);
      s.set(startTimeAtom, Date.now());
    });

    fireEvent.click(button("Truth"));
    expect(screen.getByText("No truth card available at this level")).toBeTruthy();

    fireEvent.click(button("Dare"));
    expect(screen.queryByText("No truth card available at this level")).toBeNull();
  });
});
