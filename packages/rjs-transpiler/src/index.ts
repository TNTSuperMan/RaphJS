import type { Plugin as ESBuildPlugin } from "esbuild";
import type { Plugin as RollupPlugin } from "rollup";
import { readFileSync } from "fs";
import { transform } from "sucrase";
import { parseJSX } from "./parse";
import type { BunPlugin } from "bun";

export { parseJSX as parseRjsJSX };
export const parseRjsTSX = (code: string, module?: string) => {
    const { code: jsxCode } = transform(code, {
        jsxRuntime: "preserve",
        transforms: ["jsx", "typescript"]
    });
    return parseJSX(jsxCode, module);
}

export const esbuild_RjsJSX: (module?: string) => (ESBuildPlugin & BunPlugin) = (module) => ({
    name: "esbuild-RjsJSX",
    setup(build) {
        build.onLoad({ filter: /\.jsx$/ }, async args => ({
            loader: "js",
            contents: parseJSX(readFileSync(args.path).toString(), module)
        }))
        build.onLoad({ filter: /\.tsx$/ }, async args => ({
            loader: "js",
            contents: parseRjsTSX(readFileSync(args.path).toString(), module)
        }))
    },
})

export const rollup_RjsJSX: (module?: string) => RollupPlugin = (module) => ({
    name: "rollup-RjsJSX",
    transform(code, id){
        if(id.endsWith(".jsx")){
            return {
                code: parseJSX(code, module),
                moduleSideEffects: true
            }
        }else if(id.endsWith(".tsx")){
            return {
                code: parseRjsTSX(code, module),
                moduleSideEffects: true
            }
        }
    }
})
