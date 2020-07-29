import {
  GET_SEAT,
  GET_MATRIX,
  GET_WINNER,
  JOINED,
  LEFT,
} from "../actions/types";

const initialState = {
  seat: null,
  matrix: null,
  winner: null,
  joined: null,
  left: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SEAT:
      return {
        ...state,
        seat: action.payload,
      };
    case GET_MATRIX:
      return {
        ...state,
        matrix: action.payload,
      };
    case GET_WINNER:
      return {
        ...state,
        winner: action.payload,
      };
    case JOINED:
      return {
        ...state,
        joined: action.payload,
      };
    case LEFT:
      return {
        ...state,
        left: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
