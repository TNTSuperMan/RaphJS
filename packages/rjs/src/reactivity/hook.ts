export const hook_funcs = new WeakMap<WeakKey, [()=>void, (()=>void)?]>();
export const hook_states: symbol[] = [];

export const rehook = (id: symbol) => {
    if(!hook_funcs.has(id)) return;
    const [target, effect] = hook_funcs.get(id)!;

    hook_funcs.delete(id);
    const new_id = Symbol();
    hook_funcs.set(new_id, [target, effect]);

    hook_states.push(new_id);
    target();
    hook_states.pop();
    effect?.();
}

export const hook = (target: ()=>void, effect?: ()=>void) => {
    const id = Symbol();
    hook_funcs.set(id, [target, effect]);
    rehook(id);
}
