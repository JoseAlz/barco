import React, { useState } from "react";
import classes from "./PlacementBoard.module.css";
import Board from "../../UI/Board/Board";

const PlacementBoard = ({
  boardMap,
  selectedShipLength,
  onPlaceShip,
  onCheckShipPosition,
  onUpdateShipsInventory,
}) => {
  const [currentBoardMap, setCurrentBoardMap] = useState();
  const [currentCoords, setCurrentCoords] = useState(null);
  const [currentOrientation, setCurrentOrientation] = useState("ver");

  const superImposeShip = (boardMap, shipLength, shipNr, coords, orient) => {
    const [x, y] = coords;
    const currentMap = [...boardMap];
    const shipTypes = ["N", "N", "PB", "D", "BS", "C"];

    const isPositionLegal = onCheckShipPosition(shipLength, coords, orient);
    const label = `${isPositionLegal ? shipNr : "E"}${shipTypes[shipLength]}`;
    if (orient === "hor") {
      const currentRow = [...boardMap[x]];

      for (let i = y; i < y + shipLength; i++) {
        if (i <= 9) {
          currentRow[i] = label;
        }
      }
      currentMap[x] = [...currentRow];
    }

    if (orient === "ver") {
      for (let j = x; j < x + shipLength; j++) {
        if (j <= 9) {
          let currentRow = [...boardMap[j]];
          currentRow[y] = label;
          currentMap[j] = currentRow;
        }
      }
    }

    return currentMap;
  };

  const swapOrientationHandler = (e) => {
    e.preventDefault();
    const newOrient = currentOrientation === "hor" ? "ver" : "hor";
    setCurrentOrientation((prevState) => {
      if (prevState === "hor") {
        return "ver";
      }
      return "hor";
    });
    const currentMap = superImposeShip(
      boardMap,
      selectedShipLength,
      1,
      currentCoords,
      newOrient
    );
    setCurrentBoardMap(currentMap);
  };

  const placeShipHandler = (coords, shipLength, orient) => {
    if (!shipLength) {
      return;
    }
    if (onCheckShipPosition(shipLength, coords, orient)) {
      onPlaceShip(shipLength, coords, orient);
      onUpdateShipsInventory(shipLength);
    }
  };

  const coordsChangedHandler = (coords) => {
    if (!selectedShipLength) {
      return;
    }

    setCurrentCoords([...coords]);
    const currentMap = superImposeShip(
      boardMap,
      selectedShipLength,
      1,
      coords,
      currentOrientation
    );

    setCurrentBoardMap(currentMap);
  };

  const mouseLeaveHandler = () => {
    setCurrentBoardMap(boardMap);
  };

  let currentBoard = currentBoardMap;
  if (!currentBoard) {
    currentBoard = boardMap;
  }
  return (
    <div
      className={classes["cells-container"]}
      onMouseLeave={mouseLeaveHandler}
      onClick={() =>
        placeShipHandler(currentCoords, selectedShipLength, currentOrientation)
      }
      onContextMenu={swapOrientationHandler}
    >
      <Board boardMap={currentBoard} onCoordsChanged={coordsChangedHandler} />
    </div>
  );
};

export default PlacementBoard;
