"use client";

import Image from "next/image";
import { CSSProperties, PointerEvent, useState } from "react";

type TiltStyle = CSSProperties & {
  "--tilt-x": string;
  "--tilt-y": string;
  "--glow-x": string;
  "--glow-y": string;
};

const RESTING_TILT: TiltStyle = {
  "--tilt-x": "0deg",
  "--tilt-y": "0deg",
  "--glow-x": "50%",
  "--glow-y": "50%"
};

/** A decorative depth treatment for the existing Adaptiva hero artwork. */
export function Hero3dIllustration() {
  const [tilt, setTilt] = useState<TiltStyle>(RESTING_TILT);

  function updateTilt(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    setTilt({
      "--tilt-x": String((0.5 - y) * 7) + "deg",
      "--tilt-y": String((x - 0.5) * 9) + "deg",
      "--glow-x": String(x * 100) + "%",
      "--glow-y": String(y * 100) + "%"
    });
  }

  return (
    <div
      className="hero-3d-scene"
      onPointerMove={updateTilt}
      onPointerLeave={() => setTilt(RESTING_TILT)}
      style={tilt}
    >
      <div className="hero-3d-orbit hero-3d-orbit-one" aria-hidden="true" />
      <div className="hero-3d-orbit hero-3d-orbit-two" aria-hidden="true" />
      <div className="hero-3d-glow" aria-hidden="true" />
      <div className="hero-3d-card">
        <Image
          src="/hero-illustration.png"
          alt="Adaptiva AI transforming content into personalized accessible learning formats"
          width={480}
          height={480}
          className="hero-3d-art"
          priority
        />
      </div>
    </div>
  );
}
