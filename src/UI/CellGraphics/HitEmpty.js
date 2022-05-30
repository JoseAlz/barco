import React from "react";
import { IconContext } from "react-icons";
import { GiMissileSwarm } from "react-icons/gi";

const HitEmpty = () => {
  return (
    <IconContext.Provider value={{ color: "white", size: "4em" }}>
      <GiMissileSwarm />
    </IconContext.Provider>
  );
};

export default HitEmpty;
