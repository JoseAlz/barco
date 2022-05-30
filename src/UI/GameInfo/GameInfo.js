import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import classes from "./GameInfo.module.css";

const GameInfo = ({ stats, showRestartBtn, onInitGame }) => {
  const humanPlayerName = useSelector((state) => state.gameState.player1.name);
  const gameInfoRef = useRef();
  useEffect(() => {
    if (gameInfoRef) {
      gameInfoRef.current.scrollTop = gameInfoRef.current.scrollHeight;
    }
  }, [stats]);
  const content = stats.map((stat, idx) => {
    return (
      <p key={idx} className={classes["text-line"]}>
        {stat}
      </p>
    );
  });

  const btnClickHandler = () => {
    onInitGame(humanPlayerName);
  };

  return (
    <div className={classes["gameinfo-container"]} ref={gameInfoRef}>
      <p className={classes["text-title"]}>Battle Info</p>
      <p className={`${classes["text-line"]} ${classes["green"]}`}>
      ¡Haz clic en el cuadrado de un tablero oponente para atacar esa ubicación!
      </p>
      {content}
      {showRestartBtn && (
        <button className={classes["restart-btn"]} onClick={btnClickHandler}>
          RESTART GAME
        </button>
      )}
    </div>
  );
};

export default GameInfo;
