import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function AvatarModelWithBreath({
  ModelComponent,
  glbPath,
}: {
  ModelComponent: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<Record<string, unknown>> &
      React.RefAttributes<THREE.Object3D>
  >;
  glbPath: string;
}) {
  const modelRef = useRef<THREE.Object3D>(null);
  const { animations } = useGLTF(glbPath);
  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {
    if (actions.breath) {
      actions.breath.reset().fadeIn(0.3).play();
    }
  }, [actions]);

  return <ModelComponent ref={modelRef} />;
}
