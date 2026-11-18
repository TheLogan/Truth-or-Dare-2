import { eCardState } from "../Components/GameCard/interfaces";

export interface iBottleRotation {
  cardState: eCardState;
  rotationPoint: {deg: number, ms: number};
  onDone: () => void;
}


export interface iDraggable {
  cardExit: () => void;
}