import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

//this returns a useSelector with type of RootState
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
