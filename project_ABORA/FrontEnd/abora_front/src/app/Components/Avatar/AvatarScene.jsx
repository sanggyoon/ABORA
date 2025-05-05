import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import AvatarModelWithBreath from './AvatarModelWithBreath';

function UpdateCamera({ zoom }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.zoom = zoom;
    camera.updateProjectionMatrix(); // 카메라 설정 업데이트
  }, [zoom, camera]);

  return null;
}

export default function AvatarScene({ ModelComponent, glbPath }) {
  const containerRef = useRef(null);
  const [cameraZoom, setCameraZoom] = useState(200);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setCameraZoom(width / 2); // Adjust zoom factor as needed
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        orthographic
        camera={{
          zoom: cameraZoom,
          near: 1,
          far: 50,
          position: [0, 0, 45],
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <UpdateCamera zoom={cameraZoom} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 0]} intensity={1} />

        <Suspense fallback={null}>
          <AvatarModelWithBreath
            ModelComponent={ModelComponent}
            glbPath={glbPath}
          />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
