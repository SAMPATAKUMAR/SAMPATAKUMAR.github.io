import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import GlitchText from "../components/GlitchText.tsx"
import { FaHome, FaArrowLeft } from "react-icons/fa"

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  angle: number
}

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    document.title = "404 - Page Not Found"

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrame: number

    const particles: Particle[] = []

    const createParticles = () => {
      particles.length = 0

      const count = Math.min(
        100,
        Math.floor((canvas.width * canvas.height) / 12000)
      )

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.5 + 0.15,
          opacity: Math.random() * 0.7 + 0.15,
          angle: Math.random() * Math.PI * 2,
        })
      }
    }

    const resizeCanvas = () => {
      const parent = canvas.parentElement

      if (!parent) return

      const rect = parent.getBoundingClientRect()

      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      createParticles()
    }

    resizeCanvas()

    window.addEventListener("resize", resizeCanvas)

    let time = 0

    const animate = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      time += 0.01

      ctx.clearRect(0, 0, width, height)

      /*
       * BACKGROUND
       */
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.7
      )

      gradient.addColorStop(0, "rgba(16, 185, 129, 0.08)")
      gradient.addColorStop(0.45, "rgba(6, 182, 212, 0.035)")
      gradient.addColorStop(1, "rgba(2, 6, 23, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      /*
       * MOVING GRID
       */
      const gridSize = 45
      const gridOffset = (time * 18) % gridSize

      ctx.lineWidth = 1
      ctx.strokeStyle = "rgba(16, 185, 129, 0.055)"

      for (let x = -gridSize; x < width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x + gridOffset, 0)
        ctx.lineTo(x + gridOffset, height)
        ctx.stroke()
      }

      for (let y = -gridSize; y < height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + gridOffset)
        ctx.lineTo(width, y + gridOffset)
        ctx.stroke()
      }

      /*
       * HORIZONTAL SCAN LINES
       */
      for (let y = 0; y < height; y += 5) {
        ctx.fillStyle = "rgba(255,255,255,0.012)"
        ctx.fillRect(0, y, width, 1)
      }

      /*
       * FLOATING PARTICLES
       */
      particles.forEach((particle) => {
        particle.y -= particle.speed

        particle.x += Math.sin(time * 2 + particle.angle) * 0.15

        if (particle.y < -10) {
          particle.y = height + 10
          particle.x = Math.random() * width
        }

        const pulse =
          particle.opacity +
          Math.sin(time * 3 + particle.angle) * 0.15

        ctx.globalAlpha = Math.max(0.05, pulse)

        ctx.fillStyle = "#34d399"

        ctx.beginPath()
        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        )
        ctx.fill()
      })

      ctx.globalAlpha = 1

      /*
       * CENTRAL GLOW
       */
      const centerX = width / 2
      const centerY = height / 2

      const pulse = 0.7 + Math.sin(time * 2) * 0.15

      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.min(width, height) * 0.35
      )

      glow.addColorStop(
        0,
        `rgba(16, 185, 129, ${0.08 * pulse})`
      )

      glow.addColorStop(
        0.5,
        `rgba(6, 182, 212, ${0.025 * pulse})`
      )

      glow.addColorStop(1, "rgba(0,0,0,0)")

      ctx.fillStyle = glow

      ctx.beginPath()
      ctx.arc(
        centerX,
        centerY,
        Math.min(width, height) * 0.35,
        0,
        Math.PI * 2
      )

      ctx.fill()

      /*
       * ORBITING RINGS
       */
      ctx.save()
      ctx.translate(centerX, centerY)

      for (let i = 0; i < 3; i++) {
        const radius =
          Math.min(width, height) * (0.22 + i * 0.055)

        ctx.rotate((i % 2 === 0 ? 1 : -1) * time * 0.25)

        ctx.strokeStyle =
          i === 1
            ? "rgba(6, 182, 212, 0.16)"
            : "rgba(16, 185, 129, 0.1)"

        ctx.lineWidth = 1

        ctx.setLineDash([4, 14])

        ctx.beginPath()
        ctx.ellipse(
          0,
          0,
          radius,
          radius * 0.35,
          i * 0.5,
          0,
          Math.PI * 2
        )
        ctx.stroke()

        ctx.setLineDash([])
      }

      ctx.restore()

      /*
       * SCANNING BEAM
       */
      const scanY = ((Math.sin(time * 0.7) + 1) / 2) * height

      const scanGradient = ctx.createLinearGradient(
        0,
        scanY - 35,
        0,
        scanY + 35
      )

      scanGradient.addColorStop(
        0,
        "rgba(16, 185, 129, 0)"
      )

      scanGradient.addColorStop(
        0.5,
        "rgba(16, 185, 129, 0.07)"
      )

      scanGradient.addColorStop(
        1,
        "rgba(16, 185, 129, 0)"
      )

      ctx.fillStyle = scanGradient
      ctx.fillRect(0, scanY - 35, width, 70)

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="min-h-[88vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 py-8 relative overflow-hidden">

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <div className="relative w-full max-w-6xl">

        {/* Status */}
        <div className="text-center mb-6 relative z-10">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(239,68,68,0.12)]">

            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />

              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>

            SYSTEM ERROR
          </div>

        </div>

        {/* Animation stage */}
        <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[570px] rounded-[2rem] overflow-hidden border border-emerald-500/20 bg-slate-950/70 backdrop-blur-xl shadow-[0_0_80px_rgba(16,185,129,0.08)]">

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">

            {/* Floating 404 */}
            <div className="relative">

              {/* Glow behind number */}
              <div className="absolute inset-0 blur-3xl opacity-30 bg-emerald-500 scale-75 animate-pulse" />

              <h1 className="relative text-[7rem] sm:text-[10rem] lg:text-[13rem] leading-none font-black tracking-[-0.08em] select-none">

                <GlitchText
                  text="404"
                  className="text-gradient-emerald drop-shadow-[0_0_35px_rgba(16,185,129,0.3)]"
                />

              </h1>

              {/* Decorative floating code */}
              <div className="absolute -top-2 -right-8 sm:-right-16 text-[9px] sm:text-xs font-mono text-cyan-400/50 animate-pulse">
                &lt;404 /&gt;
              </div>

              <div className="absolute bottom-3 -left-10 sm:-left-20 text-[9px] sm:text-xs font-mono text-emerald-400/40">
                ERR::ROUTE
              </div>

            </div>

            {/* Message */}
            <div className="relative z-10 mt-2 sm:mt-4">

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Page Not Found
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
                The route you're looking for doesn't exist,
                has been moved, or disappeared into the void.
              </p>

            </div>

            {/* Animated status */}
            <div className="mt-5 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-muted-foreground">

              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

              <span>
                SEARCHING_FOR_ROUTE...
              </span>

              <span className="text-emerald-400">
                FAILED
              </span>

            </div>

          </div>

          {/* Top decorative code */}
          <div className="absolute top-5 left-6 text-[9px] sm:text-xs font-mono text-emerald-400/30">
            SYSTEM://NAVIGATION
          </div>

          <div className="absolute top-5 right-6 text-[9px] sm:text-xs font-mono text-cyan-400/30">
            STATUS: 404
          </div>

          {/* Bottom decorative code */}
          <div className="absolute bottom-5 left-6 text-[9px] sm:text-xs font-mono text-muted-foreground/30">
            CONNECTION_LOST
          </div>

          <div className="absolute bottom-5 right-6 text-[9px] sm:text-xs font-mono text-muted-foreground/30">
            RETRY: DISABLED
          </div>

        </div>

        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7 relative z-10">

          <Link
            to="/"
            className="neomorph-btn px-6 py-3 rounded-2xl font-bold text-sm text-foreground hover:text-emerald-400 transition-all flex items-center gap-2 border border-emerald-500/20 hover:border-emerald-500/40"
          >
            <FaHome className="text-emerald-500" />
            Home Page
          </Link>

          <button
            onClick={() => window.history.back()}
            className="neomorph-btn px-6 py-3 rounded-2xl font-semibold text-sm text-foreground hover:text-cyan-400 transition-all flex items-center gap-2 border border-cyan-500/10 hover:border-cyan-500/30"
          >
            <FaArrowLeft className="text-cyan-400" />
            Go Back
          </button>

        </div>

      </div>
    </div>
  )
}