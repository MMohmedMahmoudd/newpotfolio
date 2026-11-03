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
      <div className="absolute -left-1/4 top-1/4 h-[60vh] w-[60vh] animate-blob rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-900/25" />
      <div className="animation-delay-4000 absolute -right-1/4 bottom-0 h-[70vh] w-[70vh] animate-blob rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-900/30" />
      <SceneBoundary>
        <Scene />
      </SceneBoundary>
      <div className="bg-grain absolute inset-0" />
    </div>
  );
}
