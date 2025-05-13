import { hook } from "../reactivity/hook";
import { doc } from "../utils/shorthand";
import type { XNode } from "./reactive";
import { updateChild } from "./update";

const createDF = doc.createDocumentFragment.bind(doc);

export const reactiveFragment = (children: (() => XNode[] | XNode)) => {
    const el = createDF();
    let before: XNode[] = [];
    hook(()=>{
        const child = children();
        const after = Array.isArray(child) ? child : [child];
        updateChild(el, before, after);
        before = after;
    })
    return el;
}

export const staticFragment = (...children: XNode[]) => {
    const el = createDF();
    el.append(...children);
    return el;
}
