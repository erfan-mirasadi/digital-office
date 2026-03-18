"use client";

import { getProject } from "@theatre/core";

// Theatre.js project & sheet for the office scene
const project = getProject("Digital Office");
export const officeSheet = project.sheet("Office Scene");

// Conditionally load Studio + R3F extension in dev mode only
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  import("@theatre/studio").then((studioModule) => {
    const studio = studioModule.default;
    import("@theatre/r3f/dist/extension").then((extensionModule) => {
      studio.initialize();
      studio.extend(extensionModule.default);
    });
  });
}
