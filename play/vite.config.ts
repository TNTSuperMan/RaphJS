import { rollup_RjsJSX } from "../packages/rjs-transpiler/src";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [rollup_RjsJSX("../../packages/rjs/src")]
})