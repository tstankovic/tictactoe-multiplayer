import { combineReducers } from "redux";

import authReducer from "./authReducer";
import boardsReducer from "./boardReducer";
import gameReducer from "./gameReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  boards: boardsReducer,
  game: gameReducer,
});

export default rootReducer;
