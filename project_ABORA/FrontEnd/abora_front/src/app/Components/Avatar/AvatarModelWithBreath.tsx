import { useGLTF, useAnimations } from '@react-three/drei'
import { useRef, useEffect, useMemo, forwardRef } from 'react'

export default function AvatarModelWithBreath({ModelComponent, glbPath}: {
    ModelComponent: React.ElementType;
    glbPath: string;
}) {
    const modelRef = useRef(null);
    const { animations } = useGLTF(glbPath)
    const { actions, mixer } = useAnimations(animations, modelRef)

    useEffect(() => {
        if (actions.breath) {
            actions.breath.reset().fadeIn(0.3).play()
        }
    }, [actions])

    return <ModelComponent ref={modelRef} />
}
