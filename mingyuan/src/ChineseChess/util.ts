import { Piece, State, Team } from "./types";

/**
 *  Generates an array from the range start to end
 *  @param {number} start start index
 *  @param {number} end end index
 *  @returns {Array<number>} the move in question
 */
const arrayRange = (start: number, end: number) =>
  [...Array(end - start + 1).keys()].map((i) => i + start);

/**
 *  Checks if the move is valid, ie within the board and does not move into a friendly troop
 *  @param {State} state current state of the game
 *  @param {Team} team current Team of the moving Piece
 *  @param {number} row row of the move
 *  @param {number} col col of the move
 *  @returns {boolean} true or false depending if it is a valid move
 */
const isValid = (state: State, team: Team, row: number, col: number) => {
  if (row < 0 || row > 9) {
    return false;
  }
  if (col < 0 || col > 8) {
    return false;
  }
  if (state[row][col]?.team == team) {
    return false;
  }
  return true;
};

/**
 *  Checks if a move would result in a check of your own general
 *  @param {State} state current state of the game
 *  @param {Piece} piece the piece making the move
 *  @param {Array<number>} Move the move in question
 *  @param {Piece[]} ownTeam Pieces of the current team moving
 *  @param {Piece[]} otherTeam Oppposing team currently moving
 *  @returns {boolean} true or false depending if it causes a check
 */
function causeCheck(
  state: State,
  piece: Piece,
  move: Array<number>,
  ownTeam: Piece[],
  otherTeam: Piece[]
): boolean {
  const newState = state.map((arr) => arr.slice());

  newState[piece.row][piece.col] = null;
  otherTeam = otherTeam.filter((x) => x != newState[move[0]][move[1]]);
  newState[move[0]][move[1]] = { ...piece, row: move[0], col: move[1] };
  // assertion is safe as ownTeam will always have a general
  let general: Piece = ownTeam.find((x) => x.type == "General") as Piece;
  if (general === undefined) {
    throw ErrorEvent;
  }
  if (piece.type == "General") {
    general = newState[move[0]][move[1]]!;
  }

  const targetPices = ["Elephant", "Advisor"];
  for (let p of otherTeam) {
    if (targetPices.includes(p.type)) {
      continue;
    }
    let outcome: boolean = true;

    switch (p.type) {
      // if a solider is currently checking the general
      case "Soldier":
        outcome = !findMoveSoldier(newState, p).find(
          (move) => move[0] == general.row && move[1] == general.col
        );
        break;
      case "Chariot":
        outcome = !findMoveChariot(newState, p).find(
          (move) => move[0] == general.row && move[1] == general.col
        );
        break;
      case "Horse":
        outcome = !findMoveHorse(newState, p).find(
          (move) => move[0] == general.row && move[1] == general.col
        );
        break;
      case "Cannon":
        outcome = !findMoveCannon(newState, p).find(
          (move) => move[0] == general.row && move[1] == general.col
        );
        break;
      case "General":
        if (
          general.col == p.col &&
          arrayRange(
            Math.min(general.row, p.row),
            Math.max(general.row, p.row)
          ).filter((r) => newState[r][p.col]).length == 2
        ) {
          outcome = false;
        }
        break;
    }

    if (!outcome) {
      return outcome;
    }
  }
  return true;
}

/**
 *  Finds possible moves based on the piece type
 *  @param {State} state current state of the game
 *  @param {Piece} piece the piece making the move
 *  @returns {Array<Array<number>>} an array of possible moves
 */
