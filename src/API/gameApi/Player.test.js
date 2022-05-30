import Player from "./Player";
import Ship from "./Ship";

describe("Player factory function tests", () => {
  describe("Player should", () => {
    test("have a name, gameboard, isComputerPlayer, attack, attacksList property", () => {
      expect(Player()).toHaveProperty("name");
      expect(Player()).toHaveProperty("gameboard");
      expect(Player()).toHaveProperty("isComputerPlayer");
      expect(Player()).toHaveProperty("attack");
      expect(Player()).toHaveProperty("attacksList");
    });

    test("return a correct object when called with name and is ComputerPlayer arguments", () => {
      expect(Player("Mario", false)).toHaveProperty("name", "Mario");
      expect(Player("Luigi", true)).toHaveProperty("isComputerPlayer", true);
    });
  });

  describe("Player methods tests: ", () => {
    let player1, player2;
    beforeEach(() => {
      player1 = Player("Mario", true); //computer player
      player2 = Player("Luigi", false); //human player
    });

    test("computer players should have a semi-random attack method, cpuAttack", () => {
      expect(player1).toHaveProperty("cpuAttack");
    });

    test("human players should not have the cpuAttack method", () => {
      expect(player2.cpuAttack).toBeUndefined();
    });

    test("calling cpuAttack should populate attacksList correctly", () => {
      player1.cpuAttack(player2);
      player1.cpuAttack(player2);
      player1.cpuAttack(player2);
      player1.cpuAttack(player2);
      player1.cpuAttack(player2);
      expect(player1.attacksList.length).toBe(5);
      expect(player1.attacksList.length).toBe(
        new Set(player1.attacksList).size
      );
    });

    test("cpu attacks should be received correctly by the human player", () => {
      player1.cpuAttack(player2);
      player1.cpuAttack(player2);
      player1.cpuAttack(player2);
      player1.cpuAttack(player2);
      player1.cpuAttack(player2);
      expect(player2.gameboard.missedHits.length).toBe(5);
    });

    test("Calling attack with another player as an argument should produce the correct results", () => {
      player1.gameboard.placeShip(Ship(5), [6, 4], "hor");
      player2.attack(player1, [6, 5]);
      player2.attack(player1, [5, 5]);
      expect(player1.gameboard.ships[0].ship.body[1]).toBe(1);
      expect(player1.gameboard.missedHits.length).toBe(1);
    });

    test("Calling attack method should populate attackList array correctly", () => {
      player2.attack(player1, [3, 5]);
      player2.attack(player1, [6, 6]);
      player2.attack(player1, [9, 9]);
      player2.attack(player1, [0, 0]);
      console.log(player2.attacksList);
      expect(player2.attacksList.length).toBe(4);
      expect(player2.attacksList[0]).toEqual([3, 5]);
      expect(player2.attacksList[1]).toEqual([6, 6]);
      expect(player2.attacksList[2]).toEqual([9, 9]);
      expect(player2.attacksList[3]).toEqual([0, 0]);
    });

    test("Calling attack method with invalid arguments should not modify attacksList property", () => {
      player2.attack(player2, ["a"]);
      player2.attack(player2, 3, 6);
      player2.attack(player2, ["3", "6"]);
      player2.attack(player2, [5, 10]);
      player2.attack(player2, [-5, 3]);

      expect(player2.attacksList.length).toBe(0);
    });
  });
});
