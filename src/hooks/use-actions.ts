import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";
import { useMemo } from "react";

export const useActions = () => {
  const dispatch = useDispatch();
  //this will return an object containing all the different action creators,
  //the action will automatically be provided to dispatch

  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
