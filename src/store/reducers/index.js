import { combineReducers } from "redux";

import authReducer from "./authReducer";
import boardsReducer from "./boardReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  boards: boardsReducer,
});

export default rootReducer;
