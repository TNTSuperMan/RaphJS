import { hook } from "../reactivity/hook";
import { isString } from "../utils/isString";
import { doc } from "../utils/shorthand";
import { updateChild } from "./update";

export const createEl = doc.createElement.bind(doc);

export type XNode = string | Node;

type AttrsCallback = () => string | null | void;
type ELMethodType<S, T extends HTMLElement = HTMLElement,> = (
    this: S,
    children: () => XNode[],
    attrs?: {
        [key in keyof T]?: AttrsCallback
    } & {
        [key: string]: AttrsCallback
    },
    events?: {
        [key in keyof HTMLElementEventMap]?: (this: HTMLElement, ev: HTMLElementEventMap[key]) => void
    } & {
        [key: string]: EventListenerOrEventListenerObject
    }
) => HTMLElement;

const elMethod: ELMethodType<String> = function(children, attrs = {}, events = {}){
    const el = createEl(String(this));

    let before: XNode[] = [];
    hook(()=>{
        const after = children();
        updateChild(el, before, after);
        before = after;
    })

    hook(()=>{
        Object.entries(attrs).forEach(([name, valFn])=>{
            const val = valFn();
            if(isString(val))
                el.setAttribute(name, val);
            else
                el.removeAttribute(name);
        })
    })

    Object.entries(events).forEach(e=> //@ts-ignore
        el.addEventListener(...e));
    
    return el;
}

export const hReactive = new Proxy<{
    [key in keyof HTMLElementTagNameMap]: ELMethodType<unknown, HTMLElementTagNameMap[key]>
} & {
    [key: string]: ELMethodType<unknown>
}>({} as any,{
    get:(_, prop)=>
        isString(prop) ? elMethod.bind(Object(prop)) : undefined
});
