import { tCard } from "../../types";

export interface iCard {
  card: tCard;
  draggable?: boolean;
  onClick?: (card: tCard) => void;
  cardExit?: () => void;
  cardState?: eCardState;
  onCardStateChange?: (state: eCardState) => void;
}

export enum eCardState {unTouched, bottleNotSpun, bottleSpinning, done}