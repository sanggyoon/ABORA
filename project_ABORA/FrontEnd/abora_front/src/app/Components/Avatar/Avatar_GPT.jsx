import { useGLTF } from '@react-three/drei'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'

export default function Avatar_GPT(props) {
    const { scene } = useGLTF('/models/chaeyoung.glb')
    const clonedScene = clone(scene) // ✅ 반드시 clone 해야 StrictMode에서 안깨짐

    return <primitive object={clonedScene} {...props} />
}

useGLTF.preload('/models/chaeyoung.glb')
