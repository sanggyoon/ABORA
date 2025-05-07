/*import { useGLTF, useAnimations } from "@react-three/drei";

import { useState, useRef, useEffect } from "react";
import * as THREE from "three";

interface HoverCharacterProps {
    hover: boolean; // hover prop을 boolean 타입으로 정의
}

export default function HoverCharacter({ hover }: HoverCharacterProps) {
    const model = useGLTF("/models/chaeyoung.glb"); // GLTF 모델 로드
    const { actions } = useAnimations(model.animations, model.scene);

    const [scale, setScale] = useState(1); // 기본 크기 상태
    const currentAction = useRef<THREE.AnimationAction | null>(null);

    // 🌟 모델의 머티리얼이 올바르게 적용되도록 설정
    useEffect(() => {
        model.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (!child.material) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff, // 기본 흰색 적용
                        metalness: 0.5,
                        roughness: 0.5,
                    });
                }
            }
        });
    }, [model]);

    // 애니메이션 변경 함수
    const playAnimation = (name: string) => {
        if (!actions || !actions[name]) return;

        if (currentAction.current) {
            currentAction.current.fadeOut(0.3);
        }

        const action = actions[name];
        action?.reset().fadeIn(0.3).play();
        currentAction.current = action;
    };

    // hover 상태에 따른 크기 및 애니메이션 조정
    useEffect(() => {
        if (hover) {
            setScale(2.2); // hover 상태일 때 크기 확대
            playAnimation("idle"); // Run 애니메이션
        } else {
            setScale(2); // 원래 크기로 복귀
            playAnimation("idle"); // Idle 애니메이션
        }
    }, [hover]); // hover가 변경될 때마다 실행

    return (
        <>

            <ambientLight intensity={1}/>
            <directionalLight position={[5, 5, 5]} intensity={1}/>
            <axesHelper args={[5]} /> // 길이 5짜리 축 보이기

            <primitive
                object={model.scene}
                scale={scale} // 모델 크기 조절
                position={[0, 0, 0]}
                rotation={[0, Math.PI / 2, 0]} // 🌟 Y축 기준으로 90도 회전

            />

        </>
    );
}
*/
 
