export type Unit =
  | "Soldier"
  | "Cannon"
  | "Chariot"
  | "Horse"
  | "Elephant"
  | "Advisor"
  | "General";

export enum Team {
  black = "black",
  red = "red",
}

export interface Piece {
  id: string;
  type: Unit;
  img: String;
  team: Team;
  row: number;
  col: number;
}

export type NPiece = Piece | null;

export type State = NPiece[][];

export interface Coord {
  row: number;
  col: number;
}

export interface IBox {
  box: NPiece;
  redTurn: boolean;
  isMoveable: boolean;
  isMoving: Coord;
  isChecked: boolean;
  movePiece: () => void;
}

export interface IBoard {
  state: State;
  won: boolean;
  setWon: Function;
  redTurn: boolean;
  redPieces: Piece[];
  blackPieces: Piece[];
  toggleTurn: (state: State, move: Coord) => void;
}
