import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import Board from "../PlacementBoard/PlacementBoard";
import PlaceShipControls from "../../UI/PlaceShipControls/PlaceShipControls";
import classes from "./BoardSetup.module.css";

const BoardSetup = ({
  onCheckShipPosition,
  onPlaceShip,
  onPlaceShipsRandomly,
  onStartGame,
}) => {
  const humanPlayerMap = useSelector(
    (state) => state.gameState.player1.boardMap
  );
  const playerName = useSelector((state) => state.gameState.player1.name);
  const [selectedShipLength, setSelectedShipLength] = useState(null);
  const [shipsInventory, setShipsInventory] = useState({
    carrier: 2,
    battleship: 1,
    destroyer: 1,
    patrolBoat: 2,
  });
  const [closing, setClosing] = useState(false);

  const selectShipHandler = useCallback((ship) => {
    setSelectedShipLength(ship);
  }, []);

  const updateShipsInventoryHandler = (shipLength) => {
    switch (shipLength) {
      case 5:
        if (shipsInventory.carrier > 0) {
          const newAmount = shipsInventory.carrier - 1;
          setShipsInventory({ ...shipsInventory, carrier: newAmount });
        }
        break;
      case 4:
        if (shipsInventory.battleship > 0) {
          const newAmount = shipsInventory.battleship - 1;
          setShipsInventory({ ...shipsInventory, battleship: newAmount });
        }
        break;
      case 3:
        if (shipsInventory.destroyer > 0) {
          const newAmount = shipsInventory.destroyer - 1;
          setShipsInventory({ ...shipsInventory, destroyer: newAmount });
        }
        break;
      case 2:
        if (shipsInventory.patrolBoat > 0) {
          const newAmount = shipsInventory.patrolBoat - 1;
          setShipsInventory({ ...shipsInventory, patrolBoat: newAmount });
        }
        break;
      default:
    }
  };

  const clearInventoryHandler = () => {
    setShipsInventory({
      carrier: 0,
      battleship: 0,
      destroyer: 0,
      patrolBoat: 0,
    });
  };

  const startGameHandler = () => {
    setClosing(true);
    setTimeout(onStartGame, 500);
  };

  let availableShips = 0;
  for (const [, nrShips] of Object.entries(shipsInventory)) {
    availableShips += nrShips;
  }
  const readyToStart = availableShips === 0;

  let containerClasses = [classes["board-setup-container"]];
  closing && containerClasses.push(classes["fading-out"]);

  return (
    <div className={containerClasses.join(" ")}>
      <h1 className={classes.message}>{playerName}, Coloca Tus Barcos!</h1>
      <p className={classes["text"]}>
      Selecciona un barco y mueve el ratón sobre el tablero. Haga clic para colocarlo.
        Haga clic derecho para cambiar la orientación.
      </p>
      <div className={classes["ship-placement-container"]}>
        <Board
          boardMap={[...humanPlayerMap]}
          selectedShipLength={selectedShipLength}
          onCheckShipPosition={onCheckShipPosition}
          onPlaceShip={onPlaceShip}
          onUpdateShipsInventory={updateShipsInventoryHandler}
        />
        <PlaceShipControls
          selectedShipLength={selectedShipLength}
          onSelectShipLength={selectShipHandler}
          shipsInventory={shipsInventory}
          readyToStart={readyToStart}
          onPlaceShipsRandomly={onPlaceShipsRandomly}
          onClearInventory={clearInventoryHandler}
        />
      </div>
      <button
        className={classes["start-button"]}
        onClick={startGameHandler}
        disabled={!readyToStart}
      >
        AL COMBATE
      </button>
    </div>
  );
};

export default BoardSetup;
