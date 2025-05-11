import { useAnimations } from '@react-three/drei'
import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export default function AvatarReadingPlayer({modelRef,animation}){
    const { actions, mixer } = useAnimations(animations, modelRef)

    useEffect(() => {
        if()
    }, []);
}