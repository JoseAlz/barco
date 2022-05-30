import Player from "./Player";
import Ship from "./Ship";

const GameLoop = (stateUpdateHandler) => {
  let player1 = null;
  let player2 = null;
  let gameState = "";
  let nextPlayer = null;
  let winner = null;

  const buildStateObject = () => {
    const buildPlayerData = (player) => {
      if (player) {
        const playerType = player.isComputerPlayer ? "cpu" : "human";
        return {
          name: player.name,
          boardMap: player.gameboard.getBoardMap(),
          attacksList: player.attacksList,
          playerType,
        };
      }
      return null;
    };
    let player1Data = buildPlayerData(player1) || null;
    let player2Data = buildPlayerData(player2) || null;
    let nextPlayerData = buildPlayerData(nextPlayer) || null;
    let winnerData = buildPlayerData(winner) || null;

    return {
      player1: player1Data,
      player2: player2Data,
      gameState,
      nextPlayer: nextPlayerData,
      winner: winnerData,
      error: null,
    };
  };

  const buildStateObjectWithError = (errorMsg) => {
    return { ...buildStateObject(), error: { message: errorMsg } };
  };

  const initGame = (name1 = "Mistery Player", name2 = "CPU Player") => {
    if (!stateUpdateHandler || typeof stateUpdateHandler !== "function") {
      throw new Error("stateUpdateHandler should be a function!");
    }
    player1 = Player(name1, false);
    player2 = Player(name2, true);
    gameState = "gameState/initial"; //or gameState/running, gameState/over
    nextPlayer = player1;
    winner = null;
  };

  const startGame = () => {
    player2 && player2.gameboard.populateRandom();
    gameState = "gameState/running";
  };

  const assessGame = () => {
    if (player1.gameboard.allShipsSunk()) {
      winner = player2;
    }
    if (player2.gameboard.allShipsSunk()) {
      winner = player1;
    }
    winner && (gameState = "gameState/over");
  };

  const isStrikeOnCPULegal = (coords) => {
    return player1.isStrikeLegal(coords);
  };
  const isStrikeOnHumanLegal = (coords) => {
    return player2.isStrikeLegal(coords);
  };

  const isHitOnCPUShips = (coords) => {
    return player2.gameboard.isHitOnShip(coords);
  };
  const isHitOnHumanShips = (coords) => {
    return player1.gameboard.isHitOnShip(coords);
  };

  //checks if placing a ship at the given coords is legal
  const isShipPlacementLegal = (shipLength, coords, orient) => {
    if (gameState !== "gameState/initial") {
      return false;
    }
    return player1.gameboard.isPositionLegal(Ship(shipLength), coords, orient);
  };

  const gameAction = ({ type, payload }) => {
    switch (type) {
      //called when first initializing the game
      case "gameLoop/initGame":
        initGame(payload.name1, payload.name2);

        stateUpdateHandler(buildStateObject());
        break;
      //called when ready to start the game
      case "gameLoop/startGame":
        if (gameState === "gameState/running") {
          //if game already started, do nothing
          break;
        }
        if (gameState !== "gameState/initial") {
          stateUpdateHandler(
            buildStateObjectWithError("Game not initialized!")
          );
          break;
        }
        if (!player1 || !player2) {
          stateUpdateHandler(buildStateObjectWithError("Invalid Players!"));
          break;
        }
        if (player1.gameboard.ships.length < 6) {
          stateUpdateHandler(
            buildStateObjectWithError(
              "Human player board not populated with ships!"
            )
          );
          break;
        }
        startGame();
        stateUpdateHandler(buildStateObject());
        break;

      case "gameLoop/placeShip":
        const coords = payload.coords;
        const newShip = Ship(payload.shipLength);
        const orient = payload.orient;

        if (player1.gameboard.isPositionLegal(newShip, coords, orient)) {
          player1.gameboard.placeShip(newShip, coords, orient);
          stateUpdateHandler(buildStateObject());
          break;
        }
        stateUpdateHandler(
          buildStateObjectWithError("Ship placement unsuccessful!")
        );
        break;

      case "gameLoop/placeShipsRandomly":
        if (gameState !== "gameState/initial") {
          stateUpdateHandler({
            ...buildStateObject(),
            error: { message: "Game not initialized!" },
          });
          break;
        }
        player1.gameboard.populateRandom();
        stateUpdateHandler(buildStateObject());
        break;

      case "gameLoop/strike":
        if (gameState !== "gameState/running") {
          stateUpdateHandler({
            ...buildStateObject(),
            error: { message: "Game not running!" },
          });
          break;
        }

        if (payload.playerType !== "human" && payload.playerType !== "cpu") {
          stateUpdateHandler({
            ...buildStateObject(),
            error: { message: "Invalid player type!" },
          });
          break;
        }

        if (payload.playerType === "human") {
          player1.attack(player2, payload.coords);
          nextPlayer = player2;
        }

        if (payload.playerType === "cpu") {
          player2.cpuAttack(player1, payload.coords);
          nextPlayer = player1;
        }
        assessGame();
        stateUpdateHandler(buildStateObject());
        break;

      default:
        stateUpdateHandler({
          ...buildStateObject(),
          error: { message: `${type}: Invalid action type!` },
        });
    }
  };

  return {
    gameAction,
    isShipPlacementLegal,
    isStrikeOnCPULegal,
    isStrikeOnHumanLegal,
    isHitOnCPUShips,
    isHitOnHumanShips,
  };
};

export default GameLoop;