function findMoveChariot(state: State, piece: Piece): Array<Array<number>> {
  const r: Piece[] = [],
    c: Piece[] = [];
  for (let row = 0; row < state.length; row++) {
    for (let col = 0; col < state[0].length; col++) {
      if (state[row][col] === null) {
        continue;
      }
      // ! is used as i have checked is not null above
      if (row == piece.row) {
        r.push(state[row][col]!);
      }
      if (col == piece.col) {
        c.push(state[row][col]!);
      }
    }
  }
  const moves: Array<Array<number>> = [];
  function helper(isRow: boolean, arr: Piece[], idx: number) {
    const axis = isRow ? piece.row : piece.col;
    const [start, end] = [idx - 1, idx + 1].map((x) => {
      if (x < 0 || x > arr.length - 1) {
        // if no piece between piece and border
        return x < 0 ? 0 : isRow ? 8 : 9;
      } else {
        if (piece.team == arr[x].team) {
          const add = x < idx ? 1 : -1;
          return isRow ? arr[x].col + add : arr[x].row + add;
        }
        return isRow ? arr[x].col : arr[x].row;
      }
    });
    if (start == end) {
      return;
    }
    arrayRange(start, end).map((b) => {
      if (isRow) {
        if (piece.row == axis && piece.col == b) {
          return;
        }
        moves.push([axis, b]);
      } else {
        if (piece.row == b && piece.col == axis) {
          return;
        }
        moves.push([b, axis]);
      }
    });
  }

  helper(true, r, r.indexOf(piece));
  helper(false, c, c.indexOf(piece));
  return moves;
}

/**
 *  Finds possible moves based on the piece type
 *  @param {State} state current state of the game
 *  @param {Piece} piece the piece making the move
 *  @returns {Array<Array<number>>} an array of possible moves
 */
function findMoveHorse(state: State, piece: Piece): Array<Array<number>> {
  const row = piece.row,
    col = piece.col;
  const posMoves = [
    [row, col - 1],
    [row, col + 1],
    [row + 1, col],
    [row - 1, col],
  ];
  return posMoves
    .filter((move) => {
      if (move[0] < 0 || move[0] > 9) {
        return false;
      }
      if (move[1] < 0 || move[1] > 8) {
        return false;
      }
      // if blocked
      if (state[move[0]][move[1]]) {
        return false;
      }
      return true;
    })
    .flatMap((move) => {
      // first step taken is left or right
      if (move[0] == row) {
        const add = move[1] < col ? -1 : 1;
        return [
          [row - 1, move[1] + add],
          [row + 1, move[1] + add],
        ];
      }
      const add = move[0] < row ? -1 : 1;
      return [
        [move[0] + add, col - 1],
        [move[0] + add, col + 1],
      ];
    })
    .filter((move) => isValid(state, piece.team, move[0], move[1]));
}

/**
 *  Finds possible moves based on the piece type
 *  @param {State} state current state of the game
 *  @param {Piece} piece the piece making the move
 *  @returns {Array<Array<number>>} an array of possible moves
 */
function findMoveElephant(state: State, piece: Piece): Array<Array<number>> {
  const row = piece.row,
    col = piece.col;

  const posMoves = [
    [row - 2, col - 2],
    [row - 2, col + 2],
    [row + 2, col - 2],
    [row + 2, col + 2],
  ];
  return (
    posMoves
      // check if accross river
      .filter((move) => (piece.team == "red" ? move[0] < 5 : move[0] > 4))
      // check if move is on board and has no friendly troop
      .filter((move) => isValid(state, piece.team, move[0], move[1]))
      // check if its blocked
      .filter(
        (move) =>
          state[Math.abs((move[0] + row) / 2)][Math.abs((move[1] + col) / 2)] ==
          null
      )
  );
}

/**
 *  Finds possible moves based on the piece type
 *  @param {State} state current state of the game
 *  @param {Piece} piece the piece making the move
 *  @returns {Array<Array<number>>} an array of possible moves
 */
function findMoveAdvisor(state: State, piece: Piece): Array<Array<number>> {
  const row = piece.row,
    col = piece.col;

  const posMoves =
    piece.team == "red"
      ? [
          [0, 3],
          [0, 5],
          [1, 4],
          [2, 3],
          [2, 5],
        ]
      : [
          [9, 3],
          [9, 5],
          [8, 4],
          [7, 3],
          [7, 5],
        ];
  return (
    posMoves
      // check if moveable
      .filter(
        (move) => Math.abs(move[0] - row) == 1 || Math.abs(move[1] - col) == 1
      )
      // check if move is on board and has no friendly troop
      .filter((move) => isValid(state, piece.team, move[0], move[1]))
  );
}

/**
 *  Finds possible moves based on the piece type
 *  @param {State} state current state of the game
 *  @param {Piece} piece the piece making the move
 *  @returns {Array<Array<number>>} an array of possible moves
 */
