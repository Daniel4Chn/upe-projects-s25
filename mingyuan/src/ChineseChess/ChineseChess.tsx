import { useState, useEffect } from "react";
import Board from "./Board.js";
import starting from "./starting";
import "./ChineseChess.css";
import { State, Team, Piece, Coord, NPiece } from "./types.js";
import Confetti from "react-confetti";

function updateDimensions() {
  let mult = 0.7;
  if (window.innerWidth < 640) {
    mult = 0.9;
  } else if (window.innerWidth < 1007) {
    mult = 0.8;
  }

  let width = window.innerWidth * mult - ((window.innerWidth * mult) % 9);
  width = Math.max(Math.min(width, 900), 380);
  return {
    width: width,
    height: (width / 9) * 10,
  };
}

function ChineseChess() {
  const [history, setHistory] = useState([
    { state: starting, move: { row: -1, col: -1 } },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [won, setWon] = useState(false);
  const [dimensions, setDimensions] = useState(updateDimensions());

  // --- for the undoing of moves ---
  const moves = history.map(({ state, move }, num) => {
    let description;
    if (num > 0) {
      description =
        "#" +
        num +
        ` ${num % 2 === 1 ? " Red's " : " Black's "}` +
        state[move.row][move.col]!.id +
        ` moved to row:${move.row} col:${move.col}`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={num}>
        <button
          onClick={() => {
            setCurrentMove(num);
            setWon(false);
          }}
        >
          {description}
        </button>
      </li>
    );
  });

  const redTurn: boolean = currentMove % 2 === 0;
  const currState = history[currentMove].state;
  const redPieces: Piece[] = currState.flatMap((row: NPiece[]): NPiece[] =>
    row.filter((piece: NPiece): boolean => piece?.team === Team.red)
  ) as Piece[];
  const blackPieces: Piece[] = currState.flatMap((row: NPiece[]): NPiece[] =>
    row.filter((piece: NPiece): boolean => piece?.team === Team.black)
  ) as Piece[];
  const nextTurn = (state: State, move: Coord) => {
    setHistory((hist) => [
      ...hist.slice(0, currentMove + 1),
      { state: state, move: move },
    ]);
    // Could have error here
    setCurrentMove((c) => c + 1);
  };

  // for responsive design
  useEffect(() => {
    function handleResize() {
      setDimensions(updateDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  const size = dimensions.height / 20;
  const reactive = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    margin: "10px 0px",
    backgroundSize: `${dimensions.width - 2 * size}px ${
      dimensions.height - 2 * size
    }px`,
    backgroundPosition: `${size}px ${size}px`,
  };

  return (
    <>
      <main className="game-area">
        {won && <Confetti />}
        <div className="game-board">
          <h1 className="game-turn">
            {`Turn ${currentMove}, `}
            {won
              ? redTurn
                ? "Black has won!"
                : "Red has won!"
              : redTurn
              ? "Red's turn"
              : "Black's turn"}
            {won && <br />}
            {won ? "Press go to game start to restart" : ""}
          </h1>
          <div className="game-main">
            <div className="game-container" style={reactive}>
              <Board
                state={currState}
                won={won}
                setWon={setWon}
                redTurn={redTurn}
                redPieces={redPieces}
                blackPieces={blackPieces}
                toggleTurn={nextTurn}
              />
            </div>
            <div
              className="game-stats"
              style={{
                width:
                  window.innerWidth < 1007
                    ? dimensions.width
                    : window.innerWidth * 0.9 - dimensions.width,
                height: dimensions.height,
              }}
            >
              <h2 className="game-moves">Move List</h2>
              <ol>{moves}</ol>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ChineseChess;
