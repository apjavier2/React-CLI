import * as esbuild from "esbuild-wasm";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

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
    // const result = await ref.current.transform(input, {
    //   loader: "jsx",
    //   target: "es2015",
    // });

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    //set the transformed code
    // setCode(result.code);

    setCode(result.outputFiles[0].text);
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