function findMoveCannon(state: State, piece: Piece): Array<Array<number>> {
  const r: Piece[] = [],
    c: Piece[] = [];
  for (let row = 0; row < state.length; row++) {
    for (let col = 0; col < state[0].length; col++) {
      if (state[row][col] === null) {
        continue;
      }
      // ! is used becaused i have checked earlier
      if (row == piece.row) {
        r.push(state[row][col]!);
      }
      if (col == piece.col) {
        c.push(state[row][col]!);
      }
    }
  }
  const moves: Array<Array<number>> = [];
  function helper(isRow: boolean, arr: Piece[], idx: number) {
    [idx - 2, idx + 2].map((i) => {
      if (i < 0 || i > arr.length - 1) {
        return;
      }
      if (arr[i].team == piece.team) {
        return;
      }
      const target = arr[i];
      moves.push([target.row, target.col]);
    });
    const [start, end] = [idx - 1, idx + 1].map((i) => {
      if (i < 0 || i > arr.length - 1) {
        // if no piece between piece and border
        return i < idx ? 0 : isRow ? 8 : 9;
      } else {
        const add = i < idx ? 1 : -1;
        return isRow ? arr[i].col + add : arr[i].row + add;
      }
    });
    if (start == end) {
      return;
    }
    const axis = isRow ? piece.row : piece.col;
    arrayRange(start, end).map((b) => {
      if (isRow) {
        moves.push([axis, b]);
      } else {
        moves.push([b, axis]);
      }
    });
  }
  helper(true, r, r.indexOf(piece));
  helper(false, c, c.indexOf(piece));
  return moves;
}

/**
 *  Finds possible moves based on the piece type
 *  @param {State} state current state of the game
 *  @param {Piece} piece the piece making the move
 *  @returns {Array<Array<number>>} an array of possible moves
 */
function findMoveSoldier(state: State, piece: Piece): Array<Array<number>> {
  const row = piece.row,
    col = piece.col;
  const posMoves = [piece.team == "red" ? [row + 1, col] : [row - 1, col]];
  if (piece.team == "red" ? row > 4 : row < 5) {
    posMoves.push([row, col + 1], [row, col - 1]);
  }
  return posMoves.filter((move) =>
    isValid(state, piece.team, move[0], move[1])
  );
}

/**
 *  Finds possible moves based on the piece type
 *  @param {State} state current state of the game
 *  @param {Piece} piece the piece making the move
 *  @returns {Array<Array<number>>} an array of possible moves
 */
function findMoveGeneral(state: State, piece: Piece): Array<Array<number>> {
  // TODO
  const row = piece.row,
    col = piece.col;
  const posMoves = [
    [row, col - 1],
    [row, col + 1],
    [row + 1, col],
    [row - 1, col],
  ];
  return posMoves.filter((move) => {
    if (move[1] < 3 || move[1] > 5) {
      return false;
    }
    const [lower, upper] = piece.team == "red" ? [0, 2] : [7, 9];
    if (move[0] < lower || move[0] > upper) {
      return false;
    }
    if (state[move[0]][move[1]]?.team == piece.team) {
      return false;
    }
    return true;
  });
}

/**
 *  Finds possible moves based on the piece type
 *  @param {State} state current state of the game
 *  @param {Piece} piece the piece making the move
 *  @param {Piece[]} ownTeam team of the piece making the move
 *  @param {Piece[]} otherTeam the opposing team
 *  @returns {Array<Array<number>>} an array of possible moves
 */
function findMove(
  state: State,
  piece: Piece,
  ownTeam: Piece[],
  otherTeam: Piece[]
) {
  let moves: number[][] = [];

  switch (piece.type) {
    case "Chariot":
      moves = findMoveChariot(state, piece);
      break;
    case "Horse":
      moves = findMoveHorse(state, piece);
      break;
    case "Elephant":
      moves = findMoveElephant(state, piece);
      break;
    case "Advisor":
      moves = findMoveAdvisor(state, piece);
      break;
    case "Cannon":
      moves = findMoveCannon(state, piece);
      break;
    case "Soldier":
      moves = findMoveSoldier(state, piece);
      break;
    case "General":
      moves = findMoveGeneral(state, piece);
      break;
  }
  moves.filter((move) => causeCheck(state, piece, move, ownTeam, otherTeam));
  return moves.filter((move) =>
    causeCheck(state, piece, move, ownTeam, otherTeam)
  );
  return moves;
}

export default findMove;
