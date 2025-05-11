import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function LipSyncAvatar({ glbPath, currentPhoneme }) {
    const { scene } = useGLTF(glbPath);
    const meshRef = useRef(null);
    const [targetInfluences, setTargetInfluences] = useState(Array(6).fill(0));

    const phonemeToIndex = {
        AA: 3,
        II: 4,
        UU: 5,
        EE: 6,
        OO: 7,
        Idle: 2,
    };

    useEffect(() => {
        const newTargets = Array(6).fill(0);
        const index = phonemeToIndex[currentPhoneme];
        if (index !== undefined) newTargets[index] = 1;
        setTargetInfluences(newTargets);
    }, [currentPhoneme]);

    useFrame(() => {
        if (!meshRef.current || !meshRef.current.morphTargetInfluences) return;
        const influences = meshRef.current.morphTargetInfluences;
        for (let i = 0; i < targetInfluences.length; i++) {
            influences[i] += (targetInfluences[i] - influences[i]) * 0.2;
        }
    });

    return (
        <primitive
            object={scene}
            ref={(obj) => {
                if (!obj) return;
                obj.traverse((child) => {
                    if (child.isMesh && child.morphTargetInfluences) {
                        meshRef.current = child;
                    }
                });
            }}
        />
    );
}
