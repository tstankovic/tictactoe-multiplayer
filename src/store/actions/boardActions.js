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

  const response = await axios({
    method: "POST",
    url: "/boards",
    data: { apikey },
  });
  if (response.status === 200)
    dispatch({ type: GET_BOARDS, payload: response.data });
  else dispatch({ type: BOARD_ERROR });
};

export const createBoard = (apikey) => async (dispatch) => {
  dispatch({ type: CREATING_BOARD });

  const response = await axios({
    method: "POST",
    url: "/create_board",
    data: { apikey },
  });
  const payload = { ...response.data, players: 0 };
  if (response.status === 200) dispatch({ type: CREATE_BOARD, payload });
  else dispatch({ type: BOARD_ERROR });
};
