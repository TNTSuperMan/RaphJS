import { available_hooks, hook, hook_states } from "./hook";

export const reactive = <T extends object>(target: T): T => {
    let deps: [PropertyKey, symbol, ()=>void, (()=>void)?][] = [];
    const child_proxies = new Map<PropertyKey, object>();
    const proxy = new Proxy(target, {
        get(target, prop, receiver){
            const last_hs = hook_states.at(-1);
            if(last_hs)
                deps.push([prop, ...last_hs]);
            const value = Reflect.get(target, prop, receiver) as unknown;
            if(typeof value == "object" && value)
                if(child_proxies.has(prop)){
                    return child_proxies.get(prop);
                }else{
                    const child_proxy = reactive(value);
                    child_proxies.set(prop, child_proxy);
                    return child_proxy;
                }
            return value;
        },
        set(target, prop, val, receiver){
            const setres = Reflect.set(target, prop, val, receiver);
            deps = deps.filter(e=>available_hooks.has(e[1]));
            deps.filter(e=>e[0] == prop).forEach(e=>{
                available_hooks.delete(e[1]);
                hook(e[2], e[3]);
            });
            return setres;
        }
    });
    return proxy;
}
