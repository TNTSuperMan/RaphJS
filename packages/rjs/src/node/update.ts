import type { XNode } from "./reactive";

export const updateChild = (mark: Comment, before: XNode[], after: XNode[]) => {
    for(let i = 0;i < before.length;i++)
        mark.previousSibling?.remove();
    after.forEach(e=>mark.before(e));
}
