import Avatar_Claude from "./Avatar/Avatar_Claude";
import Avatar_GPT from "./Avatar/Avatar_GPT";
import Avatar_Gemini from "./Avatar/Avatar_Gemini";
import Avatar_Llama from "./Avatar/Avatar_Llama";

const slideData = [
    {
        name: 'GPT',
        Component: Avatar_GPT,
        glb: '/models/chaeyoung-breath.glb'
    },
    {
        name: 'Claude',
        Component: Avatar_Claude,
        glb: '/models/chaeyoung-breath.glb'
    },
    {
        name: 'Gemini',
        Component: Avatar_Gemini,
        glb: '/models/chaeyoung-breath.glb'
    },
    {
        name: 'Llama',
        Component: Avatar_Llama,
        glb: '/models/chaeyoung-breath.glb'
    },
]

export default slideData;
