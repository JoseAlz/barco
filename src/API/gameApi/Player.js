import Gameboard from "./Gameboard";
import {arrayMatch, isInRange } from "./helperFunc";

const Player = (playerName, isCPUplayer = false) => {
  const name = playerName;
  const isComputerPlayer = isCPUplayer;
  const gameboard = Gameboard();
  let attacksList = [];

  const attack = (player, coords) => {
    if (!Array.isArray(coords)) {
      return;
    }
    if (!isInRange(coords[0], 0, 9) || !isInRange(coords[1], 0, 9)) {
      return;
    }
    player.gameboard.receiveAttack([...coords]);
    const newAttacksList = [...attacksList];
    newAttacksList.push([...coords]);
    attacksList = [...newAttacksList];
    //console.log(attacksList);
  };

  const isStrikeLegal = (coords) => {
    const [x, y] = coords;
    if (!isInRange(x, 0, 9) || !isInRange(y, 0, 9)) {
      return false;
    }
    const attackListMatch = attacksList.filter((attackCoords) =>
      arrayMatch(attackCoords, coords)
    );
    if (attackListMatch.length === 0) {
      return true;
    }
    return false;
  };

  let cpuAttack;
  if (isCPUplayer) {
    cpuAttack = attack;
    //(player, coords) => {
    //   if (!player.gameboard) {
    //     return;
    //   }
    //   if (attacksList.length >= 100) {
    //     return;
    //   }
    //   let randomCoords = [getRandomInt(0, 9), getRandomInt(0, 9)];
    //   while (attacksList.find((hit) => arrayMatch(hit, [...randomCoords]))) {
    //     randomCoords = [getRandomInt(0, 9), getRandomInt(0, 9)];
    //   }
    //   player.gameboard.receiveAttack([...randomCoords]);
    //   const newAttacksList = [...attacksList];
    //   newAttacksList.push([...randomCoords]);
    //   attacksList = [...newAttacksList];
    // };
  }

  return {
    name,
    gameboard,
    isComputerPlayer,
    attack,
    cpuAttack,
    attacksList,
    isStrikeLegal,
  };
};

export default Player;
