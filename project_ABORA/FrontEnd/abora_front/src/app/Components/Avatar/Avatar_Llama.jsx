import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Avatar_Llama(props){
    const { scene } = useGLTF('/models/chaeyoung.glb')
    return <primitive object={scene} scale={1.5} position={[0, 0, 0]} {...props} />
}