import { CSSProperties, useEffect } from "react";
import { eCardState } from "../Components/GameCard/interfaces";
import { iBottleRotation } from "./interfaces";

interface iProps extends iBottleRotation {
  children: React.ReactNode;
}

const BottleRotation = (props: iProps) => {

  useEffect(() => {
    if (props.cardState !== eCardState.bottleSpinning) return;
    console.log("Starting the rotation");
    console.log("rotPoint", props.rotationPoint);
    setTimeout(() => {
      props.onDone();
      console.log("The rotation has stopped");
    }, props.rotationPoint.ms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cardState]);

  const style: CSSProperties = {
    display: "inline-block",
    backfaceVisibility: "hidden",
    transform: props.cardState < 2 ? `rotate(0deg)` : `rotate(${props.rotationPoint.deg}deg)`,
    transition: `transform ${props.rotationPoint.ms}ms`,
    width: "100%",
  };

  return <span style={style}>{props.children}</span>;
};

export default BottleRotation;
