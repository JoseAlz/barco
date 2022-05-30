import classes from "./BoardCell.module.css";
import HitShips from "../CellGraphics/HitShips";
import HitEmpty from "../CellGraphics/HitEmpty";

const BoardCell = ({
  cellData,
  coords,
  onCoordsChanged,
  disabled,
  hiddenShipsData,
  isHumanBoard,
}) => {
  const isEmptyCellHit = /H/.test(cellData);
  const isShipCellHit = /X/.test(cellData);
  const isCellInvalid = /E/.test(cellData);
  const isPatrolBoat = /PB/.test(cellData);
  const isDestroyer = /D/.test(cellData);
  const isBattleship = /BS/.test(cellData);
  const isCarrier = /C/.test(cellData);
  let cellContent = null;
  let cellStyles = [classes["board-cell"]];
  cellStyles.push(classes["empty-cell"]);

  if (hiddenShipsData !== "hidden") {
    isPatrolBoat && cellStyles.push(classes["patrol-boat-cell"]);
    isDestroyer && cellStyles.push(classes["destroyer-cell"]);
    isBattleship && cellStyles.push(classes["battleship-cell"]);
    isCarrier && cellStyles.push(classes["carrier-cell"]);
  }

  if (isHumanBoard) {
    cellStyles.push(classes["cursor-not-allowed"]);
  }

  if (disabled) {
    cellStyles.push(classes["cursor-not-allowed"]);
  }

  if (isEmptyCellHit) {
    cellContent = <HitEmpty />;
    cellStyles.push(classes["empty-cell-hit"]);
    cellStyles.push(classes["cursor-not-allowed"]);
  }

  if (isShipCellHit) {
    cellContent = <HitShips />;
    cellStyles.push(classes["ship-cell-hit"]);
    cellStyles.push(classes["cursor-not-allowed"]);
  }

  if (isCellInvalid) {
    cellStyles.push(classes["invalid-cell"]);
  }

  const mouseInHandler = (e) => {
    //console.log(coords);
    if (onCoordsChanged) {
      onCoordsChanged(coords);
    }
  };

  return (
    <div className={cellStyles.join(" ")} onMouseEnter={mouseInHandler}>
      {cellContent}
    </div>
  );
};

export default BoardCell;
