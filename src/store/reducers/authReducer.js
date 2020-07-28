import {
  GET_KEY,
  GET_USER,
  GET_SOCKET,
  USER_LOADING,
  USER_ERROR,
} from "../actions/types";

const initialState = {
  key: null,
  user: null,
  socket: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_KEY:
      return {
        ...state,
        key: action.payload,
        loading: false,
      };
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case GET_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case USER_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
