"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
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

const MODEL_PATH = "/office-v02.glb";

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

// Define the trigger zones for each room based on your keyframes
const ROOM_ZONES = [
  { id: "Engineering", time: 4.067 },
  { id: "Marketing", time: 7.467 },
  { id: "Design", time: 11.3 },
  { id: "Meeting Room", time: 15.7 },
];

// Tolerance in seconds. If the camera is within 0.3s of the target time, it counts as "inside" the room.
const TOLERANCE = 0.3;

// This component handles syncing scroll to Theatre.js and triggering the UI
function ScrollManager({
  setCurrentRoom,
}: {
  setCurrentRoom: (room: string | null) => void;
}) {
  const scroll = useScroll();
  // We use a ref to remember the last triggered room so it doesn't keep popping open if the user clicks "Leave"
  const lastTriggeredRoom = useRef<string | null>(null);

  useFrame(() => {
    if (!officeSheet || !officeSheet.sequence) return;

    // 1. Sync scroll position with Theatre.js sequence
    const sequenceLength = val(officeSheet.sequence.pointer.length);
    const position = scroll.offset * sequenceLength;
    officeSheet.sequence.position = position;

    // 2. Check if we are currently inside any room's time zone
    let activeZone: string | null = null;
    for (const room of ROOM_ZONES) {
      if (Math.abs(position - room.time) < TOLERANCE) {
        activeZone = room.id;
        break;
      }
    }

    // 3. Logic to open/close UI based on the zone
    if (activeZone) {
      // If we just entered a new zone, trigger the UI
      if (lastTriggeredRoom.current !== activeZone) {
        setCurrentRoom(activeZone);
        lastTriggeredRoom.current = activeZone;
      }
    } else {
      // If we are scrolling in the hallways (outside any zone), reset everything
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
          <SheetProvider sheet={officeSheet}>
            <ScrollManager setCurrentRoom={setCurrentRoom} />

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

      {/* Scroll Hint (shows when not in a room) */}
      {!currentRoom && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2 animate-bounce pointer-events-none drop-shadow-lg">
          <span className="text-sm font-bold tracking-widest uppercase text-cyan-400">
            Scroll to Navigate
          </span>
          <svg
            className="w-6 h-6 text-cyan-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      )}

      {/* Chat Panel */}
      {currentRoom && (
        <div className="absolute top-0 right-0 w-96 h-full bg-slate-900/95 backdrop-blur-lg border-l border-slate-700 text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <div>
              <h2 className="text-2xl font-black text-cyan-400">
                # {currentRoom}
              </h2>
              <span className="text-xs text-slate-400">Online Workspace</span>
            </div>
            <button
              onClick={() => setCurrentRoom(null)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer"
            >
              Leave
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
            <div className="bg-slate-800 p-3 rounded-xl w-3/4 rounded-tl-none">
              <span className="text-xs text-cyan-400 font-bold">System</span>
              <p className="text-sm mt-1">
                Welcome to the {currentRoom} channel!
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-slate-700 bg-slate-800/50">
            <input
              type="text"
              placeholder={`Message #${currentRoom}...`}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}
