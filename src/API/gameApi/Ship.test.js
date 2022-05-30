import Ship from "./Ship";

describe("Ship factory function tests", () => {
  describe("Ship should", () => {
    test("return an object containing coords, name, body, length, hit isSunk", () => {
      expect(Ship(5)).toHaveProperty("name");
      expect(Ship(5)).toHaveProperty("body");
      expect(Ship(5)).toHaveProperty("length");
      expect(Ship(5)).toHaveProperty("isSunk");
      expect(Ship(5)).toHaveProperty("hit");
    });

    test("return the correct name, based on length", () => {
      expect(Ship(5)).toHaveProperty("name", "Carrier");
      expect(Ship(4)).toHaveProperty("name", "Battleship");
      expect(Ship(3)).toHaveProperty("name", "Destroyer");
      expect(Ship(2)).toHaveProperty("name", "Patrol Boat");
    });

    test("return name of 'Invalid Length' when used with invalid length ", () => {
      expect(Ship(6)).toHaveProperty("name", "Invalid Length");
      expect(Ship(1)).toHaveProperty("name", "Invalid Length");
    });
  });

  describe("ship object methods", () => {
    test("hit(pos) should mark a hit as '1', correctly on the body of the ship", () => {
      const ship = Ship(4);
      ship.hit(0);
      ship.hit(3);
      expect(ship.body).toEqual([1, 0, 0, 1]);
    });
    test("isSunk() return true on a ship hit on all positions", () => {
      const ship = Ship(4);
      ship.hit(0);
      ship.hit(1);
      ship.hit(2);
      ship.hit(3);
      expect(ship.isSunk()).toEqual(true);
    });
    test("isSunk() return false on a ship NOT hit on all positions", () => {
      const ship = Ship(4);
      ship.hit(0);
      ship.hit(2);
      ship.hit(3);
      expect(ship.isSunk()).toEqual(false);
    });

    test("hit(pos) should have no effect when used with invalid position", () => {
      const ship = Ship(4);
      ship.hit(4);
      expect(ship.body).toEqual([0, 0, 0, 0]);
    });
  });
});
