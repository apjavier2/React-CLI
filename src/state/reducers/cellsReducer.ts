import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cells";
import produce from "immer";
/* 
https://immerjs.github.io/immer/
Immer package allows us to edit the current state without having to use spread operators or object cloning.
It will also automatically update the state, so no need to return a new state
*/

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

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState | void => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;
        return;

      case ActionType.DELETE_CELL:
        //delete in data
        delete state.data[action.payload];

        //delete in order
        state.order.filter((id) => id !== action.payload);

        return;
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        //will return the index of the given id
        const index = state.order.findIndex((id) => id === action.payload.id);
        //identify new index
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        //check if out of bounds
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return;
        }

        //swapping:
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;

        return;
      case ActionType.INSERT_CELL_BEFORE:
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
