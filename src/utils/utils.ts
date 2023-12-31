import { useAtom, useAtomValue } from "jotai";
import { tCard } from "../types";
import {
  brandCategory,
  drinkOrStrip,
  getAge,
  getDirection,
  getLeastMost,
  getTitle,
  oneOrTwoPieces,
  wordEnding,
} from "./randomizers";
import { cardsSinceLastSpecialAtom, currentCardAtom, deckAtom, discardPileAtom, endLevelAtom, startLevelAtom, startTimeAtom, timeBetweenLevelsAtom } from "../Jotai/Game";

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const randomRange = (min: number = 0, max: number = 10) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const initialShuffle = (cards: tCard[]) => {
  const cardArr: tCard[] = [];
  cards.forEach((card) => {
    for (let i = 0; i < card.cards_in_game; i++) {
      cardArr.push(card);
    }
  });
  const shuffledDeck: tCard[] = shuffleCards(cardArr);
  return shuffledDeck;
};

export const shuffleCards = (cards: tCard[]) => {
  const shuffledDeck: tCard[] = [];
  while (cards.length > 0) {
    const index = Math.floor(Math.random() * cards.length);
    shuffledDeck.push(...cards.splice(index, 1));
  }
  return shuffledDeck;
};

export const getRotation = () => {
  const rot = randomRange(0, 360);
  return rot + 360 * randomRange(3, 6);
};

export const getCurrentLevel = (startTime: number, startLevel: number, endLevel: number, timeBetweenLevels: number) => {
  const currentTime = new Date().getTime();
  const elapsedMs = (currentTime - startTime);
  const perLevelInMs = timeBetweenLevels * 60 * 1000;

  let currentLevel = Math.floor(elapsedMs / perLevelInMs) + startLevel;
  if (currentLevel > endLevel) currentLevel = endLevel;
  return currentLevel;
}

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
        Math.round(randomRange(Number(min), Number(max))).toString()
      );
    }
  }

  descr = descr.replaceAll("*12pieces*", oneOrTwoPieces());
  descr = descr.replaceAll("*direction*", getDirection());
  descr = descr.replaceAll("*wordEnding*", wordEnding());
  descr = descr.replaceAll("*title*", getTitle());
  descr = descr.replaceAll("*youngOld*", getAge());
  descr = descr.replaceAll("*leastMost*", getLeastMost());
  descr = descr.replaceAll("*drinkStrip*", drinkOrStrip());
  const [brandName, category] = brandCategory();
  descr = descr.replaceAll("*brandName*", brandName);
  descr = descr.replaceAll("*category*", category);
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
  const [cardsSinceLastSpecial, setCardsSinceLastSpecial] = useAtom(cardsSinceLastSpecialAtom);

  const nextCard = (val: "truth" | "dare") => {
    let selected: null | tCard = null;
    const currentLevel = getCurrentLevel(startTime, startLevel, endLevel, timeBetweenLevels || 3);
    const findIndex = (localDeck: tCard[]) => localDeck.findIndex(x => (x.card_type === val || (x.card_type === 'special' && cardsSinceLastSpecial > 4)) && x.level <= currentLevel);
    let selectedIndex = -1;
    let attempts = 0;

    let tempDeck = [...deck];
    let tempDiscard = [...discardPile];

    while (selectedIndex < 0 && attempts < 5) {
      selectedIndex = findIndex(tempDeck);
      if (selectedIndex < 0) {
        tempDiscard = [...discardPile, ...deck];
        tempDeck = shuffleCards(tempDiscard);

        console.log('shuffling');
      }
      attempts++;
    }

    if (selectedIndex < 0) throw new Error('card index is less than 0');

    const discarded = tempDeck.splice(0, selectedIndex);
    selected = tempDeck.splice(0, 1)[0];
    if (currentCard) tempDiscard.push(currentCard); // currentCard should already be discarded, can this introduce duplicates?
    tempDiscard.push(...discarded);

    if (selected.card_type === 'special') setCardsSinceLastSpecial(0);
    else setCardsSinceLastSpecial(cardsSinceLastSpecial + 1);

    setDeck(tempDeck);
    setCurrentCard(selected);
    setDiscardPile(tempDiscard);
  }
  return nextCard;
}

export const useDiscardSelected = () => {
  const [currentCard, setCurrentCard] = useAtom(currentCardAtom);
  const [discardPile, setDiscardPile] = useAtom(discardPileAtom);

  const discardSelected = () => {
    if (!currentCard) return;
    setDiscardPile([...discardPile, currentCard]);
    setCurrentCard(null);
  }
  return discardSelected;
}

/* IDEAS */
// Countdown function
