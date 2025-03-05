import { useState } from "react";
import Box from "./Box.js";
import findMoves from "./util";
import { IBoard, Coord, Piece, State } from "./types.js";

// --- these functions will be replaced via api call ---
/**
 *  Calculate possible moves for a given state
 *  @param {Piece[]} pieces start index
 *  @param {State} state end index
 *  @param {Piece[]} pieces start index
 *  @returns {Map<Piece, Array<Array<number>>>} A map of the piece to its possible safe moves
 */
function calMoves(
  pieces: Piece[],
  state: State,
  otherTeam: Piece[]
): Map<Piece, Array<Array<number>>> {
  const moves = new Map<Piece, Array<Array<number>>>();
  pieces.map((piece) =>
    moves.set(piece, findMoves(state, piece, pieces, otherTeam))
  );
  return moves;
}

const isChecked: (Piece: Piece, posMoves: Map<Piece, number[][]>) => boolean = (
  piece,
  posMoves
) => {
  for (let [_, value] of posMoves) {
    for (let arr of value) {
      if (arr[0] == piece.row && arr[1] == piece.col) {
        return true;
      }
    }
  }
  return false;
};

const hasWon = (
  General: Piece,
  posMoveOwn: Map<Piece, number[][]>,
  posMovesOppo: Map<Piece, number[][]>
) => {
  for (let [_, value] of posMoveOwn) {
    if (value.length != 0) {
      return false;
    }
  }
  return isChecked(General, posMovesOppo);
};

/**
 *  Generate an empty 10 by 9 array of false to pass into the boxes
 *  @returns {boolean[][]}
 */
const moveables: () => boolean[][] = () =>
  Array(10)
    .fill(null)
    .map(() => Array(9).fill(false));

function Board({
  state,
  won,
  setWon,
  redTurn,
  redPieces,
  blackPieces,
  toggleTurn,
}: IBoard) {
  const negCoord: Coord = { row: -1, col: -1 };
  const [moving, setMoving] = useState({ row: -1, col: -1 });
  const [moveable, setMovable] = useState(Array(10).fill(Array(9).fill(false)));

  let posMoveRed = calMoves(redPieces, state, blackPieces);
  let posMoveBlack = calMoves(blackPieces, state, redPieces);

  // --- checking for checks ---
  const redGeneral = redPieces.find((x) => x.type == "General")!;
  const blackGeneral = blackPieces.find((x) => x.type == "General")!;

  const _isChecked = redTurn
    ? isChecked(redGeneral, posMoveBlack)
    : isChecked(blackGeneral, posMoveRed);

  if (
    _isChecked &&
    hasWon(
      !redTurn ? blackGeneral : redGeneral,
      !redTurn ? posMoveBlack : posMoveRed,
      !redTurn ? posMoveRed : posMoveBlack
    )
  ) {
    setWon(true);
  }
  // --- checking for win ---

  /**
   *  Processes the piece being moved
   *  @param {number} row the row of the box being clicked
   *  @param {number} col the column of the box being clicked
   */
  function movePiece(row: number, col: number) {
    if (won) {
      return;
    }
    // ----- if havent started to move -----

    if (moving.row == -1) {
      //  type casting is safe as only pieces are clickable if havent move
      const currPiece: Piece = state[row][col] as Piece;
      const moves = redTurn
        ? posMoveRed.get(currPiece)
        : posMoveBlack.get(currPiece);
      const posMoves: boolean[][] = moveables();
      moves!.map((move) => (posMoves[move[0]][move[1]] = true));
      setMovable(posMoves);
      setMoving({ row: row, col: col });
      return;
    }

    // ------ if have moved -------

    const currPiece = state[row][col];
    // movPiece isnt null, checked in first if statement
    const movPiece = state[moving.row][moving.col];

    // if player wants to turn of moving
    if (row == moving.row && col == moving.col) {
      setMoving(negCoord);
      setMovable(Array(10).fill(Array(9).fill(false)));
      return;
    }

    // to view move of another tile of same team
    if (currPiece && movPiece!.team == currPiece.team) {
      const moves = redTurn
        ? posMoveRed.get(currPiece)
        : posMoveBlack.get(currPiece);
      const posMoves: boolean[][] = moveables();
      moves!.map((move) => (posMoves[move[0]][move[1]] = true));
      setMovable(posMoves);
      setMoving({ row: row, col: col });
      return;
    }
    // to move to position
    const newState = state.map((arr) => arr.slice());
    newState[row][col] = { ...movPiece!, row: row, col: col };
    newState[moving.row][moving.col] = null;
    toggleTurn(newState, { row: row, col: col });
    setMoving(negCoord);
    setMovable(Array(10).fill(Array(9).fill(false)));
  }
  const tmp = [...Array(9).keys()];
  return (
    <>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`0${x}`}
            box={state[0][x]}
            redTurn={redTurn}
            isMoveable={moveable[0][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(0, x)}
          />
        ))}
      </div>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`1${x}`}
            box={state[1][x]}
            redTurn={redTurn}
            isMoveable={moveable[1][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(1, x)}
          />
        ))}
      </div>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`2${x}`}
            box={state[2][x]}
            redTurn={redTurn}
            isMoveable={moveable[2][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(2, x)}
          />
        ))}
      </div>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`3${x}`}
            box={state[3][x]}
            redTurn={redTurn}
            isMoveable={moveable[3][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(3, x)}
          />
        ))}
      </div>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`4${x}`}
            box={state[4][x]}
            redTurn={redTurn}
            isMoveable={moveable[4][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(4, x)}
          />
        ))}
      </div>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`5${x}`}
            box={state[5][x]}
            redTurn={redTurn}
            isMoveable={moveable[5][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(5, x)}
          />
        ))}
      </div>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`6${x}`}
            box={state[6][x]}
            redTurn={redTurn}
            isMoveable={moveable[6][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(6, x)}
          />
        ))}
      </div>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`7${x}`}
            box={state[7][x]}
            redTurn={redTurn}
            isMoveable={moveable[7][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(7, x)}
          />
        ))}
      </div>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`8${x}`}
            box={state[8][x]}
            redTurn={redTurn}
            isMoveable={moveable[8][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(8, x)}
          />
        ))}
      </div>
      <div className="game-row">
        {tmp.map((x) => (
          <Box
            key={`9${x}`}
            box={state[9][x]}
            redTurn={redTurn}
            isMoveable={moveable[9][x]}
            isMoving={moving}
            isChecked={_isChecked}
            movePiece={() => movePiece(9, x)}
          />
        ))}
      </div>
    </>
  );
}

export default Board;
