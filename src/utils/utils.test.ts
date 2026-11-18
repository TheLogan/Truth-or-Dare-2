import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { tCard } from "../types";
import {
  capitalizeFirstLetter,
  formatCardText,
  getCurrentLevel,
  initialShuffle,
  shuffleCards,
} from "./utils";

const makeCard = (card_id: number, cards_in_game = 1): tCard => ({
  card_id,
  card_type: "truth",
  cards_in_game,
  content: `card ${card_id}`,
  level: 0,
  spin_bottle: false,
});

describe("capitalizeFirstLetter", () => {
  it("capitalizes the first letter only", () => {
    expect(capitalizeFirstLetter("truth")).toBe("Truth");
    expect(capitalizeFirstLetter("tRUTH")).toBe("TRUTH");
  });

  it("handles an empty string", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });
});

describe("shuffleCards", () => {
  it("returns a permutation and leaves the input untouched", () => {
    const input = [1, 2, 3, 4, 5, 6].map((id) => makeCard(id));
    const snapshot = [...input];

    const result = shuffleCards(input);

    expect(result).not.toBe(input);
    expect(input).toEqual(snapshot);
    expect(result.map((c) => c.card_id).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("handles empty and single-card decks", () => {
    expect(shuffleCards([])).toEqual([]);
    const only = makeCard(1);
    expect(shuffleCards([only])).toEqual([only]);
  });
});

describe("initialShuffle", () => {
  const counts = (cards: tCard[]) => {
    const result: Record<number, number> = {};
    cards.forEach((c) => (result[c.card_id] = (result[c.card_id] ?? 0) + 1));
    return result;
  };

  it("puts cards_in_game copies of each card in the deck", () => {
    const deck = initialShuffle([makeCard(1, 1), makeCard(2, 3), makeCard(3, 2)]);
    expect(counts(deck)).toEqual({ 1: 1, 2: 3, 3: 2 });
  });

  it("does not modify the cards it is given", () => {
    const cards = [makeCard(1, 2), makeCard(2, 2)];
    initialShuffle(cards);
    expect(cards).toHaveLength(2);
  });

  it("adds no copies for zero, negative or non-numeric counts", () => {
    const deck = initialShuffle([makeCard(1, 0), makeCard(2, -4), makeCard(3, NaN), makeCard(4, 1)]);
    expect(counts(deck)).toEqual({ 4: 1 });
  });

  it("rounds fractional counts down", () => {
    expect(initialShuffle([makeCard(1, 2.9)])).toHaveLength(2);
  });

  it("caps an absurd count so a bad database row can't freeze the game", () => {
    expect(initialShuffle([makeCard(1, 1e9)])).toHaveLength(20);
  });

  it("returns an empty deck for no cards", () => {
    expect(initialShuffle([])).toEqual([]);
  });
});

describe("getCurrentLevel", () => {
  const MIN = 60 * 1000;
  let start: number;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    start = Date.now();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const levelAfter = (minutes: number, startLevel = 0, endLevel = 3, perLevel = 3) => {
    vi.setSystemTime(start + minutes * MIN);
    return getCurrentLevel(start, startLevel, endLevel, perLevel);
  };

  it("starts at the start level", () => {
    expect(levelAfter(0)).toBe(0);
    expect(levelAfter(0, 2)).toBe(2);
  });

  it("goes up one level every timeBetweenLevels minutes", () => {
    expect(levelAfter(2.9)).toBe(0);
    expect(levelAfter(3)).toBe(1);
    expect(levelAfter(6)).toBe(2);
    expect(levelAfter(9)).toBe(3);
  });

  it("adds the elapsed levels on top of a higher start level", () => {
    expect(levelAfter(3, 1)).toBe(2);
  });

  it("never goes above the end level", () => {
    expect(levelAfter(600)).toBe(3);
    expect(levelAfter(600, 0, 1)).toBe(1);
  });

  it("respects a custom time between levels", () => {
    expect(levelAfter(4.9, 0, 3, 5)).toBe(0);
    expect(levelAfter(5, 0, 3, 5)).toBe(1);
  });

  it("jumps straight to the end level when the start time was never set (0)", () => {
    // This is why the Play page redirects to setup when startTime is 0.
    expect(getCurrentLevel(0, 0, 2, 3)).toBe(2);
  });
});

describe("formatCardText", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // randomRange(min, max) uses Math.random: 0 gives min, just under 1 gives max.
  const lowest = () => vi.spyOn(Math, "random").mockReturnValue(0);
  const highest = () => vi.spyOn(Math, "random").mockReturnValue(0.999999);

  it("returns plain text unchanged", () => {
    expect(formatCardText("Tell us a secret")).toBe("Tell us a secret");
  });

  it("replaces *min@max* with a number inside the range", () => {
    lowest();
    expect(formatCardText("Do *5@10* pushups")).toBe("Do 5 pushups");
    vi.restoreAllMocks();
    highest();
    expect(formatCardText("Do *5@10* pushups")).toBe("Do 10 pushups");
  });

  it("handles a range where min equals max", () => {
    expect(formatCardText("Do *7@7* pushups")).toBe("Do 7 pushups");
  });

  it("rolls each range placeholder separately", () => {
    lowest();
    expect(formatCardText("*1@9* and *20@30*")).toBe("1 and 20");
  });

  it("replaces *direction* with left or right", () => {
    lowest();
    expect(formatCardText("Pass *direction*")).toBe("Pass left");
    vi.restoreAllMocks();
    highest();
    expect(formatCardText("Pass *direction*")).toBe("Pass right");
  });

  it("uses the same value for a placeholder that appears twice", () => {
    for (let i = 0; i < 30; i++) {
      expect(formatCardText("*direction* then *direction*")).toMatch(/^(left then left|right then right)$/);
    }
  });

  it("replaces every known placeholder", () => {
    const text =
      "*12pieces* *direction* *wordEnding* *title* *youngOld* *newOld* *leastMost* *drinkStrip* *brandName* *category* *bodyPart* *duration* *accent* *musicGenre* *3@4*";
    for (let i = 0; i < 100; i++) {
      expect(formatCardText(text)).not.toContain("*");
    }
  });

  it("leaves unknown placeholders alone", () => {
    expect(formatCardText("Hello *nonsense*")).toBe("Hello *nonsense*");
  });

  it("turns literal backslash-n into a real line break", () => {
    expect(formatCardText("line one\\nline two")).toBe("line one\nline two");
  });
});
