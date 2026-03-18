"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { SheetProvider, editable as e } from "@theatre/r3f";
import { officeSheet } from "./theatreSetup";

const MODEL_PATH = "/office-v02.glb";

// Must live inside <Canvas> so useThree() can provide the WebGL renderer
function OfficeModel() {
  const { gl } = useThree();

  // Memoise so the loader is created once and reused across re-renders
  const ktx2Loader = useMemo(
    () =>
      new KTX2Loader()
        .setTranscoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.183.0/examples/jsm/libs/basis/",
        )
        .detectSupport(gl),
    [gl],
  );

  // Pass loader extensions to GLTFLoader *before* the fetch starts
  const { scene } = useGLTF(MODEL_PATH, true, undefined, (loader) => {
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  return (
    <e.group theatreKey="Office Model">
      <primitive object={scene} />
    </e.group>
  );
}

export default function OfficeScene() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{ position: [5, 3, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <SheetProvider sheet={officeSheet}>
          <e.ambientLight theatreKey="Ambient Light" intensity={0.5} />
          <e.directionalLight
            theatreKey="Main Light"
            position={[10, 10, 5]}
            intensity={1}
          />

          <Suspense fallback={null}>
            <OfficeModel />
            <Environment preset="city" />
          </Suspense>

          <OrbitControls makeDefault />
        </SheetProvider>
      </Canvas>
    </div>
  );
}
