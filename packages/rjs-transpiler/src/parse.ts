import { type ImportSpecifier, Parser } from "acorn";
import jsx from "acorn-jsx";
import { generate } from "escodegen";
import { id, JSXEl2Token } from "./jsx";
import { JSXFrag2Token } from "./jsx/fragment";

const jsxParser = Parser.extend(jsx());

export const parseJSX = (code: string, module = "rjs") => {
    const ast = jsxParser.parse(code, {ecmaVersion: "latest", sourceType: "module"});

    ast.body.unshift({
        type: "ImportDeclaration",
        source: {
            type: "Literal",
            value: module,
            start: 0, end: 0
        },
        start: 0, end: 0,
        attributes: [],
        specifiers: ["hReactive","hStatic","reactiveFragment","staticFragment"].map<ImportSpecifier>(e=>({
            type: "ImportSpecifier",
            imported: {
                type: "Identifier",
                name: e,
                start: 0, end: 0,
            },
            local: {
                type: "Identifier",
                name: e + id,
                start: 0, end: 0,
            },
            start: 0, end: 0,
        }))
    })

    const json = JSON.stringify(ast, (_, v)=>
        v && typeof v == "object" ?
            v.type == "JSXElement"  ? JSXEl2Token(v)   :
            v.type == "JSXFragment" ? JSXFrag2Token(v) : v : v
    )

    const transpiledAST = JSON.parse(json);

    const result = generate(transpiledAST);
    return result;
}
