import ReactDOM from "react-dom";
import { useState } from "react";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const textHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const submitHandler = () => {};

  return (
    <div>
      <textarea value={input} onChange={textHandler}></textarea>
      <div>
        <button onClick={submitHandler}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
