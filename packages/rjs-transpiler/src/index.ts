import type { Plugin as ESBuildPlugin } from "esbuild";
import type { Plugin as RollupPlugin } from "rollup";
import { readFileSync } from "fs";
import { transform } from "sucrase";
import { parseJSX } from "./parse";
import type { BunPlugin } from "bun";

export { parseJSX as parseRjsJSX };
export const parseRjsTSX = (code: string) => {
    const { code: jsxCode } = transform(code, {
        jsxRuntime: "preserve",
        transforms: ["jsx", "typescript"]
    });
    return parseJSX(jsxCode);
}

export const esbuild_RjsJSX: ESBuildPlugin & BunPlugin = {
    name: "esbuild-RjsJSX",
    setup(build) {
        build.onLoad({ filter: /\.jsx$/ }, async args => ({
            loader: "js",
            contents: parseJSX(readFileSync(args.path).toString())
        }))
        build.onLoad({ filter: /\.tsx$/ }, async args => ({
            loader: "js",
            contents: parseRjsTSX(readFileSync(args.path).toString())
        }))
    },
}

export const rollup_RjsJSX: RollupPlugin = {
    name: "rollup-RjsJSX",
    transform(code, id){
        if(id.endsWith(".jsx")){
            return {
                code: parseJSX(code),
                moduleSideEffects: true
            }
        }else if(id.endsWith(".tsx")){
            return {
                code: parseRjsTSX(code),
                moduleSideEffects: true
            }
        }
    }
}
