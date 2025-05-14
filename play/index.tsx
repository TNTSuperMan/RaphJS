import { ref } from "rjs/src"

const App = () => {
    const count = ref(0);
    return <div>
        Count: {count.value}<br/>
        <button $click={()=>count.value++}>Add</button>
    </div>
}

document.body.append(<App/>);
