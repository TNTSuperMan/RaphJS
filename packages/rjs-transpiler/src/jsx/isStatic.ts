import type { JSXElement } from "../type";

export const isStatic = (token: JSXElement): boolean =>
    token.openingElement.attributes.every(attr=>
        attr.name.name.startsWith("$") || attr.value.type == "Literal");
