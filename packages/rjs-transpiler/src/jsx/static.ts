import type { CallExpression, Expression } from "acorn";
import type { JSXElement } from "../type";
import { id, JSXChild2Token, pos } from ".";
import { tags } from "./tags";

export const JSXEl2StaticToken = (token: JSXElement): Expression => {
    const transpiledToken: CallExpression = {
        type: "CallExpression",
        callee: tags.includes(token.openingElement.name.name) ? {
            ...pos(token.openingElement.name),
            type: "MemberExpression",
            computed: true,
            optional: false,
            object: {
                ...pos(token.openingElement.name),
                type: "Identifier",
                name: "hStatic" + id
            },
            property: { ...pos(token.openingElement.name),
                type: "Literal",
                value: token.openingElement.name.name }
        } : {
            ...pos(token.openingElement.name),
            type: "Identifier",
            name: token.openingElement.name.name
        },
        arguments: token.children.map(e=>JSXChild2Token(e)).flat(),
        optional: false,
        start: token.start,
        end: token.end
    };
    token.openingElement.attributes.forEach(e=>{
        if(e.name.name.startsWith("$")){
            transpiledToken.callee = {
                ...pos(e),
                type: "CallExpression",
                optional: false,
                callee: {
                    ...pos(e.name),
                    type: "MemberExpression",
                    object: transpiledToken.callee,
                    property: { ...pos(e.name), type: "Literal", value: e.name.name.startsWith("$") ? e.name.name.substring(1) : e.name.name },
                    computed: true,
                    optional: false
                },
                arguments: [e.value.type == "JSXExpressionContainer" ? e.value.expression : e.value]
            }
        }else{
            transpiledToken.callee = {
                ...pos(e),
                type: "MemberExpression",
                property: e.value.type == "JSXExpressionContainer" ? e.value.expression : e.value,
                computed: true,
                optional: false,
                object: {
                    ...pos(e.name),
                    type: "MemberExpression",
                    object: transpiledToken.callee,
                    property: { ...pos(e.name), type: "Literal", value: e.name.name.startsWith("$") ? e.name.name.substring(1) : e.name.name },
                    computed: true,
                    optional: false
                }
            }
        }
    })
    return transpiledToken;
}
