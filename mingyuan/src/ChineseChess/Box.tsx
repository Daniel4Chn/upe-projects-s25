import { IBox } from "./types";

function Box({
  box,
  redTurn,
  isMoveable,
  isMoving,
  isChecked,
  movePiece,
}: IBox) {
  let name = "";

  // TODO revisit this algo
  if (box != null) {
    const isCurrTurn = box.team == (redTurn ? "red" : "black");
    name = `piece ${box.team} ${isCurrTurn ? "active" : ""}`;
    if (!isMoving) {
      return (
        <div className="box">
          {" "}
          {isCurrTurn ? (
            <div className={name} onClick={movePiece}>
              {box.img}
            </div>
          ) : (
            <div className={name}>{box.img}</div>
          )}
        </div>
      );
    }
    let element;
    // piece is the current selected piece
    if (box.row == isMoving.row && box.col == isMoving.col) {
      name += " selected";
      element = (
        <div className={name} onClick={movePiece}>
          {box.img}
        </div>
      );
      // piece can be eaten
    } else if (isMoveable) {
      name += " eat active";
      element = (
        <div className={name} onClick={movePiece}>
          {box.img}
        </div>
      );
    } else if (box.type == "General" && isCurrTurn && isChecked) {
      element = (
        <div className={(name += " eat")} onClick={movePiece}>
          {box.img}
        </div>
      );
    } else if (isCurrTurn) {
      element = (
        <div className={name} onClick={movePiece}>
          {box.img}
        </div>
      );
    } else {
      element = <div className={name}>{box.img}</div>;
    }
    return <div className="box">{element}</div>;
  }

  if (isMoveable && isMoving) {
    return (
      <div className="box">
        <div className="moveable" onClick={movePiece}></div>
      </div>
    );
  }
  return <div className="box"></div>;
}

export default Box;
