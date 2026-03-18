"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";
import { KTX2Loader } from "three-stdlib";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const MODEL_PATH = "/office-v03.glb";

export default function OfficeModel() {
  const { gl } = useThree();
  const ktx2Loader = useMemo(
    () =>
      new KTX2Loader()
        .setTranscoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.183.0/examples/jsm/libs/basis/",
        )
        .detectSupport(gl),
    [gl],
  );

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
