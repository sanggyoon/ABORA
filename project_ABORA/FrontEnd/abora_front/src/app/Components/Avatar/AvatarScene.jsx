import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import AvatarModelWithBreath from './AvatarModelWithBreath';

export default function AvatarScene({ ModelComponent, glbPath }) {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 200, near: 1, far: 50, position: [0, 0, 45] }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 0]} intensity={1} />

      <Suspense fallback={null}>
        <AvatarModelWithBreath
          ModelComponent={ModelComponent}
          glbPath={glbPath}
        />
      </Suspense>
    </Canvas>
  );
}
