import { isString } from "../utils/isString";
import { createEl, type XNode } from "./reactive";

const createHSProxy = (el: HTMLElement, arg: string[]) =>
    new Proxy((...nodes: XNode[])=>{
        el.append(...nodes);
        return el;
    },{
    get(_, prop: unknown){
        if(isString(prop)){
            arg.push(prop)
            if(arg.length == 2){
                el.setAttribute(
                    arg.shift()!,
                    arg.pop()!
                );
            }
        }else if(typeof prop == "function" && arg.length)
            //@ts-ignore
            el.addEventListener(arg.pop()!, prop);
        return createHSProxy(el, arg);
    }
})

export const hStatic = new Proxy<{
    [key in keyof HTMLElementTagNameMap]: ReturnType<typeof createHSProxy>
} & {
    [key: string]: ReturnType<typeof createHSProxy>
}>({} as any,{
    get:(t, prop)=>
        isString(prop) ?
            createHSProxy(createEl(prop),[]) : undefined
})
