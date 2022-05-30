import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./MainGame.module.css";
import { getRandomInt } from "../../API/gameApi/helperFunc";

import vsImage from "../../assets/img/vs.png";
import splashSound from "../../assets/sounds/splash.wav";
import hitSound from "../../assets/sounds/hit.wav";
import missleLaunchSound from "../../assets/sounds/missile-launch.wav";
import gameOverSound from "../../assets/sounds/gong.wav";

import Board from "../../UI/Board/Board";
import GameInfo from "../../UI/GameInfo/GameInfo";
import Hero from "../../UI/Hero/Hero";

const MainGame = ({
  onHumanPlayerStrike,
  isSoundOn,
  onIsStrikeOnCPULegal,
  onIsStrikeOnHumanLegal,
  onIsHumanShipHit,
  onIsCPUShipHit,
  onCPUPlayerStrike,
  onInitGame,
}) => {
  const humanPlayerName = useSelector((state) => state.gameState.player1.name);
  const CPUPlayerName = useSelector((state) => state.gameState.player2.name);
  const humanPlayerMap = useSelector(
    (state) => state.gameState.player1.boardMap
  );

  const CPUPlayerMap = useSelector((state) => state.gameState.player2.boardMap);
  const winner = useSelector((state) => state.gameState.winner);
  const gameState = useSelector((state) => state.gameState.gameState);
  const nextPlayer = useSelector((state) => state.gameState.nextPlayer);
  const [currentCoords, setCurrentCoords] = useState([]);
  const audios = useState({
    splash: new Audio(splashSound),
    hit: new Audio(hitSound),
    launch: new Audio(missleLaunchSound),
    gameOver: new Audio(gameOverSound),
  })[0];
  const [missleInFlight, setMissileInFlight] = useState(false);
  const [gameStats, setGameStats] = useState([]);
  const [showBanners, setShowBanners] = useState(false);

  const generateValidStrikeCoords = useCallback(() => {
    let coordsFound = false;
    let coords = [];
    while (!coordsFound) {
      const x = getRandomInt(0, 9);
      const y = getRandomInt(0, 9);
      if (onIsStrikeOnHumanLegal([x, y])) {
        coordsFound = true;
        coords = [x, y];
      }
    }
    return coords;
  }, [onIsStrikeOnHumanLegal]);

  const playSound = useCallback(
    (sound) => {
      if (isSoundOn) {
        sound.currentTime = 0;
        sound.play();
      }
    },
    [isSoundOn]
  );

  const cpuStrikeHandler = useCallback(() => {
    if (gameState !== "gameState/running") {
      return;
    }
    setTimeout(() => {
      playSound(audios.launch);
      setGameStats((prevState) => [
        ...prevState,
        `${CPUPlayerName} attacking...`,
      ]);
      setTimeout(() => {
        const coords = generateValidStrikeCoords();
        onCPUPlayerStrike(coords);
        if (onIsHumanShipHit(coords)) {
          playSound(audios.hit);
          setGameStats((prevState) => [
            ...prevState,
            `...and hits ${humanPlayerName}'s ship!`,
          ]);
        } else {
          playSound(audios.splash);
          setGameStats((prevState) => [...prevState, `...and misses!`]);
        }
      }, 2000);
    }, 2000);
  }, [
    audios,
    generateValidStrikeCoords,
    onCPUPlayerStrike,
    playSound,
    onIsHumanShipHit,
    humanPlayerName,
    CPUPlayerName,
    gameState,
  ]);

  useEffect(() => {
    if (nextPlayer.playerType === "cpu") {
      cpuStrikeHandler();
    }
  }, [nextPlayer, cpuStrikeHandler]);

  useEffect(() => {
    if (gameState === "gameState/over") {
      if (winner) {
        setTimeout(() => {
          playSound(audios.gameOver);
          setTimeout(() => {
            setShowBanners(true);
            setGameStats((prevState) => [...prevState, `${winner.name} Wins!`]);
          }, 2000);
        }, 2000);
      }
    }
  }, [gameState, winner, playSound, audios.gameOver]);

  const coordsChangedHandler = (coords) => {
    setCurrentCoords((prevState) => [...coords]);
  };

  const boardClickHandler = () => {
    if (nextPlayer.playerType === "cpu") {
      return;
    }
    if (gameState !== "gameState/running") {
      return;
    }
    if (!onIsStrikeOnCPULegal(currentCoords)) {
      return;
    }
    if (!missleInFlight) {
      playSound(audios.launch);
      setGameStats((prevState) => [
        ...prevState,
        `${humanPlayerName} attacking....`,
      ]);
      setMissileInFlight(true);
      setTimeout(() => {
        onHumanPlayerStrike(currentCoords);
        setMissileInFlight(false);
        if (onIsCPUShipHit(currentCoords)) {
          playSound(audios.hit);
          setGameStats((prevState) => [
            ...prevState,
            `...and hits ${CPUPlayerName}'s ship!`,
          ]);
        } else {
          playSound(audios.splash);
          setGameStats((prevState) => [...prevState, "...and misses!"]);
        }
      }, 2000);
    }
  };

  const humanPlayerTitleClasses = [classes["player-name"]];
  const CPUPlayerTitleClasses = [classes["player-name"]];
  let humanPlayerTitle = humanPlayerName;
  let CPUPlayerTitle = CPUPlayerName;

  if (nextPlayer.playerType === "human") {
    humanPlayerTitleClasses.push(classes.attack);
    humanPlayerTitle += " - Attack";
  }
  if (nextPlayer.playerType === "cpu") {
    CPUPlayerTitleClasses.push(classes.attack);
    CPUPlayerTitle += " - Attacking";
  }

  let humanPlayerBanner;
  if (showBanners && gameState === "gameState/over") {
    if (winner.name && winner.name === humanPlayerName) {
      humanPlayerBanner = <Hero type={"victory"} />;
    }
    if (winner.name && winner.name === CPUPlayerName) {
      humanPlayerBanner = <Hero type={"defeat"} />;
    }
  }
  let CPUPlayerBanner;
  if (showBanners && gameState === "gameState/over") {
    if (winner.name && winner.name === CPUPlayerName) {
      CPUPlayerBanner = <Hero type={"victory"} />;
    }
    if (winner.name && winner.name === humanPlayerName) {
      CPUPlayerBanner = <Hero type={"defeat"} />;
    }
  }

  return (
    <div className={classes["main-game-container"]}>
      <div className={classes["player-container"]}>
        <h2 className={humanPlayerTitleClasses.join(" ")}>
          {humanPlayerTitle}
        </h2>
        <div className={classes["human-board-container"]}>
          {humanPlayerBanner}
          <Board boardMap={humanPlayerMap} isHumanBoard={true} />
        </div>
      </div>
      <div className={classes["center-panel"]}>
        <img src={vsImage} alt="vs" className={classes["vs-logo"]}></img>
        <GameInfo
          stats={gameStats}
          showRestartBtn={gameState === "gameState/over" ? true : false}
          onInitGame={onInitGame}
        />
      </div>
      <div className={classes["player-container"]}>
        <h2 className={CPUPlayerTitleClasses.join(" ")}>{CPUPlayerTitle}</h2>
        <div
          className={classes["cpu-board-container"]}
          onClick={boardClickHandler}
        >
          {CPUPlayerBanner}
          <Board
            boardMap={CPUPlayerMap}
            onCoordsChanged={coordsChangedHandler}
            isHumanBoard={false}
            hiddenShips={"hidden"}
          />
        </div>
      </div>
    </div>
  );
};

export default MainGame;
