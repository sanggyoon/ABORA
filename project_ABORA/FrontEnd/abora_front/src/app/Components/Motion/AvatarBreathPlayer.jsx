import { useAnimations } from '@react-three/drei'
import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export default function AvatarBreathPlayer({ modelRef, animations }) {
    const { actions, mixer } = useAnimations(animations, modelRef)

    useEffect(() => {
        if (actions.breath) {
            actions.breath.reset().fadeIn(0.3).play()
        }
    }, [actions])

    useFrame((_, delta) => mixer?.update(delta))

    return null // 렌더링 안 함, 애니메이션만 관리
}
