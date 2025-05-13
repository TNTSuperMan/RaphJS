export const hook_states: [symbol, ()=>void, (()=>void)?][] = [];
export const available_hooks = new WeakSet();

export const hook = (target: ()=>void, effect?: ()=>void) => {
    const id = Symbol();
    available_hooks.add(id);
    hook_states.push([id, target, effect]);
    target();
    hook_states.pop();
    effect?.();
    return id;
}
