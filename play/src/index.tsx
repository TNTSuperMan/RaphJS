import { ref } from "../../packages/rjs/src"

const App = () => {
    const tasks = ref([] as [boolean, string][]);
    const msg = ref("");
    return <div>
        <ul>{tasks.value.map((e,i)=><li>
            <input type="checkbox" checked={e[0]} $change={e=>tasks.value[i]![0] = (e.target as HTMLInputElement).checked} />
            {tasks.value[i]![1]}
        </li>)}</ul>
        <input type="text" value={msg.value} $input={e=>msg.value = (e.target as HTMLInputElement).value} />
        <button $click={()=>tasks.value.push([false, msg.value])}>Add</button>
    </div>
}

document.body.append(<App/>);
