import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { val } from "@theatre/core";
import { officeSheet } from "./theatreSetup";

// Define the trigger zones for each room using a start and end range
const ROOM_ZONES = [
  { id: "Engineering", start: 3.5, end: 4.8 },
  { id: "Marketing", start: 6.8, end: 8.2 },
  { id: "Design", start: 10.5, end: 12.0 },
  { id: "Meeting Room", start: 14.8, end: 16.5 },
];

export default function ScrollManager({
  setCurrentRoom,
  setHasScrolledPastStart,
}: {
  setCurrentRoom: (room: string | null) => void;
  setHasScrolledPastStart: (val: boolean) => void;
}) {
  const scroll = useScroll();
  const lastTriggeredRoom = useRef<string | null>(null);
  const lastScrolledPast = useRef<boolean>(false);

  useFrame(() => {
    if (!officeSheet || !officeSheet.sequence) return;
    const sequenceLength = val(officeSheet.sequence.pointer.length);
    const position = scroll.offset * sequenceLength;
    officeSheet.sequence.position = position;

    if (position > 2 && !lastScrolledPast.current) {
      lastScrolledPast.current = true;
      setHasScrolledPastStart(true);
    }

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
