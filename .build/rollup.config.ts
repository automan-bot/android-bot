import path from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { builtinModules } from "module";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
// import esbuild from "rollup-plugin-esbuild";
import typescript from "@rollup/plugin-typescript";
import { minify } from "rollup-plugin-esbuild";
// import obfuscator from 'rollup-plugin-obfuscator';
import { defineConfig } from "rollup";
import pkg from "../package.json";
import camelCase from "lodash/fp/camelcase";
import copy from "rollup-plugin-copy";
const libraryName = "androidbot";
let whiteListedModules = ["axios", "websocket"];
export default (env = "production") => {
  return defineConfig({
    input: path.join(__dirname, "..", "src", "androidbot.ts"),
    output: {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: process.env.NODE_ENV != "production",
    },
    plugins: [
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(env),
        "process.env.__CLIENT_VERSION__": JSON.stringify(pkg.clientVersion),
      }),
      copy({
        targets: [
          // { src: 'src/bin/**/*', dest: 'dist/bin' },
        ],
      }),
      // 提供路径和读取别名
      nodeResolve({
        preferBuiltins: true,
        browser: false,
        extensions: [".mjs", ".ts", ".js", ".json", ".node"],
      }),
      commonjs({
        sourceMap: false,
      }),
      json(),
      typescript(),
      alias({
        entries: [
          // { find: '@main', replacement: path.join(__dirname, '../src/main') },
        ],
      }),
      process.env.NODE_ENV == "production" ? minify() : null,
    ],
    external: [
      ...builtinModules,
      ...Object.keys(pkg.dependencies || {}).filter(
        (d) => !whiteListedModules.includes(d)
      ),
    ],
  });
};
