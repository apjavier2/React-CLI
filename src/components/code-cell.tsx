import "./code-cell.css";
import { useEffect } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";

import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  //Use this to update the cell inside the store and run bundling
  const { updateCell, createBundle } = useActions();

  //pull state from store: Get the bundle of the specific cell
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  const cumulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells;
    //get a list of ordered cells
    const orderedCells = order.map((id) => data[id]);

    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === "code") {
        cumulativeCode.push(c.content);
      }
      //only the previous cell codes will be added. Stop iteration in the current cell
      if (c.id === cell.id) {
        break;
      }
    }
    return cumulativeCode;
  });

  //debounce when user clicks. Bundle if user stopped typing for 3/4 second
  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }
    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content);
    }, 750);

    //this will be called when the user types in again
    return () => {
      clearTimeout(timer);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.content, cell.id]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
