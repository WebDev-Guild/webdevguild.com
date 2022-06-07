import { Canvas } from "@react-three/fiber";

export default function ThreeTest({ children }) {
  return (
    <div style={{ height: "100%", background: "black" }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {children}
      </Canvas>
    </div>
  );
}
