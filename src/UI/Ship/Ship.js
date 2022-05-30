import React, { useEffect } from "react";
import classes from "./Ship.module.css";
import BoardCell from "../BoardCell/BoardCell";

const shipTypes = ["N", "N", "PB", "D", "BS", "C"];

const Ship = ({
  length,
  shipCount,
  onUpdateSelectedShip,
  selected,
  disabled,
}) => {
  useEffect(() => {
    if (shipCount === 0) {
      if (selected) {
        onUpdateSelectedShip(null);
      }
    }
  }, [shipCount, selected, onUpdateSelectedShip]);

  const shipSelectHandler = () => {
    if (!disabled) {
      onUpdateSelectedShip(length);
    }
  };

  let shipBody = [];
  for (let i = 0; i < length; i++) {
    shipBody.push(
      <BoardCell
        cellData={shipTypes[length]}
        key={i}
        coords={[]}
        onCoordsChanged={null}
        disabled={disabled}
      />
    );
  }
  const shipClasses = [classes["ship"]];
  const countClasses = [classes["ship-count"]];
  selected && shipClasses.push(classes["selected"]);
  disabled && countClasses.push(classes["warning"]);

  return (
    <div className={classes["ship-container"]} onClick={shipSelectHandler}>
      <small className={countClasses.join(" ")}>{`${shipCount} X`}</small>
      <div className={shipClasses.join(" ")}>{shipBody}</div>
    </div>
  );
};

export default Ship;
