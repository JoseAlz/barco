export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  export const arrayMatch = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      return false;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }
    if (arr1 === arr2) {
      //same reference passed
      return true;
    }
    for (let i = 0; i < arr1.length; i++) {
      //check contents
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  };
  
  export const isInRange = (n, min, max) => {
    if (!Number.isInteger(n)) {
      return false;
    }
    if (n >= min && n <= max) {
      return true;
    }
    return false;
  };
  