import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import ModelController from './motion/ModelController';

type AvatarSceneProps = {
  jsonFilename?: string;
  mp3Filename?: string;
  ModelComponent: React.ForwardRefExoticComponent<any>;
  glbPath: string;
  currentAction?: string;
  onAudioEnd?: () => void;
};
/*
function UpdateCamera({ zoom }: { zoom: number }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }, [zoom, camera]);

  return null;
}*/

export default function AvatarScene({
  jsonFilename,
  mp3Filename,
  ModelComponent,
  glbPath,
  currentAction = 'breath',
  onAudioEnd,
}: AvatarSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraZoom, setCameraZoom] = useState(500);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setCameraZoom(width / 3.5);
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
        <div ref={containerRef} style={{ height: '60vh', width: '95%'}}>
            <Canvas
                orthographic
                camera={{
                    zoom: 135,
                    near: 1,
                    far: 50,
                    position: [0, 0, 45],
                }}
            >
                <ambientLight intensity={1.7} />
                <directionalLight position={[10, 5, 0]} intensity={1} />


        <Suspense fallback={null}>
          <ModelController
            ModelComponent={ModelComponent}
            glbPath={glbPath}
            jsonFilename={jsonFilename}
            mp3Filename={mp3Filename}
            currentAction={currentAction}
            onAudioEnd={onAudioEnd}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
