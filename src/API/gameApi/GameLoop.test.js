import GameLoop from "./GameLoop";

describe("GameLoop Tests", () => {
  describe("GameLoop should", () => {
    let gameLoop;
    beforeEach(() => {
      gameLoop = GameLoop(null);
    });
    test("GameLoop should have the gameAction  property as a reducer for game actions", () => {
      expect(gameLoop).toHaveProperty("gameAction");
    });
  });

  describe("GameLoop.gameAction", () => {
    let gameLoop;
    let gameLoopState;
    beforeEach(() => {
      gameLoop = GameLoop((state) => (gameLoopState = { ...state }));
      gameLoop.gameAction({
        type: "gameLoop/initGame",
        payload: { name1: "Mario", name2: "CPULuigi" },
      });
    });

    test("gameLoop/initGame action type  should assign correct names to the players and set correct initial state", () => {
      expect(gameLoopState.player1.name).toMatch("Mario");
      expect(gameLoopState.player2.name).toMatch("CPULuigi");
      expect(gameLoopState.gameState).toMatch("gameState/initial");
    });

    test("gameLoop/startGame action type should correctly set the gameState to gameState/running", () => {
      gameLoop.gameAction({ type: "gameLoop/placeShipsRandomly" });
      gameLoop.gameAction({ type: "gameLoop/startGame" });
      expect(gameLoopState.gameState).toMatch("gameState/running");
      expect(gameLoopState.error).toBeNull();
    });

    test("gameLoop/startGame called before gameLoop/initGame should correctly send an error property in the state passed to stateUpdateHandler", () => {
      gameLoop = GameLoop((state) => (gameLoopState = { ...state }));
      gameLoop.gameAction({ type: "gameLoop/startGame" });
      expect(gameLoopState.error && gameLoopState.error.message).toMatch(
        "Game not initialized!"
      );
    });

    test("gameLoop/startGame action called before player board fully populated with ships should correctly send an error property in the state passed to stateUpdateHandler", () => {
      gameLoop.gameAction({ type: "gameLoop/startGame" });
      expect(gameLoopState.error && gameLoopState.error.message).toMatch(
        "Human player board not populated with ships!"
      );
    });

    test("passing an invalid action type should correctly send an error property in the state passed to updateStateHandler", () => {
      gameLoop.gameAction({ type: "some/invalidActionType" });
      expect(gameLoopState.error && gameLoopState.error.message).toMatch(
        "some/invalidActionType: Invalid action type!"
      );
    });

    test("passing gameLoop/strike with correct arguments should advance the game and correctly record the hit", () => {
      gameLoop.gameAction({ type: "gameLoop/placeShipsRandomly" });
      gameLoop.gameAction({ type: "gameLoop/startGame" });
      gameLoop.gameAction({
        type: "gameLoop/strike",
        payload: { playerType: "human", coords: [5, 5] },
      });

      //expect(gameLoopState.player1.attacksList.length).toBe(1);
      expect(gameLoopState.nextPlayer.name).toMatch("CPULuigi");

      gameLoop.gameAction({
        type: "gameLoop/strike",
        payload: { playerType: "cpu" },
      });
      expect(gameLoopState.player2.attacksList.length).toBe(1);
      expect(gameLoopState.nextPlayer.name).toMatch("Mario");
    });

    test("passing an invalid player type(other than human or cpu) should correctly send a error property in the state passed to updateStateHandler", () => {
      gameLoop.gameAction({ type: "gameLoop/placeShipsRandomly" });
      gameLoop.gameAction({ type: "gameLoop/startGame" });
      gameLoop.gameAction({
        type: "gameLoop/strike",
        payload: { playerType: "invalid_player", coords: [5, 5] },
      });
      expect(gameLoopState.error && gameLoopState.error.message).toMatch(
        "Invalid player type!"
      );
    });

    test("after all player ships sunk, gameLoopState should set the correct gameState and should set the correct winner - cpu", () => {
      gameLoop.gameAction({ type: "gameLoop/placeShipsRandomly" });
      gameLoop.gameAction({ type: "gameLoop/startGame" });
      for (let i = 0; i < 100; i++) {
        gameLoop.gameAction({
          type: "gameLoop/strike",
          payload: { playerType: "cpu" },
        });
      }
      expect(gameLoopState.gameState).toMatch("gameState/over");
      expect(gameLoopState.winner.name).toMatch("CPULuigi");
    });

    test("after all player ships sunk, gameLoopState should set the correct gameState and should set the correct winner - human", () => {
      gameLoop.gameAction({
        type: "gameLoop/initGame",
        payload: { name1: "Mario", name2: "CPULuigi" },
      });
      gameLoop.gameAction({ type: "gameLoop/placeShipsRandomly" });
      gameLoop.gameAction({ type: "gameLoop/startGame" });
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          gameLoop.gameAction({
            type: "gameLoop/strike",
            payload: { playerType: "human", coords: [i, j] },
          });
        }
      }

      expect(gameLoopState.gameState).toMatch("gameState/over");
      expect(gameLoopState.winner.name).toMatch("Mario");
    });

    test("isMoveLegal should return the correct value", () => {
      gameLoop.gameAction({ type: "gameLoop/placeShipsRandomly" });
      gameLoop.gameAction({ type: "gameLoop/startGame" });
      expect(gameLoop.isStrikeLegal(gameLoopState.player1, [5, 5])).toBe(true);
      gameLoop.gameAction({
        type: "gameLoop/strike",
        payload: { playerType: "human", coords: [5, 5] },
      });
      gameLoop.gameAction({
        type: "gameLoop/strike",
        payload: { playerType: "human", coords: [0, 0] },
      });
      gameLoop.gameAction({
        type: "gameLoop/strike",
        payload: { playerType: "human", coords: [9, 9] },
      });
      expect(gameLoop.isStrikeLegal(gameLoopState.player2, [5, 5])).toBe(false);
      expect(gameLoop.isStrikeLegal(gameLoopState.player2, [0, 0])).toBe(false);
      expect(gameLoop.isStrikeLegal(gameLoopState.player2, [9, 9])).toBe(false);
      expect(gameLoop.isStrikeLegal(gameLoopState.player2, [5, 6])).toBe(true);
    });

    test("gameLoop/placeShip passed to gameAction should correctly place a ship", () => {
      gameLoop.gameAction({
        type: "gameLoop/placeShip",
        payload: { shipLength: 4, coords: [5, 5], orient: "hor" },
      });
      expect(gameLoopState.player1.boardMap[5][6]).toBe("0BS");
      expect(gameLoopState.player1.boardMap[5][7]).toBe("0BS");
      expect(gameLoopState.player1.boardMap[5][8]).toBe("0BS");
      expect(gameLoopState.player1.boardMap[5][5]).toBe("0BS");

      gameLoop.gameAction({
        type: "gameLoop/placeShip",
        payload: { shipLength: 4, coords: [3, 7], orient: "hor" },
      });
      expect(gameLoopState.error && gameLoopState.error.message).toMatch(
        "Ship placement unsuccessful!"
      );
    });

    test("gameLoop/placeShip passes to gameAction should return a error property  in the state passes to stateUpdateHandler ", () => {
      gameLoop.gameAction({
        type: "gameLoop/placeShip",
        payload: { shipLength: 4, coords: [5, 5], orient: "hor" },
      });
      expect(gameLoopState.error).toBeNull();
      gameLoop.gameAction({
        type: "gameLoop/placeShip",
        payload: { shipLength: 5, coords: [3, 6], orient: "vert" },
      });
      expect(gameLoopState.error && gameLoopState.error.message).toMatch(
        "Ship placement unsuccessful!"
      );
    });

    test("isShipPlacementLegal should return the correct result", () => {
      const result1 = gameLoop.isShipPlacementLegal(5, [3, 3], "hor");
      const result2 = gameLoop.isShipPlacementLegal(5, [3, 6], "hor");
      const result3 = gameLoop.isShipPlacementLegal(5, [6, 3], "ver");
      expect(result1).toBe(true);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
    });
  });
});
