import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Avatar_Claude(props){
    const {scene} = useGLTF("/models/chaeyoung.glb")
    return <primitive object={scene} {...props}/>
}