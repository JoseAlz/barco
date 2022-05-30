import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  player1: null,
  player2: null,
  gameState: "",
  nextPlayer: "",
  lastCPUStrike: null,
  winner: null,
};

export const gameStateSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    updateState: (state, action) => {
      state.player1 = action.payload.player1;
      state.player2 = action.payload.player2;
      state.gameState = action.payload.gameState;
      state.nextPlayer = action.payload.nextPlayer;
      state.winner = action.payload.winner;
      state.lastCPUStrike = action.payload.lastCPUStrike;
      action.payload.error && (state.error = action.payload.error);
    },
  },
});

export const { updateState } = gameStateSlice.actions;

export default gameStateSlice.reducer;
