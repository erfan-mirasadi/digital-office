"use client";

interface ScrollHintProps {
  isHidden: boolean;
}

export default function ScrollHint({ isHidden }: ScrollHintProps) {
  return (
    <div
      className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2 animate-bounce pointer-events-none drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-opacity duration-500 delay-200 ${
        isHidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="text-sm font-bold tracking-widest uppercase text-cyan-400 text-center">
        Scroll or use{" "}
        <kbd className="font-sans border border-cyan-400/50 rounded px-1 text-xs mx-0.5">
          ↑
        </kbd>{" "}
        <kbd className="font-sans border border-cyan-400/50 rounded px-1 text-xs mx-0.5">
          ↓
        </kbd>{" "}
        keys
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
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}
