"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

const Grainient = dynamic(
  () => import("@/components/Grainient").then((m) => m.default),
  { ssr: false, loading: () => null }
)

/** WebGL fonni bir oz kechiktirib yuklash — birinchi ekran tez chiqadi */
const DEFER_MS = 800

export function GrainientBackground() {
  const [mounted, setMounted] = useState(false)
  const [deferDone, setDeferDone] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => setDeferDone(true), DEFER_MS)
    return () => clearTimeout(t)
  }, [mounted])

  if (!mounted || !deferDone) return null

  return (
    <div
      className="fixed inset-0 z-0 w-full h-full min-h-screen pointer-events-none"
      style={{ minHeight: "100dvh" }}
      aria-hidden
    >
      <Grainient
        timeSpeed={0.6}
        colorBalance={0}
        warpStrength={1}
        warpFrequency={2}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2}
        grainAnimated={false}
        contrast={1.5}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.9}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
