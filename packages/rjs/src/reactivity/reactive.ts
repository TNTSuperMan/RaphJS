import { hook_states, rehook } from "./hook";

export const reactive = <T extends object>(target: T): T => {
    const deps = new Map<PropertyKey, symbol[]>();
    const child_proxies = new Map<PropertyKey, object>();
    const proxy = new Proxy(target, {
        get(target, prop, receiver){
            const last_id = hook_states.at(-1);
            if(last_id)
                if(!deps.has(prop)) deps.set(prop, [last_id]);
                else deps.get(prop)!.push(last_id);
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
            (deps.get(prop) ?? []).splice(0).forEach(e=>rehook(e));
            return setres;
        }
    });
    return proxy;
}
