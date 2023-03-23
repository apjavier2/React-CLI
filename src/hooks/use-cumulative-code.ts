import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    //get a list of ordered cells
    const orderedCells = order.map((id) => data[id]);

    const showFuncNoop = `var show = () => {}`;
    const showFunc = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';
        const root = document.querySelector('#root');
        var show = (value) => {
          if(typeof value === 'object'){
            if(value.$$typeof && value.props){
              _ReactDOM.render(value, root);
            }else{
              root.innerHTML = JSON.stringify(value);
            }
          }else{
            root.innerHTML = value;
          }
      };`;

    const cumulativeCode = [];

    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          //this will give a working show function
          cumulativeCode.push(showFunc);
        } else {
          //this overrides the showFunctions from other cells, making it not print anything in the screen.
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      //only the previous cell codes will be added. Stop iteration in the current cell
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};
