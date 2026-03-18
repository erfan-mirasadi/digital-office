"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "@react-three/drei";

export default function SmoothKeyboardNavigation() {
  const scroll = useScroll();
  const velocityRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const keysPressed = useRef(new Set<string>());
  const startLoopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const animate = () => {
      if (keysPressed.current.size > 0) {
        const acceleration = scroll.el.scrollHeight * 0.00015;
        if (keysPressed.current.has("ArrowUp")) {
          velocityRef.current = Math.min(velocityRef.current + acceleration, 8);
        }
        if (keysPressed.current.has("ArrowDown")) {
          velocityRef.current = Math.max(
            velocityRef.current - acceleration,
            -8,
          );
        }
      }

      if (velocityRef.current !== 0) {
        const currentScroll = scroll.el.scrollTop;
        const maxScroll = scroll.el.scrollHeight - scroll.el.clientHeight;
        const newScroll = Math.max(
          0,
          Math.min(maxScroll, currentScroll + velocityRef.current),
        );

        scroll.el.scrollTop = newScroll;

        if (keysPressed.current.size === 0) {
          velocityRef.current *= 0.92; // Friction when no keys are pressed
        }

        if (Math.abs(velocityRef.current) < 0.2) {
          velocityRef.current = 0;
        }
      }

      if (
        keysPressed.current.size > 0 ||
        Math.abs(velocityRef.current) >= 0.2
      ) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    const startLoop = () => {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startLoopRef.current = startLoop;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [scroll]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      try {
        if (
          !event ||
          !event.key ||
          !["ArrowUp", "ArrowDown"].includes(event.key)
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (keysPressed.current.has(event.key)) {
          return;
        }
        event.preventDefault();

        keysPressed.current.add(event.key);

        // Start the animation loop if not already running
        if (startLoopRef.current) startLoopRef.current();
      } catch (error) {
        console.warn(
          "Keyboard event handling interrupted by extension:",
          error,
        );
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      try {
        if (!event || !event.key) {
          return;
        }
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
          event.stopPropagation();
          event.stopImmediatePropagation();
        }

        keysPressed.current.delete(event.key);
      } catch (error) {
        console.warn(
          "Keyboard event handling interrupted by extension:",
          error,
        );
      }
    };

    window.addEventListener("keyup", handleKeyUp, {
      passive: false,
      capture: true,
    });
    window.addEventListener("keydown", handleKeyDown, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
    };
  }, [scroll]);

  useEffect(() => {
    const handleScroll = () => {
      if (keysPressed.current.size === 0) {
        velocityRef.current = 0;
      }
    };

    scroll.el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scroll.el.removeEventListener("scroll", handleScroll);
    };
  }, [scroll]);

  return null;
}
