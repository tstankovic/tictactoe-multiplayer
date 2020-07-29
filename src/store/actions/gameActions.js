import { GET_SEAT, GET_MATRIX, GET_WINNER, JOINED, LEFT } from "./types";

export const setSeat = (seat) => ({
  type: GET_SEAT,
  payload: seat,
});

export const setMatrix = (matrix) => ({
  type: GET_MATRIX,
  payload: matrix,
});

export const setWinner = (winner) => ({
  type: GET_WINNER,
  payload: winner,
});

export const setJoined = (joined) => ({
  type: JOINED,
  payload: joined,
});

export const setLeft = (left) => ({
  type: LEFT,
  payload: left,
});
