import { combineReducers } from "redux";

import cellsReducer from "./cellsReducer";

const reducers = combineReducers({
  cells: cellsReducer,
});

export default reducers;

//type that describes the type of information inside the store
export type RootState = ReturnType<typeof reducers>;
