import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AppRoute from "./routes/app.route"
import GooeyNav from "./components/GooeyNav.js"
import Loading from "./pages/loading"
import ThemeToggle from "./components/ThemeToggle"
import CustomCursor from "./components/CustomCursor"

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
    { label: "Stack", href: "/#skills" },
    { label: "Projects", href: "/#projects" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" },
  ]

  if (loading) {
    return <Loading />
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground bg-background transition-colors duration-300">
      <CustomCursor />

      {/* Navbar */}

      <nav
        className="
        fixed
        top-0
        left-0
        w-full
        z-50
        neomorph-card
        backdrop-blur-xl
        bg-background/85
        border-b border-border/40
        transition-colors duration-300
        "
      >

        <div
          className="max-w-7xl mx-auto h-16 px-3 sm:px-6 flex items-center justify-between"
        >

          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-wider cursor-pointer hover:opacity-90 transition-all flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
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
                to="/services"
                className="neomorph-btn px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-all flex items-center gap-1.5 whitespace-nowrap bg-emerald-500/10 border border-emerald-500/30"
              >
                Services
              </Link>
              <Link
                to="/projects"
                className="neomorph-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground/80 hover:text-emerald-500 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                Projects
              </Link>
              <Link
                to="/blog"
                className="neomorph-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground/80 hover:text-emerald-500 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                Blog
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}

      <main className="pt-16">
        <AppRoute />
      </main>

    </div>
  )
}

export default App