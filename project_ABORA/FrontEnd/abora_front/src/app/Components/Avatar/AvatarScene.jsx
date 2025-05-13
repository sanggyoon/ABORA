import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import Breath from "../Avatar/motion/Breath";

function UpdateCamera({ zoom }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }, [zoom, camera]);

  return null;
}

export default function AvatarScene({
  ModelComponent,
  glbPath,
  currentAction = "idle",
}) {
  const containerRef = useRef(null);
  const [cameraZoom, setCameraZoom] = useState(200);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setCameraZoom(width / 2.5);
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
    <div ref={containerRef} style={{ height: "60vh", width: "100%" }}>
      <Canvas
        orthographic
        camera={{
          zoom: cameraZoom,
          near: 1,
          far: 50,
          position: [0, 0, 45],
        }}
      >
        <UpdateCamera zoom={cameraZoom} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 0]} intensity={1} />

        <Suspense fallback={null}>
          <Breath
            ModelComponent={ModelComponent}
            glbPath={glbPath}
            currentAction={currentAction}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
