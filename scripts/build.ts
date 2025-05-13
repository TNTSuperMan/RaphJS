import { $, build } from "bun";
import { resolve } from "path";

export const buildPackage = (name: string) => {
    const path = resolve(__dirname, "..", "packages", name);
    const buildWithFormat = (format: "esm" | "cjs") => build({
        entrypoints: [resolve(path, "src", "index.ts")],
        outdir: resolve(path, "dist"),
        naming: { entry: `[dir]/${format}.[ext]` },
        format,
        minify: true,
    }).then(e=>{
        e.logs.forEach(e=>console.log(`[${e.level.toUpperCase()} ${e.name}]: ${e.message}`));
        if(e.success)
            console.log("Success to build: " + e.outputs[0]?.path);
        else
            console.log("Failed to build: " + e.outputs[0]?.path);
    })
    return Promise.all([
        buildWithFormat("esm"),
        buildWithFormat("cjs"),
        $`cd ${path} && bunx tsc`.then(e=>e.exitCode == 0 ?
            console.log("Success to typecheck/declare: " + path) :
            console.log("Failed to typecheck/declare: " + path))
    ])
}

buildPackage("rjs");
buildPackage("rjs-transpiler");
