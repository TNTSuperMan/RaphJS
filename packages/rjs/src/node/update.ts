import type { XNode } from "./reactive";

export const updateChild = (parent: ParentNode, before: XNode[], after: XNode[]) => {
    while(parent.childNodes.length)
        parent.removeChild(parent.childNodes[0]!);
    parent.append(...after);
}
