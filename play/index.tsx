import { hook, reactive, reactiveFragment, ref } from "rjs"

const App = (): Node => {
    const message = ref("");
    return <div>
        {message.value}
        <input type="text" value={message.value} $input={e=>message.value=(e.target as HTMLInputElement).value} />
    </div>
}

document.body.append(App());
