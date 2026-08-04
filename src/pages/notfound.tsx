import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import GlitchText from "../components/GlitchText.tsx"
import { FaHome, FaRedo, FaGamepad, FaTrophy, FaArrowLeft, FaArrowRight, FaCrosshairs, FaBolt } from "react-icons/fa"

interface Bug {
  id: number
  x: number
  y: number
  speed: number
  type: number // 0: 404 Error, 1: NullPointer, 2: SyntaxError
  label: string
  size: number
}

interface Bullet {
  id: number
  x: number
  y: number
  speed: number
  color?: string
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
}

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  // Game State
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)

  // Auto Power Up Levels (Unlocked automatically every 5 levels)
  const [craftLevel, setCraftLevel] = useState<number>(1) // 1: MK-I, 2: Quantum MK-II
  const [bulletLevel, setBulletLevel] = useState<number>(1) // 1: Single, 2: Dual Stream, 3: Triple Stream
  const [autoPowerBanner, setAutoPowerBanner] = useState<string | null>(null)
  const lastAutoPowerLevelRef = useRef<number>(0)

  // Player position (percentage 0 to 100)
  const playerXRef = useRef(50)

  // Game loop entities refs to avoid stale closures
  const bugsRef = useRef<Bug[]>([])
  const bulletsRef = useRef<Bullet[]>([])
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const lastSpawnRef = useRef<number>(0)
  const nextEntityId = useRef<number>(1)

  // Control keys state
  const keysPressed = useRef<{ [key: string]: boolean }>({})

  // Load High Score on Mount & set page title
  useEffect(() => {
    document.title = "404 - Page Not Found | Cyber Defender Arcade"
    const savedHighScore = localStorage.getItem("404_game_highscore")
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10))
    }
  }, [])

  // Start / Reset Game
  const startGame = () => {
    setIsPlaying(true)
    setGameOver(false)
    setAutoPowerBanner(null)
    lastAutoPowerLevelRef.current = 0
    setScore(0)
    setLives(3)
    setLevel(1)
    setCraftLevel(1)
    setBulletLevel(1)
    playerXRef.current = 50
    bugsRef.current = []
    bulletsRef.current = []
    particlesRef.current = []
  }

  // Fire Bullet
  const fireBullet = () => {
    if (!isPlaying || gameOver) return

    if (bulletLevel === 1) {
      // Single Laser Stream
      bulletsRef.current.push({
        id: nextEntityId.current++,
        x: playerXRef.current,
        y: 82,
        speed: 1.8,
        color: "#34d399"
      })
    } else if (bulletLevel === 2) {
      // Dual Stream Cannons (Level 5+)
      bulletsRef.current.push(
        {
          id: nextEntityId.current++,
          x: playerXRef.current - 2.5,
          y: 82,
          speed: 2.2,
          color: "#06b6d4"
        },
        {
          id: nextEntityId.current++,
          x: playerXRef.current + 2.5,
          y: 82,
          speed: 2.2,
          color: "#06b6d4"
        }
      )
    } else {
      // Triple Hyper Stream Cannons (Level 10+)
      bulletsRef.current.push(
        {
          id: nextEntityId.current++,
          x: playerXRef.current - 4,
          y: 82,
          speed: 2.5,
          color: "#f59e0b"
        },
        {
          id: nextEntityId.current++,
          x: playerXRef.current,
          y: 82,
          speed: 2.5,
          color: "#06b6d4"
        },
        {
          id: nextEntityId.current++,
          x: playerXRef.current + 4,
          y: 82,
          speed: 2.5,
          color: "#f59e0b"
        }
      )
    }
  }

  // Mouse & Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true

      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault()
        fireBullet()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (isPlaying && !gameOver) {
        if (e.button === 2 || e.button === 0) {
          e.preventDefault()
          fireBullet()
        }
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      if (isPlaying && !gameOver) {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("contextmenu", handleContextMenu)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [isPlaying, gameOver, bulletLevel])

  // Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return

    let lastTime = performance.now()

    const updateGame = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime

      // 1. Move Player (Faster movement speed if craft upgraded)
      const moveSpeed = craftLevel === 2 ? 1.8 : 1.2
      if (keysPressed.current["ArrowLeft"] || keysPressed.current["a"] || keysPressed.current["A"]) {
        playerXRef.current = Math.max(5, playerXRef.current - moveSpeed)
      }
      if (keysPressed.current["ArrowRight"] || keysPressed.current["d"] || keysPressed.current["D"]) {
        playerXRef.current = Math.min(95, playerXRef.current + moveSpeed)
      }

      // 2. Spawn Bugs
      const spawnInterval = Math.max(550, 1800 - level * 150)
      if (currentTime - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = currentTime
        const bugLabels = ["404", "NULL_ERR", "500_FAIL", "SYNTAX", "403_FORBID"]
        bugsRef.current.push({
          id: nextEntityId.current++,
          x: Math.random() * 85 + 7.5,
          y: 0,
          speed: 0.15 + Math.random() * 0.15 + level * 0.05,
          type: Math.floor(Math.random() * 3),
          label: bugLabels[Math.floor(Math.random() * bugLabels.length)],
          size: 32
        })
      }

      // 3. Update Bullets
      bulletsRef.current = bulletsRef.current
        .map((b) => ({ ...b, y: b.y - b.speed * 40 * delta }))
        .filter((b) => b.y > 0)

      // 4. Update Bugs
      bugsRef.current = bugsRef.current.filter((bug) => {
        bug.y += bug.speed * 30 * delta

        // Check if bug reached bottom (Damage Player)
        if (bug.y >= 82) {
          setLives((prev) => {
            const nextLives = prev - 1
            if (nextLives <= 0) {
              setGameOver(true)
              setIsPlaying(false)
              setHighScore((prevHigh) => {
                const newHigh = Math.max(prevHigh, score)
                localStorage.setItem("404_game_highscore", newHigh.toString())
                return newHigh
              })
            }
            return Math.max(0, nextLives)
          })
          return false
        }
        return true
      })

      // 5. Bullet & Bug Collision Detection
      bulletsRef.current.forEach((bullet) => {
        bugsRef.current.forEach((bug) => {
          const dx = Math.abs(bullet.x - bug.x)
          const dy = Math.abs(bullet.y - bug.y)

          if (dx < 6 && dy < 6) {
            // Collision! Destroy both
            bullet.y = -100 // Mark bullet for deletion
            bug.y = 200 // Mark bug for deletion

            // Add explosion particles
            const particleColor = bulletLevel >= 2 ? "#06b6d4" : "#10b981"
            for (let i = 0; i < 8; i++) {
              particlesRef.current.push({
                id: nextEntityId.current++,
                x: bug.x,
                y: bug.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: particleColor,
                life: 1.0
              })
            }

            // Increment Score & Calculate Level
            setScore((prev) => {
              const newScore = prev + 100
              const newLevel = Math.floor(newScore / 400) + 1
              setLevel(newLevel)

              // Trigger Auto-Power Upgrade on every 5 levels (Level 5, 10, 15, 20...)
              if (newLevel % 5 === 0 && lastAutoPowerLevelRef.current !== newLevel) {
                lastAutoPowerLevelRef.current = newLevel

                // Automatic craft & weapon upgrades without stopping gameplay
                setCraftLevel(2)
                setBulletLevel((prevB) => (prevB >= 2 ? 3 : 2))
                setLives(3) // Full 100% Health Restore

                const bannerText = `⚡ LEVEL ${newLevel} AUTO POWER UNLOCKED! Quantum MK-II Craft + ${
                  newLevel >= 10 ? "Triple Hyper Cannons" : "Dual Plasma Cannons"
                } + 100% Health Restored!`
                
                setAutoPowerBanner(bannerText)
                setTimeout(() => setAutoPowerBanner(null), 4000)
              }

              return newScore
            })
          }
        })
      })

      // Clean up exploded entities
      bulletsRef.current = bulletsRef.current.filter((b) => b.y > 0)
      bugsRef.current = bugsRef.current.filter((b) => b.y <= 85)

      // 6. Update Particles
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx * 0.2,
          y: p.y + p.vy * 0.2,
          life: p.life - delta * 2
        }))
        .filter((p) => p.life > 0)

      // Draw Canvas
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          // Draw Cyber Grid Lines
          ctx.strokeStyle = craftLevel === 2 ? "rgba(6, 182, 212, 0.12)" : "rgba(16, 185, 129, 0.08)"
          ctx.lineWidth = 1
          for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
            ctx.stroke()
          }
          for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(canvas.width, y)
            ctx.stroke()
          }

          // Draw Particles
          particlesRef.current.forEach((p) => {
            const px = (p.x / 100) * canvas.width
            const py = (p.y / 100) * canvas.height
            ctx.fillStyle = p.color
            ctx.globalAlpha = p.life
            ctx.beginPath()
            ctx.arc(px, py, 3, 0, Math.PI * 2)
            ctx.fill()
          })
          ctx.globalAlpha = 1.0

          // Draw Bullets
          bulletsRef.current.forEach((b) => {
            const bx = (b.x / 100) * canvas.width
            const by = (b.y / 100) * canvas.height
            ctx.fillStyle = b.color || "#34d399"
            ctx.shadowColor = b.color || "#10b981"
            ctx.shadowBlur = 10
            ctx.fillRect(bx - 3, by, 6, 14)
          })
          ctx.shadowBlur = 0

          // Draw Bugs
          bugsRef.current.forEach((bug) => {
            const bx = (bug.x / 100) * canvas.width
            const by = (bug.y / 100) * canvas.height

            // Bug Container Box
            ctx.fillStyle = "#ef4444"
            ctx.shadowColor = "#ef4444"
            ctx.shadowBlur = 12
            ctx.fillRect(bx - 30, by - 14, 60, 28)
            ctx.shadowBlur = 0

            // Bug Text Label
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 11px monospace"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(bug.label, bx, by)
          })

          // Draw Player Ship at bottom
          const px = (playerXRef.current / 100) * canvas.width
          const py = (82 / 100) * canvas.height

          if (craftLevel === 1) {
            // Standard MK-I Craft
            ctx.fillStyle = "#10b981"
            ctx.shadowColor = "#10b981"
            ctx.shadowBlur = 15
            ctx.beginPath()
            ctx.moveTo(px, py - 20)
            ctx.lineTo(px - 22, py + 15)
            ctx.lineTo(px + 22, py + 15)
            ctx.closePath()
            ctx.fill()
            ctx.shadowBlur = 0
          } else {
            // Quantum MK-II Upgraded Craft (Cyan Plasma & Dual Wing Cannons)
            ctx.shadowColor = "#06b6d4"
            ctx.shadowBlur = 20

            // Shield Aura
            ctx.strokeStyle = "rgba(6, 182, 212, 0.4)"
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(px, py - 2, 28, 0, Math.PI * 2)
            ctx.stroke()

            // Main Quantum Body
            ctx.fillStyle = "#06b6d4"
            ctx.beginPath()
            ctx.moveTo(px, py - 24)
            ctx.lineTo(px - 28, py + 18)
            ctx.lineTo(px - 10, py + 10)
            ctx.lineTo(px + 10, py + 10)
            ctx.lineTo(px + 28, py + 18)
            ctx.closePath()
            ctx.fill()

            // Wing Cannon Tips
            ctx.fillStyle = "#38bdf8"
            ctx.fillRect(px - 28, py - 2, 4, 16)
            ctx.fillRect(px + 24, py - 2, 4, 16)
            ctx.shadowBlur = 0
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateGame)
    }

    animationFrameRef.current = requestAnimationFrame(updateGame)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, gameOver, level, score, lives, craftLevel, bulletLevel])

  // Sync Canvas dimensions on resize & orientation change
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth
        canvasRef.current.height = canvasRef.current.parentElement.clientHeight
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)

    let observer: ResizeObserver | null = null
    if (canvasRef.current && canvasRef.current.parentElement) {
      observer = new ResizeObserver(() => handleResize())
      observer.observe(canvasRef.current.parentElement)
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      if (observer) observer.disconnect()
    }
  }, [])

  return (
    <div className="min-h-[88vh] flex flex-col items-center justify-center px-3 sm:px-6 lg:px-10 py-4 lg:py-6 text-foreground relative overflow-x-hidden">
      
      {/* 404 Title & Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto z-10 mb-4 lg:mb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          ERROR 404 • ROUTE_NOT_FOUND
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight">
          <GlitchText text="404" className="text-gradient-emerald" />
        </h1>

        <p className="text-foreground/80 text-xs sm:text-sm lg:text-base font-medium max-w-xl mx-auto">
          The requested page was destroyed by 404 Error Glitches! Control the <span className="text-emerald-500 font-mono font-bold">Cyber Defender</span> to blast the bugs or navigate back safely.
        </p>
      </div>

      {/* Arcade Screen Container - Expanded for Laptop Landscape & Portrait */}
      <div className="w-full max-w-full lg:max-w-6xl xl:max-w-7xl h-[440px] sm:h-[520px] lg:h-[620px] xl:h-[680px] neomorph-card rounded-3xl border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between p-3 sm:p-5 shadow-[0_0_40px_rgba(16,185,129,0.18)] bg-slate-950/90">
        
        {/* Game HUD Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-background/80 backdrop-blur-md rounded-2xl border border-border/40 z-20 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-500 font-bold">
              <FaTrophy /> SCORE: {score}
            </span>
            <span className="text-muted-foreground hidden sm:inline">
              HIGH: {highScore}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {craftLevel === 2 && (
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[11px] font-bold hidden sm:inline">
                QUANTUM MK-II
              </span>
            )}
            {bulletLevel === 2 && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold hidden sm:inline">
                DUAL CANNON
              </span>
            )}
            {bulletLevel === 3 && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-bold hidden sm:inline">
                TRIPLE CANNON
              </span>
            )}
            <span className="text-emerald-500 font-bold">LVL {level}</span>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className={`text-base transition-opacity ${
                    i < lives ? "opacity-100 text-red-500 animate-pulse" : "opacity-20 text-muted-foreground"
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* NON-BLOCKING AUTO POWER-UP NOTIFICATION BANNER */}
        {autoPowerBanner && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-lg bg-emerald-500 text-slate-950 text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.6)] border border-emerald-300 flex items-center justify-center gap-2 animate-bounce">
            <FaBolt className="text-amber-300 text-base shrink-0" />
            <span>{autoPowerBanner}</span>
          </div>
        )}

        {/* HTML5 Canvas Area */}
        <div className="w-full h-full relative flex items-center justify-center my-2">
          <canvas ref={canvasRef} className="w-full h-full absolute inset-0 block rounded-xl" />

          {/* START SCREEN OVERLAY */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-5 z-30">
              <div className="w-16 h-16 rounded-2xl neomorph-pill flex items-center justify-center text-emerald-500 text-3xl shadow-lg">
                <FaGamepad />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  404 Glitch Invaders
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                  Desktop: Use <kbd className="neomorph-pill px-2 py-0.5 rounded text-emerald-500">←</kbd> <kbd className="neomorph-pill px-2 py-0.5 rounded text-emerald-500">→</kbd> or <kbd className="neomorph-pill px-2 py-0.5 rounded text-emerald-500">A/D</kbd> to move, <kbd className="neomorph-pill px-2 py-0.5 rounded text-emerald-500">RIGHT-CLICK</kbd> / <kbd className="neomorph-pill px-2 py-0.5 rounded text-emerald-500">SPACEBAR</kbd> to shoot.
                  <br />
                  <span className="text-amber-400 font-bold">Auto Power-Ups:</span> Every 5 levels automatically unlocks Spacecraft & Cannon Upgrades + 100% Health Restores!
                </p>
              </div>

              <button
                onClick={startGame}
                className="neomorph-btn px-8 py-3.5 rounded-2xl font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-all flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/40 text-base"
              >
                <FaGamepad />
                START ARCADE GAME
              </button>
            </div>
          )}

          {/* GAME OVER SCREEN OVERLAY */}
          {gameOver && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-5 z-30">
              <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
                GAME OVER
              </span>

              <div className="space-y-2">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  Final Score: <span className="text-emerald-500">{score}</span>
                </h3>
                {score >= highScore && score > 0 && (
                  <p className="text-amber-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 animate-bounce">
                    <FaTrophy /> NEW HIGH SCORE RECORD!
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={startGame}
                  className="neomorph-btn px-6 py-3 rounded-xl font-bold text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/40"
                >
                  <FaRedo /> Play Again
                </button>

                <Link
                  to="/"
                  className="neomorph-btn px-6 py-3 rounded-xl font-semibold text-sm text-foreground hover:text-emerald-500 flex items-center gap-2"
                >
                  <FaHome /> Return Home
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE ON-SCREEN TOUCH CONTROLS */}
        <div className="w-full flex items-center justify-between px-2 pt-2 border-t border-border/30 z-20 select-none">
          <div className="flex items-center gap-2">
            <button
              onMouseDown={() => { keysPressed.current["ArrowLeft"] = true }}
              onMouseUp={() => { keysPressed.current["ArrowLeft"] = false }}
              onTouchStart={() => { keysPressed.current["ArrowLeft"] = true }}
              onTouchEnd={() => { keysPressed.current["ArrowLeft"] = false }}
              className="neomorph-btn w-12 h-10 rounded-xl flex items-center justify-center text-emerald-500 text-lg active:scale-95"
              aria-label="Move Left"
            >
              <FaArrowLeft />
            </button>
            <button
              onMouseDown={() => { keysPressed.current["ArrowRight"] = true }}
              onMouseUp={() => { keysPressed.current["ArrowRight"] = false }}
              onTouchStart={() => { keysPressed.current["ArrowRight"] = true }}
              onTouchEnd={() => { keysPressed.current["ArrowRight"] = false }}
              className="neomorph-btn w-12 h-10 rounded-xl flex items-center justify-center text-emerald-500 text-lg active:scale-95"
              aria-label="Move Right"
            >
              <FaArrowRight />
            </button>
          </div>

          <button
            onClick={fireBullet}
            onTouchStart={fireBullet}
            className="neomorph-btn px-6 h-10 rounded-xl font-extrabold text-xs text-red-500 hover:text-red-400 flex items-center gap-2 active:scale-95 bg-red-500/10 border border-red-500/30"
          >
            <FaCrosshairs /> FIRE LASER
          </button>
        </div>

      </div>

      {/* QUICK PAGE NAVIGATION LINKS */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 z-10">
        <Link
          to="/"
          className="neomorph-btn px-6 py-3 rounded-2xl font-bold text-sm text-foreground hover:text-emerald-500 transition-all flex items-center gap-2"
        >
          <FaHome className="text-emerald-500" /> Home Page
        </Link>
      </div>

    </div>
  )
}
