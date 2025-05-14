import { ref } from "../../packages/rjs/src"

const App = () => {
    const tasks = ref([] as string[]);
    const msg = ref("");
    return <div>
        <ul>{tasks.value.map((e,i)=><li>
            <button $click={()=>tasks.value.splice(i, 1)}>X</button>
            {tasks.value[i]}
        </li>)}</ul>
        <form $submit={e=>{
                tasks.value.push(msg.value)
                msg.value = "";
                e.preventDefault();
            }}>
            <input type="submit" value="+" />
            <input type="text" value={msg.value} $input={e=>msg.value = (e.target as HTMLInputElement).value} />
        </form>
    </div>
}

document.body.append(<App/>);
