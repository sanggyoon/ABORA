// Breath.tsx
import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Breath({
                                 ModelComponent,
                                 glbPath,
                                 currentAction = 'breath', // 기본값은 breath
                               }: {
  ModelComponent: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<Record<string, unknown>> &
      React.RefAttributes<THREE.Object3D>
  >;
  glbPath: string;
  currentAction?: string;
}) {
  const modelRef = useRef<THREE.Object3D>(null);
  const { animations } = useGLTF(glbPath);
  const { actions } = useAnimations(animations, modelRef);

  useEffect(() => {

    if (!actions || !currentAction) return;

    const mappedAction = currentAction === 'Reading' ? 'left_Reading'
        : currentAction === 'Idle' ? 'breath'
            : currentAction;

    Object.values(actions).forEach((action) => {
      if (action) action.fadeOut(0.2);
    });

    const actionToPlay = actions[mappedAction];
    if (actionToPlay) {
      actionToPlay.reset().fadeIn(0.3).play();
    }
  }, [actions, currentAction]);


  return <ModelComponent ref={modelRef} />;
}
