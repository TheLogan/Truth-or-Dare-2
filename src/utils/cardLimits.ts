export const MIN_LEVEL = 0;
export const MAX_LEVEL = 3;
export const MIN_CARDS_IN_GAME = 1;
export const MAX_CARDS_IN_GAME = 20;

export interface CardValidationErrors {
  level?: string;
  cards_in_game?: string;
  content?: string;
}

interface Validatable {
  content: string;
  level: number;
  cards_in_game: number;
}

// Matches the *min@max* random-number placeholder used by formatCardText.
const rangePlaceholder = /\*(\d+)@(\d+)\*/g;

export const validateCard = (card: Validatable): CardValidationErrors => {
  const errors: CardValidationErrors = {};

  if (!Number.isInteger(card.level) || card.level < MIN_LEVEL || card.level > MAX_LEVEL) {
    errors.level = `Must be a whole number from ${MIN_LEVEL} to ${MAX_LEVEL}`;
  }

  if (
    !Number.isInteger(card.cards_in_game) ||
    card.cards_in_game < MIN_CARDS_IN_GAME ||
    card.cards_in_game > MAX_CARDS_IN_GAME
  ) {
    errors.cards_in_game = `Must be a whole number from ${MIN_CARDS_IN_GAME} to ${MAX_CARDS_IN_GAME}`;
  }

  if (!card.content.trim()) {
    errors.content = "Content is required";
  } else {
    for (const [placeholder, min, max] of card.content.matchAll(rangePlaceholder)) {
      if (Number(min) > Number(max)) {
        errors.content = `${placeholder}: the minimum must not be greater than the maximum`;
        break;
      }
    }
  }

  return errors;
};
