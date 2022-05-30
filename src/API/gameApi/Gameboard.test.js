import Gameboard from "./Gameboard";
import Ship from "./Ship";

describe.skip("Gameboard factory function tests", () => {
  describe("Gameboard should", () => {
    test("return an object having ships, size, missedHits,receiveAttack,  populateRandom, placeShip, getBoardMap allShipsSunk, isPositionLegal properties", () => {
      expect(Gameboard()).toHaveProperty("ships");
      expect(Gameboard()).toHaveProperty("size");
      expect(Gameboard()).toHaveProperty("missedHits");
      expect(Gameboard()).toHaveProperty("receiveAttack");
      expect(Gameboard()).toHaveProperty("populateRandom");
      expect(Gameboard()).toHaveProperty("placeShip");
      expect(Gameboard()).toHaveProperty("getBoardMap");
      expect(Gameboard()).toHaveProperty("allShipsSunk");
      expect(Gameboard()).toHaveProperty("isPositionLegal");
    });

    test("have a size property of 10", () => {
      expect(Gameboard().size).toBe(10);
    });

    test("have a ships property as an array and be zero at initialisation", () => {
      expect(Array.isArray(Gameboard().ships)).toBe(true);
      expect(Gameboard().ships.length).toBe(0);
    });
  });

  describe("Gameboard properties: ", () => {
    let gameboard;
    beforeEach(() => {
      gameboard = Gameboard();
    });

    test("ships property should be an array of objects having ship, coords and orientation properties", () => {
      gameboard.placeShip(Ship(5), [2, 2]);
      expect(gameboard.ships[0]).toHaveProperty("ship");
      expect(gameboard.ships[0]).toHaveProperty("coords");
      expect(gameboard.ships[0]).toHaveProperty("orient");
    });

    test("populateRandom() should populate the ships array with random ships", () => {
      gameboard.populateRandom();
      expect(gameboard.ships.length).toBe(6);
    });

    test("receiveAttack() should record the attack correctly", () => {
      gameboard.placeShip(Ship(3), [5, 5]);
      gameboard.receiveAttack([5, 5]);
      gameboard.receiveAttack([5, 6]);
      gameboard.receiveAttack([5, 7]);
      gameboard.receiveAttack([6, 5]); //this one should miss
      expect(gameboard.ships[0].ship.body[1]).toBe(1);
      expect(gameboard.missedHits.length).toBe(1);
    });

    test("placeShip() should place a ship correctly", () => {
      gameboard.placeShip(Ship(4), [9, 3]);
      gameboard.placeShip(Ship(5), [3, 3], "ver");
      expect(JSON.stringify(gameboard.ships[0])).toMatch(
        JSON.stringify({
          ship: Ship(4),
          coords: [9, 3],
          orient: "hor",
        })
      );
      expect(JSON.stringify(gameboard.ships[1])).toMatch(
        JSON.stringify({
          ship: Ship(5),
          coords: [3, 3],
          orient: "ver",
        })
      );
    });

    test("placeShip() called with invalid coordinates should not place a ship at all", () => {
      gameboard.placeShip(Ship(3), [10, 10]);
      gameboard.placeShip(Ship(3), [5, 8]);
      expect(gameboard.ships[0]).toBeUndefined();
    });

    test("getBoardMap should return a 10 x 10 array", () => {
      expect(gameboard.getBoardMap().length).toBe(10);
      expect(gameboard.getBoardMap()[0].length).toBe(10);
    });

    test("getBoardMap should represent ships as numbers in the array, plus a marker for the type of ship each number being the indexes in the ships array, PB for patrol boat, D for destroyer, BS for battleship, C for carrier", () => {
      gameboard.placeShip(Ship(4), [0, 0]);
      gameboard.placeShip(Ship(3), [5, 5], "ver");
      gameboard.receiveAttack([5, 5]);
      gameboard.receiveAttack([0, 3]);
      const boardMap = gameboard.getBoardMap();

      expect(boardMap[0][0]).toBe("0BS");
      expect(boardMap[0][1]).toBe("0BS");
      expect(boardMap[0][2]).toBe("0BS");
      expect(boardMap[0][3]).toBe("X0BS");
      expect(boardMap[0][4]).toBe("W");

      expect(boardMap[5][5]).toBe("X1D");
      expect(boardMap[6][5]).toBe("1D");
      expect(boardMap[7][5]).toBe("1D");
      expect(boardMap[8][5]).toBe("W");
      expect(boardMap[9][5]).toBe("W");
    });

    test("allShipsSunk should return the correct value", () => {
      gameboard.populateRandom();
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          gameboard.receiveAttack([i, j]);
        }
      }
      expect(gameboard.allShipsSunk()).toBe(true);
    });

    test("missedHits should record the missed hits correctly", () => {
      gameboard.receiveAttack([5, 5]);
      gameboard.receiveAttack([7, 9]);
      expect(gameboard.missedHits[0]).toEqual([5, 5]);
      expect(gameboard.missedHits[1]).toEqual([7, 9]);
    });
  });

  describe("isPositionLegal method should", () => {
    let gameboard;
    beforeEach(() => {
      gameboard = Gameboard();
    });
    test("return false when trying to place ships to close to the edges", () => {
      expect(gameboard.isPositionLegal(Ship(4), [0, 7], "hor")).toBe(false);
      expect(gameboard.isPositionLegal(Ship(4), [0, 6], "hor")).toBe(true);
      expect(gameboard.isPositionLegal(Ship(4), [7, 0], "ver")).toBe(false);
      expect(gameboard.isPositionLegal(Ship(4), [6, 0], "ver")).toBe(true);
    });

    test("properly detect when a position is not possible because of ships overlapping", () => {
      gameboard.placeShip(Ship(5), [5, 3], "hor");

      expect(gameboard.isPositionLegal(Ship(3), [4, 5], "ver")).toBe(false);
      expect(gameboard.isPositionLegal(Ship(2), [5, 1], "hor")).toBe(true);
      expect(gameboard.isPositionLegal(Ship(2), [5, 2], "hor")).toBe(false);
      expect(gameboard.isPositionLegal(Ship(4), [5, 3], "ver")).toBe(false);
    });
  });
});
