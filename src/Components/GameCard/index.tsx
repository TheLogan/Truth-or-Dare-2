import React, { useEffect, useState } from "react";
import { eCardState, iCard } from './interfaces'
import bottle from '../../Assets/img/wine-bottle.png';
import './style.scss'
import BottleRotation from "../../FX/BottleRotation";
import Draggable from "../../FX/Draggable";
import { formatCardText, getRotation, randomRange } from "../../utils/utils";

const GameCard = React.forwardRef<HTMLDivElement, iCard>((props, ref) => {
  const [descriptiveText, setDescriptiveText] = useState('');
  const [rotation] = useState(getRotation());
  const [timing] = useState(randomRange(2, 3) * 1000);

  useEffect(() => {
    props.onCardStateChange?.(props.card.spin_bottle ? eCardState.bottleNotSpun : eCardState.done);
    setDescriptiveText(formatCardText(props.card.content));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(!props.card.spin_bottle) return;
    console.log('Card state', props.cardState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  function renderBottle() {
    if (props.card.spin_bottle === false || !props.cardState || !props.onCardStateChange) return <></>;

    return (
      <div id="bottleWrapper">
        <BottleRotation
          cardState={props.cardState}
          rotationPoint={{deg: rotation, ms: timing}}
          onDone={() => props.onCardStateChange && props.onCardStateChange(eCardState.done)}
        >
          <img id="bottle" src={bottle} alt="bottle" draggable={false}
            onClick={() => props.onCardStateChange?.(eCardState.bottleSpinning)}
          />
        </BottleRotation>
      </div>
    )
  }

  const cardExit = () => props.cardExit && props.cardExit();

  function renderBody() {
    const card = (
      <div className={"gameCard " + props.card.card_type} onClick={() => props.onClick && props.onClick(props.card)}>
        <div className={"content " + props.card.card_type} >
          <p>{descriptiveText}</p>
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