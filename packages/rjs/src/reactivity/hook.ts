export const hook_funcs = new WeakMap<WeakKey, [()=>void, (()=>void)?]>();
export const hook_states: symbol[] = [];
export const available_hooks = new WeakSet();

export const rehook = (id: symbol) => {
    const [target, effect] = hook_funcs.get(id) ?? [];
    if(!target) throw new Error("Receive invaild rehook id");
    available_hooks.add(id);
    hook_states.push(id);
    target();
    hook_states.pop();
    effect?.();
}

export const hook = (target: ()=>void, effect?: ()=>void) => {
    const id = Symbol();
    hook_funcs.set(id, [target, effect]);
    rehook(id);
    return id;
}
