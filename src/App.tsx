import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AppRoute from "./routes/app.route"
import GooeyNav from "./components/GooeyNav.js"
import LightRays from "./components/LightRays.tsx"
import Loading from "./pages/loading"

export function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 3500)
    }

    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [])

  const items = [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Projects", href: "/#projects" },
    { label: "Contact", href: "/#contact" },
  ]

  if (loading) {
    return <Loading />
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">

      {/* Fullscreen Background */}

      <div className="fixed inset-0 -z-10 pointer-events-none">

        <LightRays
          raysOrigin="top-center"
          raysColor="#10b981"
          raysSpeed={0.8}
          lightSpread={0.6}
          rayLength={3.5}
          followMouse={true}
          mouseInfluence={0.12}
          noiseAmount={0}
          distortion={0}
          className="w-full h-full opacity-60"
          pulsating={true}
          fadeDistance={1.2}
          saturation={1.2}
        />

      </div>

      {/* Navbar */}

      <nav
        className="
        fixed
        top-0
        left-0
        w-full
        z-50
        backdrop-blur-xl
        bg-[#0b0f19]/75
        border-b border-emerald-500/20
        shadow-[0_4px_20px_rgba(0,0,0,0.5)]
        "
      >

        <div
          className="max-w-7xl mx-auto h-16 px-3 sm:px-6 flex items-center justify-between"
        >

          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-wider cursor-pointer hover:text-emerald-400 transition-all flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <span className="text-gradient-emerald font-extrabold">SV</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-4 overflow-x-auto max-w-[calc(100vw-55px)] scrollbar-none py-1">
            <GooeyNav
              items={items}
              particleCount={20}
              particleDistances={[90, 10]}
              particleR={300}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={600}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />

            <div className="flex items-center gap-2 pl-1.5 sm:pl-4 border-l border-emerald-500/20 shrink-0">
              <Link
                to="/projects"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-400 hover:text-emerald-200 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                Projects
              </Link>
              <Link
                to="/blog"
                className="px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-emerald-500/10 border border-slate-700 hover:border-emerald-500/30 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}

      <main className="relative z-10 pt-16">
        <AppRoute />
      </main>

    </div>
  )
}

export default App