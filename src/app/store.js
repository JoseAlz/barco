import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "../features/gameState/gameStateSlice";

export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
  },
});
