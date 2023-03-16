import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }

        //check to see if we already fetched this file and it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        //if it is, return immediately
        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);

        //This identifies if it is a jsx or css file
        const fileType = args.path.match(/.css$/) ? "css" : "jsx";

        //This will remove all the new lines and escaped double and single quotes
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        //wrapping the css content with JS
        const contents =
          fileType === "css"
            ? `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `
            : data;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          //resolveDir returns the path of the last loaded file
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        //store response in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
