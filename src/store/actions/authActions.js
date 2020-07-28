import axios from "../../axios";

import {
  GET_KEY,
  GET_USER,
  GET_SOCKET,
  USER_LOADING,
  USER_ERROR,
} from "./types";

export const register = () => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  try {
    const response = await axios({
      method: "POST",
      url: "/register_candidate",
    });
    const { apikey } = response.data;
    localStorage.setItem("apikey", apikey);
    dispatch(setAPIKey(apikey));
  } catch (err) {
    dispatch({ type: USER_ERROR });
  }
};

export const createPlayer = (apikey, name) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  try {
    const response = await axios({
      method: "POST",
      url: "/player",
      data: { name, apikey },
    });
    localStorage.setItem("player", JSON.stringify(response.data));
    dispatch(setUser(response.data));
  } catch (err) {
    dispatch({ type: USER_ERROR });
  }
};

export const setSocket = (socket) => ({
  type: GET_SOCKET,
  payload: socket,
});

export const setAPIKey = (apikey) => ({
  type: GET_KEY,
  payload: apikey,
});

export const setUser = (user) => ({
  type: GET_USER,
  payload: user,
});
