# 3D Digital Office - Virtual Workspace

A 3D virtual office web application built for the DISZCOVERY frontend challenge. The goal of this project is to blend a 3D environment with a functional, Slack-like messaging interface.

## 🚀 Core Features & Implementation Details

- **3D Navigation & Animation:** The camera flight path is fully keyframed using `Theatre.js` (`@theatre/r3f`). Users can navigate through the office sequence using **Scroll** or **Arrow Keys**.
- **Constrained Camera Look:** The camera is draggable, allowing users to look around the environment. However, the drag radius is clamped/limited to ensure they don't break the animation sequence or look outside the map boundaries.
- **Room-Specific UI & Floating Messages:** As you approach a room, fake message previews pop up physically on the 3D doors. Once inside the room's threshold, the specific chat UI for that department slides in.
- **Mock Authentication:** Implemented a solid fake login flow. It uses a JWT token stored in an `HTTP-Only` cookie, protected by Next.js Edge Middleware. If you don't log in, you can't access the `/workspace`.
- **Heavy Optimization (Mobile Ready):** 3D on the web can get heavy fast. I used `KTX2` texture compression and `MeshoptDecoder` to drastically reduce the `.glb` file size and VRAM usage. It runs buttery smooth, even on mobile devices.

## 🧠 Trade-offs & Future Improvements

Due to the estimated 8-12 hour time constraint, I had to make a few architectural decisions to prioritize stability and delivery:

- **Navigation UX:** Currently, navigation is tied to scrolling and keyboard inputs. Given more time, I would implement **Raycasting** on the physical 3D doors. This would allow users to simply point and click on a department door to trigger the camera animation and enter the room, which would provide a much more intuitive "Point-and-Click" UX.
- **Chat Backend:** The chat is currently mocked using React state to demonstrate UI responsiveness and side-effect handling (like auto-replies). In a real-world scenario, this would be hooked up to a WebSocket (e.g., Socket.io or Supabase realtime).

## 🛠️ Tech Stack

- **Core:** Next.js (App Router), React 18+
- **3D:** Three.js, React Three Fiber, `@react-three/drei`
- **Animation:** Theatre.js
- **Styling:** Tailwind CSS
- **Auth:** JWT (`jose` library)

## 🏃‍♂️ How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
   npm run dev
