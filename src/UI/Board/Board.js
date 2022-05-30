import React, { Fragment } from "react";
import BoardCell from "../BoardCell/BoardCell";
const Board = ({ boardMap, onCoordsChanged, hiddenShips, isHumanBoard }) => {
  const board = boardMap.map((row, rowIdx) =>
    row.map((cell, colIdx) => {
      return (
        <BoardCell
          cellData={cell}
          key={Math.random()}
          coords={[rowIdx, colIdx]}
          onCoordsChanged={onCoordsChanged}
          hiddenShipsData={hiddenShips}
          isHumanBoard={isHumanBoard}
        />
      );
    })
  );
  return <Fragment>{board}</Fragment>;
};

export default Board;
