import type { Expression } from "acorn";
import type { JSXFragment } from "../type";
import { id, JSXChild2Token, pos } from ".";

export const JSXFrag2Token = (token: JSXFragment): Expression =>
    token.children.every(el=>el.type != "JSXExpressionContainer") ? {
        ...pos(token),
        type: "CallExpression",
        optional: false,
        callee: {
            ...pos(token),
            type: "Identifier",
            name: "staticFragment" + id
        },
        arguments: token.children.map(e=>JSXChild2Token(e)).flat()
    } : {
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
            body: {
                ...pos(token),
                type: "ArrayExpression",
                elements: token.children.map(e=>JSXChild2Token(e)).flat()
            }
        }]
    };
