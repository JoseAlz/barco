import React from "react";
import classes from "./Footer.module.css";

import { BsGithub } from "react-icons/bs";
import { GrLinkedin } from "react-icons/gr";
import { IconContext } from "react-icons/lib";


const Footer = () => {
  return (
    <div className={classes["footer-container"]}>
      <span className={classes["footer-text"]}>&copy; 2022 Odin Project</span>
      <IconContext.Provider
        value={{ size: "1.5rem", className: classes["margin-right"] }}
      >
        <a
          href="https://github.com/JoseAlz"
          target="_blank"
          rel="noreferrer"
          className={classes.links}
        >
          <BsGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/jose-alzogaray-80b786128/"
          target="_blank"
          rel="noreferrer"
          className={classes.links}
        >
          <GrLinkedin />
        </a>
        
      </IconContext.Provider>
    </div>
  );
};

export default Footer;
