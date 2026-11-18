import { forwardRef, useEffect, useState } from "react";
import { eCardState, iCard } from './interfaces'
import bottle from '../../assets/img/wine-bottle.png';
import './style.scss'
import BottleRotation from "../../FX/BottleRotation";
import Draggable from "../../FX/Draggable";
import { formatCardText, getRotation } from "../../utils/utils";
import { randomRange } from "../../utils/randomRange";

// Card text ranges from a few words to ~150 characters, so scale the type to fit.
const textSize = (length: number) => {
  if (length <= 30) return "xs";
  if (length <= 60) return "sm";
  if (length <= 100) return "md";
  return "lg";
};

const GameCard = forwardRef<HTMLDivElement, iCard>((props, ref) => {
  const [descriptiveText, setDescriptiveText] = useState('');
  const [rotation] = useState(getRotation);
  const [timing] = useState(() => randomRange(2, 3) * 1000);

  useEffect(() => {
    props.onCardStateChange?.(props.card.spin_bottle ? eCardState.bottleNotSpun : eCardState.done);
    setDescriptiveText(formatCardText(props.card.content));
    // oxlint-disable-next-line react/exhaustive-deps
  }, []);

  function renderBottle() {
    if (props.card.spin_bottle === false || !props.cardState || !props.onCardStateChange) return <></>;

    return (
      <div id="bottleWrapper">
        <BottleRotation
          cardState={props.cardState}
          rotationPoint={{ deg: rotation, ms: timing }}
          onDone={() => props.onCardStateChange && props.onCardStateChange(eCardState.done)}
        >
          <img id="bottle" src={bottle} alt="bottle" draggable={false}
            onClick={() => {
              if (props.cardState !== eCardState.bottleSpinning && props.cardState !== eCardState.done) {
                props.onCardStateChange?.(eCardState.bottleSpinning);
              }
            }}
          />
        </BottleRotation>
      </div>
    )
  }

  const cardExit = () => props.cardExit && props.cardExit();

  function renderBody() {
    const card = (
      <div className={"gameCard " + props.card.card_type + (props.card.spin_bottle ? " hasBottle" : "")} onClick={() => props.onClick && props.onClick(props.card)}>
        <div className={"content " + props.card.card_type} >
          <p className={"size-" + textSize(descriptiveText.length)}>{descriptiveText}</p>
        </div>
        {renderBottle()}
      </div>
    )

    if (props.draggable) {
      if (props.card.spin_bottle === false || props.cardState === eCardState.done)
        return <Draggable cardExit={cardExit}>{card}</Draggable>
    }
    return card;
  }


  return (
    <div ref={ref}>
      {renderBody()}
    </div>
  );
})

export default GameCard;