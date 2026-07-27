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
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="w-full h-full"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
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
        backdrop-blur-md
        bg-black/10
        border-b border-white/10
        "
      >

        <div
          className="max-w-7xl mx-auto h-16 px-3 sm:px-6 flex items-center justify-between"
        >

          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-wider cursor-pointer hover:text-blue-400 transition-colors shrink-0">
            SV
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

            <div className="flex items-center gap-2 pl-1.5 sm:pl-4 border-l border-white/10 shrink-0">
              <Link
                to="/blog"
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 text-[11px] sm:text-xs font-semibold text-blue-300 hover:text-white transition-all flex items-center gap-1.5 whitespace-nowrap"
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