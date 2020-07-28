import axios from "../../axios";

import {
  GET_BOARDS,
  CREATE_BOARD,
  BOARDS_LOADING,
  CREATING_BOARD,
  BOARD_ERROR,
} from "./types";

export const getBoards = (apikey) => async (dispatch) => {
  dispatch({ type: BOARDS_LOADING });
  try {
    const response = await axios({
      method: "POST",
      url: "/boards",
      data: { apikey },
    });
    dispatch({ type: GET_BOARDS, payload: response.data });
  } catch (err) {
    dispatch({ type: BOARD_ERROR });
  }
};

export const createBoard = (apikey) => async (dispatch) => {
  dispatch({ type: CREATING_BOARD });
  try {
    const response = await axios({
      method: "POST",
      url: "/create_board",
      data: { apikey },
    });
    const payload = { ...response.data, players: 0 };
    dispatch({ type: CREATE_BOARD, payload });
  } catch (err) {
    dispatch({ type: BOARD_ERROR });
  }
};
