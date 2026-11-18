import { describe, expect, it } from "vitest";
import { initialShuffle } from "./utils";
import { validateCard } from "./cardLimits";

const valid = { content: "Say *5@10* things", level: 1, cards_in_game: 2 };

describe("validateCard", () => {
  it("accepts a valid card", () => {
    expect(validateCard(valid)).toEqual({});
  });

  it.each([-1, 4, 1.5, NaN])("rejects level %s", (level) => {
    expect(validateCard({ ...valid, level }).level).toBeDefined();
  });

  it.each([0, -3, 21, 1000000, 2.5, NaN])("rejects cards_in_game %s", (n) => {
    expect(validateCard({ ...valid, cards_in_game: n }).cards_in_game).toBeDefined();
  });

  it("rejects empty content and reversed ranges", () => {
    expect(validateCard({ ...valid, content: "  " }).content).toBeDefined();
    expect(validateCard({ ...valid, content: "Do *10@5* pushups" }).content).toBeDefined();
    expect(validateCard({ ...valid, content: "Do *5@5* pushups" }).content).toBeUndefined();
  });
});

describe("initialShuffle", () => {
  it("clamps an absurd cards_in_game from the database", () => {
    const deck = initialShuffle([
      { card_id: 1, card_type: "truth", content: "x", level: 0, spin_bottle: false, cards_in_game: 1e9 },
    ]);
    expect(deck.length).toBe(20);
  });
});
