const Ship = (length = 2) => {
    const body = new Array(length).fill(0);
  
    const giveName = (length) => {
      switch (length) {
        case 2:
          return "Patrol Boat";
        case 3:
          return "Destroyer";
        case 4:
          return "Battleship";
        case 5:
          return "Carrier";
        default:
          return "Invalid Length";
      }
    };
  
    const name = giveName(length);
  
    const isSunk = () => {
      let sunk = true;
      body.forEach((pos) => {
        if (pos === 0) {
          sunk = false;
        }
      });
      return sunk;
    };
  
    const hit = (pos) => {
      if (pos < 0 || pos >= length) {
        return;
      }
      body[pos] = 1;
    };
  
    return {
      name,
      body,
      length,
      hit,
      isSunk,
    };
  };
  
  export default Ship;
  