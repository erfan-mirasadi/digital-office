"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const _offsetQuat = new THREE.Quaternion();
const _pitchQuat = new THREE.Quaternion();
const _yawQuat = new THREE.Quaternion();
const _xAxis = new THREE.Vector3(1, 0, 0);
const _yAxis = new THREE.Vector3(0, 1, 0);

const DRAG_THRESHOLD = 4; // Minimum pixels to move before starting to rotate
const SENSITIVITY = 0.0004; // Mouse movement to radians
const RETURN_SPEED = 0.05; // Smoothing speed
const MAX_PITCH = Math.PI / 2.5; // Limit vertical rotation to prevent flipping
const MAX_YAW = Math.PI / 1.5; // Limit horizontal rotation

export default function CameraDragOrbit() {
  const { camera, gl } = useThree();

  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const targetOffsetX = useRef(0);
  const targetOffsetY = useRef(0);
  const currentOffsetX = useRef(0);
  const currentOffsetY = useRef(0);
  const baseQuat = useRef(new THREE.Quaternion());
  // What we set camera.quaternion to last frame
  const lastAppliedQuat = useRef(new THREE.Quaternion());

  const isInsideCanvas = useCallback(
    (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
    },
    [gl],
  );

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch") return;
      if (
        (e.target as Element).closest(
          "button, a, input, textarea, select, [role='button']",
        )
      )
        return;
      if (!isInsideCanvas(e)) return;

      isDragging.current = true;
      hasMoved.current = false;
      startX.current = e.clientX;
      startY.current = e.clientY;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || e.pointerType === "touch") return;

      if (!hasMoved.current) {
        const dx = e.clientX - startX.current;
        const dy = e.clientY - startY.current;
        if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return;
        hasMoved.current = true;
        document.body.style.cursor = "grabbing";
      }

      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;

      targetOffsetY.current += dx * SENSITIVITY;
      targetOffsetX.current += dy * SENSITIVITY;

      targetOffsetX.current = Math.max(
        -MAX_PITCH,
        Math.min(MAX_PITCH, targetOffsetX.current),
      );
      targetOffsetY.current = Math.max(
        -MAX_YAW,
        Math.min(MAX_YAW, targetOffsetY.current),
      );
    };

    const onPointerUp = () => {
      isDragging.current = false;
      hasMoved.current = false;
      document.body.style.cursor = "";
      targetOffsetX.current = 0;
      targetOffsetY.current = 0;
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { capture: true });
    window.addEventListener("pointercancel", onPointerUp, { capture: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp, { capture: true });
      window.removeEventListener("pointercancel", onPointerUp, {
        capture: true,
      });
      document.body.style.cursor = "";
    };
  }, [isInsideCanvas]);

  useFrame((state, delta) => {
    if (
      camera.quaternion.x !== lastAppliedQuat.current.x ||
      camera.quaternion.y !== lastAppliedQuat.current.y ||
      camera.quaternion.z !== lastAppliedQuat.current.z ||
      camera.quaternion.w !== lastAppliedQuat.current.w
    ) {
      baseQuat.current.copy(camera.quaternion);
    }

    const speed = 1 - Math.exp(-RETURN_SPEED * delta * 60);
    currentOffsetX.current +=
      (targetOffsetX.current - currentOffsetX.current) * speed;
    currentOffsetY.current +=
      (targetOffsetY.current - currentOffsetY.current) * speed;

    if (
      Math.abs(currentOffsetX.current) < 0.0001 &&
      Math.abs(currentOffsetY.current) < 0.0001
    ) {
      currentOffsetX.current = 0;
      currentOffsetY.current = 0;
      camera.quaternion.copy(baseQuat.current);
      lastAppliedQuat.current.copy(camera.quaternion);
      return;
    }

    _yawQuat.setFromAxisAngle(_yAxis, -currentOffsetY.current);
    _pitchQuat.setFromAxisAngle(_xAxis, -currentOffsetX.current);
    _offsetQuat.copy(_yawQuat).multiply(_pitchQuat);
    camera.quaternion.copy(baseQuat.current).multiply(_offsetQuat);
    lastAppliedQuat.current.copy(camera.quaternion);
  });

  return null;
}
