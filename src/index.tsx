import * as esbuild from "esbuild-wasm";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    //initialization: this allows us to access the service in any part of our code
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  //calling start service upon rendering once
  useEffect(() => {
    startService();
  }, []);

  const textHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const submitHandler = async () => {
    if (!ref.current) {
      return;
    }

    //transpiling the code
    const result = await ref.current.transform(input, {
      loader: "jsx",
      target: "es2015",
    });

    //set the transformed code
    setCode(result.code);
  };

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
