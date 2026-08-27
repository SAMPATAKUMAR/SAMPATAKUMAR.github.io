import { useEffect, useRef } from "react"

import { useTheme } from "./theme-provider"

type Palette = {
  base: string
  dot: string
  line: string
  emerald: [number, number, number]
  cyan: [number, number, number]
  violet: [number, number, number]
}

const palettes: Record<"dark" | "light", Palette> = {
  dark: {
    base: "#131927",
    dot: "rgba(226, 232, 240, 0.16)",
    line: "rgba(148, 163, 184, 0.08)",
    emerald: [16, 185, 129], cyan: [6, 182, 212], violet: [139, 92, 246],
  },
  light: {
    base: "#e4ecf7",
    dot: "rgba(15, 23, 42, 0.18)",
    line: "rgba(71, 85, 105, 0.09)",
    emerald: [5, 150, 105], cyan: [8, 145, 178], violet: [109, 40, 217],
  },
}

const rgba = ([red, green, blue]: [number, number, number], alpha: number) =>
  `rgba(${red}, ${green}, ${blue}, ${alpha})`

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    const palette = palettes[resolvedTheme]
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    let animationFrame = 0
    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const drawOrb = (x: number, y: number, radius: number, color: [number, number, number], opacity: number) => {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, rgba(color, opacity))
      gradient.addColorStop(0.45, rgba(color, opacity * 0.35))
      gradient.addColorStop(1, rgba(color, 0))
      context.fillStyle = gradient
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }

    const draw = () => {
      const time = frame / 180
      context.clearRect(0, 0, width, height)
      context.fillStyle = palette.base
      context.fillRect(0, 0, width, height)

      drawOrb(width * (0.14 + Math.sin(time * 0.7) * 0.05), height * (0.16 + Math.cos(time * 0.5) * 0.05), Math.max(width, height) * 0.55, palette.emerald, resolvedTheme === "dark" ? 0.2 : 0.15)
      drawOrb(width * (0.86 + Math.cos(time * 0.6) * 0.05), height * (0.26 + Math.sin(time * 0.4) * 0.06), Math.max(width, height) * 0.5, palette.cyan, resolvedTheme === "dark" ? 0.16 : 0.12)
      drawOrb(width * (0.52 + Math.sin(time * 0.45) * 0.08), height * (0.92 + Math.cos(time * 0.35) * 0.04), Math.max(width, height) * 0.48, palette.violet, resolvedTheme === "dark" ? 0.1 : 0.07)

      const spacing = 42
      const offset = (frame * 0.12) % spacing
      context.strokeStyle = palette.line
      context.lineWidth = 1
      for (let x = -spacing; x < width + spacing; x += spacing) {
        context.beginPath(); context.moveTo(x + offset, 0); context.lineTo(x + offset, height); context.stroke()
      }
      for (let y = -spacing; y < height + spacing; y += spacing) {
        context.beginPath(); context.moveTo(0, y - offset); context.lineTo(width, y - offset); context.stroke()
      }

      const dots = Math.min(34, Math.max(12, Math.floor((width * height) / 45_000)))
      context.fillStyle = palette.dot
      for (let index = 0; index < dots; index += 1) {
        const seed = index * 7919
        const x = ((seed * 13.7) % width + width) % width
        const y = ((seed * 7.3 + frame * (0.18 + (index % 3) * 0.04)) % (height + 80)) - 40
        context.beginPath(); context.arc(x, y, index % 5 === 0 ? 1.5 : 0.9, 0, Math.PI * 2); context.fill()
      }

      if (!reduceMotion.matches) {
        frame += 1
        animationFrame = window.requestAnimationFrame(draw)
      }
    }

    resize()
    draw()
    window.addEventListener("resize", resize)
    reduceMotion.addEventListener("change", draw)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resize)
      reduceMotion.removeEventListener("change", draw)
    }
  }, [resolvedTheme])

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" />
}
