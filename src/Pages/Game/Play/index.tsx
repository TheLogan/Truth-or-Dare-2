import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import GameCard from "../../../Components/GameCard";
import { eCardState } from "../../../Components/GameCard/interfaces";
import { capitalizeFirstLetter, initialShuffle, useDiscardSelected, useNextCard } from "../../../utils/utils";
import "./style.scss";
import { useAtomValue, useSetAtom } from "jotai";
import { Navigate } from "react-router-dom";
import { cardsAtom, currentCardAtom, deckAtom, resetGameAtom, startTimeAtom } from "../../../Jotai/Game";

const Play = () => {
  const allCards = useAtomValue(cardsAtom);
  const startTime = useAtomValue(startTimeAtom);
  const setDeck = useSetAtom(deckAtom);
  const resetGame = useSetAtom(resetGameAtom);
  const currentCard = useAtomValue(currentCardAtom);
  const [cardState, setCardState] = useState<eCardState>(eCardState.unTouched);
  const [notice, setNotice] = useState("");
  const nextCard = useNextCard();
  const discardSelected = useDiscardSelected();

  useEffect(() => {
    // Start every game from a clean slate, and (re)build the deck whenever the
    // card list changes - it may still be loading when this page mounts.
    resetGame();
    setDeck(initialShuffle(allCards));
  }, [allCards, resetGame, setDeck]);

  // startTime is only set by the setup page, so it is 0 after a refresh or a direct link.
  if (startTime === 0) return <Navigate to="/game/setup" replace />;

  const noCards = allCards.length === 0;

  const draw = (category: "truth" | "dare") => {
    try {
      nextCard(category);
      setNotice("");
    } catch {
      setNotice(`No ${category} card available at this level`);
    }
  };

  function renderBtn(category: "truth" | "dare") {
    return (
      <Button
        variant="contained"
        id={category}
        className="btn"
        onClick={() => draw(category)}
        disabled={currentCard != null || noCards}
      >
        {capitalizeFirstLetter(category)}
      </Button>
    );
  }

  const gameState = () => {
    if (noCards) return "No cards loaded yet";
    if (currentCard === null) return notice || "Truth or Dare";
    if (cardState === eCardState.bottleNotSpun) return "Click bottle";
    if (cardState === eCardState.done) return "Swipe card";
    return "...";
  };

  function renderBody() {
    return (
      <>
        <Stack
          direction="column"
          sx={{ width: '100vw', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {renderBtn("truth")}
          <h3 id="or">Or</h3>
          {renderBtn("dare")}
        </Stack>
        {currentCard && (
          <div
            style={{
              position: "absolute",
              left: "calc(50vw - 118px)",
              top: "calc(50vh - 207px)",
            }}
          >
            <GameCard
              card={currentCard}
              draggable
              cardExit={discardSelected}
              cardState={cardState}
              onCardStateChange={setCardState}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div id="helperText">{gameState()}</div>
      {renderBody()}
    </>
  );
};

export default Play;
