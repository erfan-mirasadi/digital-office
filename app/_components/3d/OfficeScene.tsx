"use client";

import { Suspense, useMemo, useState, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import { SheetProvider, editable as e, PerspectiveCamera } from "@theatre/r3f";
import { val } from "@theatre/core";
import { KTX2Loader } from "three-stdlib";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { officeSheet } from "./theatreSetup";
import RoomOverlay from "../ui/RoomOverlay";
import SmoothKeyboardNavigation from "./SmoothKeyboardNavigation";
import CameraDragOrbit from "./CameraDragOrbit";

const MODEL_PATH = "/office-v03.glb";

function OfficeModel() {
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

// Define the trigger zones for each room using a start and end range
const ROOM_ZONES = [
  { id: "Engineering", start: 3.5, end: 4.8 },
  { id: "Marketing", start: 6.8, end: 8.2 },
  { id: "Design", start: 10.5, end: 12.0 },
  { id: "Meeting Room", start: 14.8, end: 16.5 },
];

// This component handles syncing scroll to Theatre.js and triggering the UI
function ScrollManager({
  setCurrentRoom,
  setHasScrolledPastStart,
}: {
  setCurrentRoom: (room: string | null) => void;
  setHasScrolledPastStart: (val: boolean) => void;
}) {
  const scroll = useScroll();
  // We use a ref to remember the last triggered room so it doesn't keep popping open if the user clicks "Leave"
  const lastTriggeredRoom = useRef<string | null>(null);
  const lastScrolledPast = useRef<boolean>(false);

  useFrame(() => {
    if (!officeSheet || !officeSheet.sequence) return;

    // 1. Sync scroll position with Theatre.js sequence
    const sequenceLength = val(officeSheet.sequence.pointer.length);
    const position = scroll.offset * sequenceLength;
    officeSheet.sequence.position = position;

    // check if we passed second 2 to hide scroll hint permanently
    if (position > 2 && !lastScrolledPast.current) {
      lastScrolledPast.current = true;
      setHasScrolledPastStart(true);
    }

    // 2. Check if we are currently inside any room's time zone definition
    let activeZone: string | null = null;
    for (const room of ROOM_ZONES) {
      if (position >= room.start && position <= room.end) {
        activeZone = room.id;
        break;
      }
    }

    if (activeZone) {
      if (lastTriggeredRoom.current !== activeZone) {
        setCurrentRoom(activeZone);
        lastTriggeredRoom.current = activeZone;
      }
    } else {
      if (lastTriggeredRoom.current !== null) {
        setCurrentRoom(null);
        lastTriggeredRoom.current = null;
      }
    }
  });

  return null;
}

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
      {/* 3D CANVAS */}
      <Canvas gl={{ antialias: true }}>
        {/* ScrollControls replaces our old button logic. Pages = length of scroll */}
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
              <Environment preset="city" />
            </Suspense>
          </SheetProvider>
        </ScrollControls>
      </Canvas>

      {/* UI OVERLAYS */}
      <RoomOverlay
        currentRoom={currentRoom}
        onLeave={() => setCurrentRoom(null)}
        hideScrollHint={hasScrolledPastStart}
      />
    </div>
  );
}
