import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cells";

interface CellsState {
  loading: boolean;
  error: string | null;
  //array of strings
  order: string[];
  //key value pair. Key: Cell
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  return state;
};

export default reducer;
