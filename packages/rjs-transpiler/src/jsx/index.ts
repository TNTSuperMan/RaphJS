import type { Expression, Node, SpreadElement } from "acorn";
import type { JSXChild, JSXElement } from "../type";
import { isStatic } from "./isStatic";
import { JSXEl2ReactiveToken } from "./reactive";
import { JSXEl2StaticToken } from "./static";

export const pos = (token: Node) => ({
    start: token.start,
    end: token.end
})

export const id = "$" + Array(5).fill(0).map(()=>Math.round(Math.random()*35).toString(36)).join("");

export const JSXChild2Token = (token: JSXChild): (Expression|SpreadElement)[] => {
    switch(token.type){
        case "JSXElement": return [JSXEl2Token(token)];
        case "JSXFragment": return token.children.map(e=>JSXChild2Token(e)).flat();
        case "JSXText": return [{
            type: "Literal",
            value: token.value.trim(),
            start: token.start,
            end: token.end
        }];
        case "JSXExpressionContainer": return [{
            ...pos(token),
            type: "CallExpression",
            optional: false,
            callee: {
                ...pos(token),
                type: "Identifier",
                name: "reactiveFragment" + id
            },
            arguments: [{
                ...pos(token),
                type: "ArrowFunctionExpression",
                params: [],
                generator: false,
                async: false,
                expression: true,
                body: token.expression
            }]
        }];
    }
}

export const JSXEl2Token = (token: JSXElement): Expression =>
    isStatic(token) ?
        JSXEl2StaticToken(token) :
        JSXEl2ReactiveToken(token);

