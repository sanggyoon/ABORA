import { useAnimations } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Breath({ ModelComponent, glbPath, currentAction = 'Idle' }) {
    const modelRef = useRef()
    const { actions, mixer } = useAnimations(glbPath, modelRef)

    useEffect(() => {
        console.log('Available actions:', actions);
        if (actions && currentAction && actions[currentAction]) {
            Object.values(actions).forEach((action) => action.fadeOut(0.2))
            actions[currentAction].reset().fadeIn(0.3).play()
        }
    }, [currentAction, actions])

    useFrame((_, delta) => {
        if (mixer) mixer.update(delta)
    })

    return <ModelComponent ref={modelRef} />
}
