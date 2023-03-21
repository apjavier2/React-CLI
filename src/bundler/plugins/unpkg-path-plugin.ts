import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const unpkgPathPlugin = () => {
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
    },
  };
};
