import Ship from "./Ship";
import { getRandomInt, isInRange } from "./helperFunc";

const Gameboard = () => {
  const size = 10;
  const ships = [];
  const missedHits = [];

  //private methods
  const checkHitOnShip = (shipRec, [x, y]) => {
    if (shipRec.orient === "hor") {
      if (
        y >= shipRec.coords[1] &&
        y <= shipRec.coords[1] + shipRec.ship.length - 1 &&
        x === shipRec.coords[0]
      ) {
        return true;
      }
    }
    if (shipRec.orient === "ver") {
      if (
        x >= shipRec.coords[0] &&
        x <= shipRec.coords[0] + shipRec.ship.length - 1 &&
        y === shipRec.coords[1]
      ) {
        return true;
      }
    }
    return false;
  };

  const getHitCoord = (shipRec, [x, y]) => {
    let hitCoord = null;
    if (shipRec.orient === "hor") {
      hitCoord = y - shipRec.coords[1];
    }
    if (shipRec.orient === "ver") {
      hitCoord = x - shipRec.coords[0];
    }
    return hitCoord;
  };

  const generateFullCoords = (shipRec) => {
    const fullCoords = [];
    const [x, y] = shipRec.coords;
    if (shipRec.orient === "hor") {
      for (let i = 0; i < shipRec.ship.length; i++) {
        if (y + i < 10) {
        }
        fullCoords.push([x, y + i]);
      }
    }
    if (shipRec.orient === "ver") {
      for (let i = 0; i < shipRec.ship.length; i++) {
        if (x + i < 10) {
          fullCoords.push([x + i, y]);
        }
      }
    }
    return fullCoords;
  };

  const areShipsOverlapped = (shipRec1, shipRec2) => {
    const ship1FullCoords = generateFullCoords(shipRec1);
    const ship2FullCoords = generateFullCoords(shipRec2);
    let coordsIntersection = [];

    ship1FullCoords.forEach((ship1Coords) => {
      ship2FullCoords.forEach((ship2Coords) => {
        const [x1, y1] = ship1Coords;
        const [x2, y2] = ship2Coords;
        if (x1 === x2 && y1 === y2) {
          coordsIntersection.push(ship2Coords);
        }
      });
    });
    if (coordsIntersection.length > 0) {
      return true;
    }
    return false;
  };

  //is a ship in a legal position, given the coords?
  const isPositionLegal = (ship, [x, y], orient) => {
    if (x > 9 || y > 9) {
      return false;
    }
    if (orient !== "ver" && orient !== "hor") {
      return false;
    }
    if (orient === "hor") {
      if (ship.length + y > 10) {
        return false;
      }
    }

    if (orient === "ver") {
      if (ship.length + x > 10) {
        return false;
      }
    }

    let overlapsWithShip = false;
    ships.forEach((shipRec) => {
      if (areShipsOverlapped({ ship, coords: [x, y], orient }, shipRec)) {
        overlapsWithShip = true;
      }
    });

    if (overlapsWithShip) {
      return false;
    }

    return true;
  };

  //public methods
  const receiveAttack = ([x, y]) => {
    if (!isInRange(x, 0, 9) || !isInRange(y, 0, 9)) {
      return;
    }
    let shipHit = false;
    ships.forEach((shipRec) => {
      if (checkHitOnShip(shipRec, [x, y])) {
        const hitCoord = getHitCoord(shipRec, [x, y]);
        if (hitCoord >= 0) {
          shipHit = true;
          shipRec.ship.hit(hitCoord);
        }
      }
    });
    if (!shipHit) {
      missedHits.push([x, y]);
    }
  };

  const isHitOnShip = (coords) => {
    const [x, y] = coords;
    let shipHit = false;

    ships.forEach((shipRec) => {
      if (checkHitOnShip(shipRec, [x, y])) {
        shipHit = true;
      }
    });

    return shipHit;
  };

  const populateRandom = () => {
    const orientations = ["ver", "hor"];
    let shipLength = 2;

    for (let i = ships.length; i < 6; i++) {
      let placed = false;
      if (i === 1) {
        shipLength = 2;
      }
      const randomShip = Ship(shipLength);
      const randomOrientation = orientations[getRandomInt(0, 1)];
      while (!placed) {
        const randomX = Math.round(Math.random() * 9);
        const randomY = Math.round(Math.random() * 9);
        if (
          isPositionLegal(randomShip, [randomX, randomY], randomOrientation)
        ) {
          ships.push({
            ship: randomShip,
            coords: [randomX, randomY],
            orient: randomOrientation,
          });
          placed = true;
        }
      }

      if (shipLength < 5) {
        shipLength++;
      }
    }
  };

  const placeShip = (ship, coords, orient = "hor") => {
    if (isPositionLegal(ship, coords, orient)) {
      ships.push({ ship, coords, orient });
    }
  };

  const allShipsSunk = () => {
    let allSunk = true;
    ships.forEach((shipRec) => {
      if (!shipRec.ship.isSunk()) {
        allSunk = false;
      }
    });
    return allSunk;
  };

  const getBoardMap = () => {
    const shipTypes = ["N", "N", "PB", "D", "BS", "C"];
    let map = [];
    for (let i = 0; i < 10; i++) {
      map[i] = new Array(10).fill("W");
    }
    ships.forEach((shipRec, s_idx) => {
      const [x, y] = shipRec.coords;
      const { ship } = shipRec;
      const shipLength = ship.length;
      const hitMarker = `X${s_idx}${shipTypes[shipLength]}`;
      const notHitMarker = `${s_idx}${shipTypes[shipLength]}`;
      if (shipRec.orient === "hor") {
        ship.body.forEach((point, b_idx) => {
          map[x][y + b_idx] = point === 1 ? hitMarker : notHitMarker;
        });
      }
      if (shipRec.orient === "ver") {
        ship.body.forEach((point, b_idx) => {
          map[x + b_idx][y] = point === 1 ? hitMarker : notHitMarker;
        });
      }
    });

    missedHits.forEach((point) => {
      const [x, y] = point;
      map[x][y] = "H";
    });

    return map;
  };

  return {
    size,
    ships,
    missedHits,
    receiveAttack,
    populateRandom,
    placeShip,
    getBoardMap,
    allShipsSunk,
    isPositionLegal,
    isHitOnShip,
  };
};

export default Gameboard;
