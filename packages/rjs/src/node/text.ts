import { hook } from "../reactivity/hook";
import { doc } from "../utils/shorthand";

export const createText = (text: ()=>string) => {
    const node = doc.createTextNode("");
    hook(() => node.nodeValue = text());
    return node;
}
