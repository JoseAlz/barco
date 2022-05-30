import React from "react";

import { IconContext } from "react-icons";
import { GiCornerExplosion } from "react-icons/gi";

const HitShips = () => {
  return (
    <IconContext.Provider value={{ color: "red", size: "4em" }}>
      <GiCornerExplosion />
    </IconContext.Provider>
  );
};

export default HitShips;
