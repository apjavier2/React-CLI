import { combineReducers } from "redux";

import cellsReducer from "./cellsReducer";
import bundlesReducer from "./bundlesReducer";

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export default reducers;

//type that describes the type of information inside the store
export type RootState = ReturnType<typeof reducers>;
