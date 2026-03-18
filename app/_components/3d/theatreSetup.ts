"use client";

import { getProject } from "@theatre/core";
import projectState from "@/data/DigitalOfficeProject.theatre-project-state.json";
// import studio from "@theatre/studio";
// import extension from "@theatre/r3f/dist/extension";

// Initialize studio only in development mode to avoid prod bugs
// if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
//   studio.initialize();
//   studio.extend(extension);
// }

// Create the project and sheet strictly based on official docs
const project = getProject("DigitalOfficeProject", { state: projectState });
export const officeSheet = project.sheet("OfficeSceneSheet");
