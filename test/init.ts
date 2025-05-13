import { Window } from "happy-dom";
const window = new Window();
Object.entries(window).forEach(e=>{
    if(!Object.hasOwn(globalThis,e[0]))//@ts-ignore
        globalThis[e[0]] = e[1];
})
