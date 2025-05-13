import type { Expression, Property } from "acorn";
import type { JSXElement } from "../type";
import { id, JSXChild2Token, pos } from ".";
import { tags } from "./tags";

export const JSXEl2ReactiveToken = (token: JSXElement): Expression => {
    const args: Expression[] = [{
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
    }];
    if(token.openingElement.attributes.length){
        args.push({
            ...pos(token),
            type: "ObjectExpression",
            properties: token.openingElement.attributes.filter(e=>!e.name.name.startsWith("$")).map<Property>(e=>({
                ...pos(e),
                type: "Property",
                kind: "init",
                method: false,
                shorthand: false,
                computed: true,
                key: {
                    ...pos(e.name),
                    type: "Literal",
                    value: e.name.name
                },
                value: {
                    ...pos(e.value),
                    type: "ArrowFunctionExpression",
                    params: [],
                    generator: false,
                    async: false,
                    expression: true,
                    body: e.value.type == "JSXExpressionContainer" ? e.value.expression : e.value
                }
            }))
        });
        const ev = token.openingElement.attributes.filter(e=>e.name.name.startsWith("$"));
        if(ev.length) args.push({
            ...pos(token),
            type: "ObjectExpression",
            properties: ev.map<Property>(e=>({
                ...pos(e),
                type: "Property",
                kind: "init",
                method: false,
                shorthand: false,
                computed: false,
                key: {
                    ...pos(e.name),
                    type: "Identifier",
                    name: e.name.name.substring(1)
                },
                value: e.value.type == "JSXExpressionContainer" ? e.value.expression : e.value
            }))
        })
    }

    return {
        ...pos(token),
        type: "CallExpression",
        optional: false,
        callee: tags.includes(token.openingElement.name.name) ? ({
            ...pos(token.openingElement.name),
            type: "MemberExpression",
            computed: true,
            optional: false,
            object: {
                ...pos(token.openingElement.name),
                type: "Identifier",
                name: "hReactive" + id
            },
            property: {
                type: "Literal",
                value: token.openingElement.name.name,
                start: token.openingElement.start,
                end: token.openingElement.end
            },
        }) : {
            ...pos(token.openingElement.name),
            type: "Identifier",
            name: token.openingElement.name.name
        },
        arguments: args
    }
}