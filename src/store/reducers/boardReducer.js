import {
  GET_BOARDS,
  CREATE_BOARD,
  BOARDS_LOADING,
  CREATING_BOARD,
  BOARD_ERROR,
} from "../actions/types";

const initialState = {
  boards: [],
  board: {},
  boardsLoading: false,
  boardCreating: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOARDS:
      return {
        ...state,
        boards: action.payload.reverse(),
        boardsLoading: false,
      };
    case CREATE_BOARD:
      return {
        ...state,
        boards: [action.payload, ...state.boards],
        boardCreating: false,
      };
    case BOARDS_LOADING:
      return {
        ...state,
        boardsLoading: true,
      };
    case CREATING_BOARD:
      return {
        ...state,
        boardCreating: true,
      };
    case BOARD_ERROR:
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
