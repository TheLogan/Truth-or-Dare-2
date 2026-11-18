import { useEffect, type CSSProperties, type ReactNode } from "react";
import { eCardState } from "../Components/GameCard/interfaces";
import { iBottleRotation } from "./interfaces";

interface iProps extends iBottleRotation {
  children: ReactNode;
}

const BottleRotation = (props: iProps) => {

  useEffect(() => {
    if (props.cardState !== eCardState.bottleSpinning) return;
    const timeoutId = window.setTimeout(() => {
      props.onDone();
    }, props.rotationPoint.ms);
    return () => {
      window.clearTimeout(timeoutId);
    };
    // oxlint-disable-next-line react/exhaustive-deps
  }, [props.cardState]);

  const style: CSSProperties = {
    display: "inline-block",
    backfaceVisibility: "hidden",
    transform: props.cardState < eCardState.bottleSpinning ? `rotate(0deg)` : `rotate(${props.rotationPoint.deg}deg)`,
    transition: `transform ${props.rotationPoint.ms}ms`,
    width: "100%",
  };

  return <span style={style}>{props.children}</span>;
};

export default BottleRotation;
