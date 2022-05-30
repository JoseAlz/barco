import React, { useCallback, useEffect, useState } from "react";
import classes from "./App.module.css";

import GameLoop from "./API/gameApi/GameLoop";
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "./features/gameState/gameStateSlice";
import MainMenu from "./components/MainMenu/MainMenu";
import BoardSetup from "./components/BoardSetup/BoardSetup";
import MainGame from "./components/MainGame/MainGame";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { IconContext } from "react-icons";
import mainSound from "./assets/sounds/main.wav";
import Footer from "./components/Footer/Footer";

function App() {
  const updateGameState = (gameState) => {
    dispatch(updateState(gameState));
  };

  const gameLoop = useState(GameLoop(updateGameState))[0];
  const gameState = useSelector((state) => state.gameState);
  const dispatch = useDispatch();
  const [isSoundOn, setIsSoundOn] = useState(true);
  const audio = useState(new Audio(mainSound))[0];
  const [userInteracted, setUserInteracted] = useState(false);

  const toggleSoundHandler = () => {
    setIsSoundOn((prevState) => !prevState);
  };

  useEffect(() => {
    if (isSoundOn) {
      if (userInteracted) {
        audio.play();
        audio.loop = true;
      }
    } else {
      audio.pause();
    }
  }, [userInteracted, audio, isSoundOn]);

  const initGameHandler = (humanPlayerName = "Capitan #242") => {
    gameLoop.gameAction({
      type: "gameLoop/initGame",
      payload: { name1: humanPlayerName, name2: "Skynet" },
    });
  }

  const startGameHandler = () => {
    gameLoop.gameAction({
      type: "gameLoop/startGame",
    });
  };

  const placeShipHandler = (shipLength, coords, orient) => {
    gameLoop.gameAction({
      type: "gameLoop/placeShip",
      payload: {
        coords,
        shipLength,
        orient,
      },
    });
  };

  const placeShipsRandomlyHandler = () => {
    gameLoop.gameAction({ type: "gameLoop/placeShipsRandomly" });
  };

  const humanPlayerStrikeHandler = ([x, y]) => {
    gameLoop.gameAction({
      type: "gameLoop/strike",
      payload: { playerType: "human", coords: [x, y] },
    });
  };
  const CPUPlayerStrikeHandler = useCallback(
    ([x, y]) => {
      gameLoop.gameAction({
        type: "gameLoop/strike",
        payload: { playerType: "cpu", coords: [x, y] },
      });
    },
    [gameLoop]
  );

  const isStrikeOnCPULegalHandler = (coords) => {
    return gameLoop.isStrikeOnCPULegal(coords);
  };

  const isStrikeOnHumanLegalHandler = useCallback(
    (coords) => {
      return gameLoop.isStrikeOnHumanLegal(coords);
    },
    [gameLoop]
  );

  const isCPUShipHitHandler = (coords) => {
    return gameLoop.isHitOnCPUShips(coords);
  };
  const isHumanShipHitHandler = useCallback(
    (coords) => {
      return gameLoop.isHitOnHumanShips(coords);
    },
    [gameLoop]
  );

  const showBoardSetup = gameState.gameState === "gameState/initial";
  const showMainGame = gameState.gameState === "gameState/running";
  const gameOver = gameState.gameState ==="gameState/over";
  return (
    <div
      className={classes.App}
      onClick={() => !userInteracted && setUserInteracted(true)}
    >
      <MainMenu onInitGame={initGameHandler} />
      <div className={classes["content"]}>
        {showBoardSetup && (
          <BoardSetup
            onCheckShipPosition={gameLoop.isShipPlacementLegal}
            onPlaceShip={placeShipHandler}
            onPlaceShipsRandomly={placeShipsRandomlyHandler}
            onStartGame={startGameHandler}
          />
        )}
        {(showMainGame || gameOver) && (
          <MainGame
            onHumanPlayerStrike={humanPlayerStrikeHandler}
            onCPUPlayerStrike={CPUPlayerStrikeHandler}
            isSoundOn={isSoundOn}
            onIsStrikeOnCPULegal={isStrikeOnCPULegalHandler}
            onIsStrikeOnHumanLegal={isStrikeOnHumanLegalHandler}
            onIsHumanShipHit={isHumanShipHitHandler}
            onIsCPUShipHit={isCPUShipHitHandler}
            onInitGame = {initGameHandler}
          />
        )}
      </div>
      <IconContext.Provider value={{ size: "3rem" }}>
        <div
          className={classes["speaker-icon-container"]}
          onClick={toggleSoundHandler}
        >
          {isSoundOn && <GiSpeaker />}
          {!isSoundOn && <GiSpeakerOff />}
        </div>
      </IconContext.Provider>
      <Footer />
    </div>
  );
}

export default App;
