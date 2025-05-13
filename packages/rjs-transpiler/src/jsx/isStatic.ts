import type { JSXElement } from "../type";

export const isStatic = (token: JSXElement): boolean =>
    token.openingElement.attributes.every(attr=>
        attr.value.type == "Literal");
