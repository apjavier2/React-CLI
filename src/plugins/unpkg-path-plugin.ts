import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      //This will only run if the file path is: index.js
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      //This will only run if the file path is relative or nested.
      build.onResolve({ filter: /^\.+\// }, async (args: any) => {
        return {
          //args.path ex: ./utils
          //2nd argument: https://www.unpkg.com/{resolveDir}/
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
          namespace: "a",
        };
      });

      //This will only run if it is a root package
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          path: `https://www.unpkg.com/${args.path}`,
          namespace: "a",
        };
      });

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
