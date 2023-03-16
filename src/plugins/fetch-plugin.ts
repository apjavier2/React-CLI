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
      /* === This will only run if the file path is: index.js === */
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return { loader: "jsx", contents: inputCode };
      });

      /* === Checking for cachedFile. This will run on ALL files === */
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //check to see if we already fetched this file and it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        //if it is, return immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      /* === This will only run if the file path ends in .css  === */
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        //This will remove all the new lines and escaped double and single quotes
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        //wrapping the css content with JS
        const contents = `
              const style = document.createElement('style');
              style.innerText = '${escaped}';
              document.head.appendChild(style);
            `;

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

      /* === This will only run if it is a js file === */
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
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
