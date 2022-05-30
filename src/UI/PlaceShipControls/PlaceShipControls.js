import Ship from "../Ship/Ship";
import classes from "./PlaceShipControls.module.css";

const PlaceShipControls = ({
  selectedShipLength,
  onSelectShipLength,
  shipsInventory,
  readyToStart,
  onPlaceShipsRandomly,
  onClearInventory,
}) => {
  const placeRandomlyHandler = () => {
    onPlaceShipsRandomly();
    onClearInventory();
  };

  return (
    <div className={classes["controls-container"]}>
      <div className={classes["ships-container"]}>
        <p className={classes["ship-title"]}>PATROL BOAT</p>
        <Ship
          length={2}
          shipCount={shipsInventory.patrolBoat}
          selected={selectedShipLength === 2 ? true : false}
          onUpdateSelectedShip={onSelectShipLength}
          disabled={shipsInventory.patrolBoat === 0}
        />
        <p className={classes["ship-title"]}>DESTROYER</p>
        <Ship
          length={3}
          shipCount={shipsInventory.destroyer}
          selected={selectedShipLength === 3 ? true : false}
          onUpdateSelectedShip={onSelectShipLength}
          disabled={shipsInventory.destroyer === 0}
        />
        <p className={classes["ship-title"]}>BATTLESHIP</p>
        <Ship
          length={4}
          shipCount={shipsInventory.battleship}
          selected={selectedShipLength === 4 ? true : false}
          onUpdateSelectedShip={onSelectShipLength}
          disabled={shipsInventory.battleship === 0}
        />
        <p className={classes["ship-title"]}>CARRIER</p>
        <Ship
          length={5}
          shipCount={shipsInventory.carrier}
          selected={selectedShipLength === 5 ? true : false}
          onUpdateSelectedShip={onSelectShipLength}
          disabled={shipsInventory.carrier === 0}
        />
      </div>
     
      <button
        className={classes["button"]}
        disabled={readyToStart}
        onClick={placeRandomlyHandler}
      >
        PLACE RANDOMLY
      </button>
    </div>
  );
};

export default PlaceShipControls;
