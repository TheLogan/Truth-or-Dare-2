import { useAtom, useAtomValue } from "jotai";
import { tCard } from "../types";
import { MAX_CARDS_IN_GAME } from "./cardLimits";
import { randomRange } from "./randomRange";
import {
  brandCategory,
  drinkOrStrip,
  newOld,
  getDirection,
  getLeastMost,
  getTitle,
  oneOrTwoPieces,
  wordEnding,
  youngOld,
} from "./randomizers";
import {
  cardsSinceLastSpecialAtom,
  currentCardAtom,
  deckAtom,
  discardPileAtom,
  endLevelAtom,
  startLevelAtom,
  startTimeAtom,
  timeBetweenLevelsAtom,
} from "../Jotai/Game";

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const initialShuffle = (cards: tCard[]) => {
  const cardArr: tCard[] = [];
  cards.forEach((card) => {
    // Clamp so a bad value already stored in the database can't freeze the game.
    const copies = Math.min(
      Math.max(Math.floor(card.cards_in_game) || 0, 0),
      MAX_CARDS_IN_GAME,
    );
    for (let i = 0; i < copies; i++) {
      cardArr.push(card);
    }
  });
  const shuffledDeck: tCard[] = shuffleCards(cardArr);
  return shuffledDeck;
};

// Fisher-Yates: O(n), returns a new array and leaves the input untouched.
export const shuffleCards = (cards: tCard[]) => {
  const shuffledDeck = [...cards];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

export const getRotation = () => {
  const rot = randomRange(0, 360);
  return rot + 360 * randomRange(3, 6);
};

export const getCurrentLevel = (
  startTime: number,
  startLevel: number,
  endLevel: number,
  timeBetweenLevels: number,
) => {
  const currentTime = new Date().getTime();
  const elapsedMs = currentTime - startTime;
  const perLevelInMs = timeBetweenLevels * 60 * 1000;

  let currentLevel = Math.floor(elapsedMs / perLevelInMs) + startLevel;
  if (currentLevel > endLevel) currentLevel = endLevel;
  return currentLevel;
};

export const formatCardText = (description: string) => {
  const rangeReg = /\*\d+@\d+\*/g;

  let descr = description;
  const ranges = descr.match(rangeReg);
  if (ranges) {
    for (const ra of ranges) {
      let str = ra.replace("*", "");
      str = str.replace("*", "");
      const [min, max] = str.split("@");
      descr = descr.replace(
        ra,
        Math.round(randomRange(Number(min), Number(max))).toString(),
      );
    }
  }

  descr = descr.replaceAll("*12pieces*", oneOrTwoPieces());
  descr = descr.replaceAll("*direction*", getDirection());
  descr = descr.replaceAll("*wordEnding*", wordEnding());
  descr = descr.replaceAll("*title*", getTitle());
  descr = descr.replaceAll("*youngOld*", youngOld());
  descr = descr.replaceAll("*newOld*", newOld());
  descr = descr.replaceAll("*leastMost*", getLeastMost());
  descr = descr.replaceAll("*drinkStrip*", drinkOrStrip());
  const [brandName, category] = brandCategory();
  descr = descr.replaceAll("*brandName*", brandName);
  descr = descr.replaceAll("*category*", category);
  // Turn literal "\n" sequences into real line breaks (rendered via white-space: pre-line)
  descr = descr.replaceAll("\\n", "\n");
  return descr;
};

export const useNextCard = () => {
  const [deck, setDeck] = useAtom(deckAtom);
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  const [discardPile, setDiscardPile] = useAtom(discardPileAtom);
  const startTime = useAtomValue(startTimeAtom);
  const startLevel = useAtomValue(startLevelAtom);
  const endLevel = useAtomValue(endLevelAtom);
  const timeBetweenLevels = useAtomValue(timeBetweenLevelsAtom);
  const [cardsSinceLastSpecial, setCardsSinceLastSpecial] = useAtom(
    cardsSinceLastSpecialAtom,
  );

  const nextCard = (val: "truth" | "dare") => {
    const currentLevel = getCurrentLevel(
      startTime,
      startLevel,
      endLevel,
      timeBetweenLevels || 3,
    );
    const findIndex = (localDeck: tCard[]) =>
      localDeck.findIndex(
        (x) =>
          (x.card_type === val ||
            (x.card_type === "special" && cardsSinceLastSpecial > 4)) &&
          x.level <= currentLevel,
      );
    let selectedIndex = -1;
    let attempts = 0;

    let tempDeck = [...deck];
    let tempDiscard = [...discardPile];

    while (selectedIndex < 0 && attempts < 5) {
      selectedIndex = findIndex(tempDeck);
      if (selectedIndex < 0) {
        // Everything goes back into the deck, so the discard pile starts empty.
        tempDeck = shuffleCards([...discardPile, ...deck]);
        tempDiscard = [];
      }
      attempts++;
    }

    if (selectedIndex < 0) throw new Error("card index is less than 0");

    const discarded = tempDeck.splice(0, selectedIndex);
    const selected = tempDeck.splice(0, 1)[0];
    if (currentCard) tempDiscard.push(currentCard); // currentCard should already be discarded, can this introduce duplicates?
    tempDiscard.push(...discarded);

    if (selected.card_type === "special") setCardsSinceLastSpecial(0);
    else setCardsSinceLastSpecial(cardsSinceLastSpecial + 1);

    setDeck(tempDeck);
    setCurrentCard(selected);
    setDiscardPile(tempDiscard);
  };
  return nextCard;
};

export const useDiscardSelected = () => {
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  const [discardPile, setDiscardPile] = useAtom(discardPileAtom);

  const discardSelected = () => {
    if (!currentCard) return;
    setDiscardPile([...discardPile, currentCard]);
    setCurrentCard(null);
  };
  return discardSelected;
};

/* IDEAS */
// Countdown function
