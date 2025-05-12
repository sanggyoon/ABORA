import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import mapKoreanToShape from '../../../utils/mapKoreanToShape';

export default function FullAvatar({ glbPath, currentPhoneme, currentAction }) {
    const { scene, animations } = useGLTF(glbPath);
    const modelRef = useRef(null);
    const meshRef = useRef(null);
    const { actions } = useAnimations(animations, modelRef);

    const phonemeToIndex = {
        AA: 3,
        II: 4,
        UU: 5,
        EE: 6,
        OO: 7,
        Idle: 2
    };

    const targetInfluences = useRef(new Array(6).fill(0));

    // 립싱크 처리
    useEffect(() => {
        const newTargets = new Array(6).fill(0);
        const index = phonemeToIndex[currentPhoneme];
        if (index !== undefined) newTargets[index] = 1;
        targetInfluences.current = newTargets;
    }, [currentPhoneme]);

    useFrame(() => {
        if (!meshRef.current || !meshRef.current.morphTargetInfluences) return;
        const influences = meshRef.current.morphTargetInfluences;
        for (let i = 0; i < targetInfluences.current.length; i++) {
            influences[i] += (targetInfluences.current[i] - influences[i]) * 0.2;
        }
    });

    // 모션 애니메이션 처리
    useEffect(() => {
        if (!actions || !currentAction) return;

        const mappedAction =
            currentAction === 'Reading' ? 'left_Reading'
                : currentAction === 'Idle' ? 'breath'
                    : currentAction;

        Object.values(actions).forEach((action) => action?.fadeOut(0.2));
        actions[mappedAction]?.reset().fadeIn(0.3).play();
    }, [actions, currentAction]);

    return (
        <primitive
            object={scene}
            ref={(obj) => {
                modelRef.current = obj;
                obj?.traverse((child) => {
                    if (child.isMesh && child.morphTargetInfluences) {
                        meshRef.current = child;
                    }
                });
            }}
        />
    );
}
