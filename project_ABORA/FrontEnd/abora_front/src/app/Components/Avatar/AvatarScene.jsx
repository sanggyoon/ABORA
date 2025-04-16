import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { OrbitControls } from "@react-three/drei";

export default function AvatarScene({ ModelComponent }) {
    const [hover, setHover] = useState(false);

    return (
        <Canvas
            orthographic
            camera={{
                zoom: 50,
                near: 1,
                far: 50,
                position: [7, 0, 45],
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            style={{
                width: '500px',
                height: '500px',
            }}
        >
            <ambientLight intensity={1.5}/>
            <directionalLight position={[5, 5, 0]} intensity={1}/>
            {/*<axesHelper args={[5]}/> // 길이 5짜리 축 보이기*/}
            <Suspense fallback={null}>
                <ModelComponent scale={1.5} position={[0, 0, 0]} />
            </Suspense>

            {/*<OrbitControls />*/}
        </Canvas>
    );
}
