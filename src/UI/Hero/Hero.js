import React from "react";
import classes from "./Hero.module.css";
import defeatIcon from "../../assets/img/skull-crossbones.png";
import victoryIcon from "../../assets/img/victory.png";

const Hero = ({ type }) => {
  const src = type === "victory" ? victoryIcon : defeatIcon;
  return (
    <div className={classes.hero}>
      <img src={src} className={classes.banner} alt="victory/defeat"></img>
    </div>
  );
};

export default Hero;
