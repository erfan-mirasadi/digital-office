"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ScrollControls } from "@react-three/drei";
import { SheetProvider, editable as e, PerspectiveCamera } from "@theatre/r3f";
import { officeSheet } from "./theatreSetup";
import RoomOverlay from "../ui/RoomOverlay";
import SmoothKeyboardNavigation from "./SmoothKeyboardNavigation";
import CameraDragOrbit from "./CameraDragOrbit";
import ScrollManager from "./ScrollManager";
import OfficeModel from "./OfficeModel";

export default function OfficeScene() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [hasScrolledPastStart, setHasScrolledPastStart] =
    useState<boolean>(false);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas gl={{ antialias: true }}>
        <ScrollControls pages={6} damping={0.2}>
          <SmoothKeyboardNavigation />
          <CameraDragOrbit />
          <SheetProvider sheet={officeSheet}>
            <ScrollManager
              setCurrentRoom={setCurrentRoom}
              setHasScrolledPastStart={setHasScrolledPastStart}
            />

            <PerspectiveCamera
              theatreKey="Camera"
              makeDefault
              position={[0, 5, 15]}
              fov={45}
            />

            <e.ambientLight theatreKey="Ambient Light" intensity={0.5} />
            <e.directionalLight
              theatreKey="Main Light"
              position={[10, 20, 10]}
              intensity={1}
            />

            <Suspense fallback={null}>
              <OfficeModel />
              <Environment preset="warehouse" />
            </Suspense>
          </SheetProvider>
        </ScrollControls>
      </Canvas>

      <RoomOverlay
        currentRoom={currentRoom}
        onLeave={() => setCurrentRoom(null)}
        hideScrollHint={hasScrolledPastStart}
      />
    </div>
  );
}
