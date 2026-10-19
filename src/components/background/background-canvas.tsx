"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./scene"), { ssr: false });

// If WebGL is unavailable the page should still render normally.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function BackgroundCanvas() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <SceneBoundary>
        <Scene />
      </SceneBoundary>
    </div>
  );
}
