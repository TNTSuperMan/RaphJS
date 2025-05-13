import { build, plugin } from "bun";
import { resolve } from "path";
import { esbuild_RjsJSX } from "../packages/rjs-transpiler/src";

build({
    entrypoints: [resolve(__dirname, "index.tsx")],
    plugins: [esbuild_RjsJSX("rjs/src")],
    //minify: true,
    outdir: "dist",
    naming: {
        chunk: "[name].[ext]"
    },
    external: ["rjs"]
})
