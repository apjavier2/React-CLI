import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";
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
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;
        return state;

      case ActionType.DELETE_CELL:
        //delete in data
        delete state.data[action.payload];

        //delete in order
        state.order = state.order.filter((id) => id !== action.payload);

        return state;
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        //will return the index of the given id
        const index = state.order.findIndex((id) => id === action.payload.id);
        //identify new index
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        //check if out of bounds
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        //swapping:
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;

        return state;
      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          content: "",
          type: action.payload.type,
          id: randomId(),
        };

        //add cell to data
        state.data[cell.id] = cell;

        //add cell id to order
        //will return the index of the given id
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );
        //if -1 (null) add to the first part of the list
        if (foundIndex < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(foundIndex + 1, 0, cell.id);
        }

        return state;
      default:
        return state;
    }
  },
  initialState
);

const randomId = () => {
  return Math.random().toString(36).substring(2, 5);
};

export default reducer;
