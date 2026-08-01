import { useTheme } from "./theme-provider"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle Light and Dark Theme"
      className="neomorph-inset relative flex items-center w-14 h-7 p-1 rounded-full cursor-pointer focus:outline-none transition-all"
    >
      <div
        className={`neomorph-btn flex items-center justify-center w-5 h-5 rounded-full text-emerald-600 dark:text-emerald-400 transition-transform duration-300 ease-in-out ${
          isDark ? "translate-x-7 bg-[#131927]" : "translate-x-0 bg-[#e6eef8]"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5" />
        ) : (
          <Sun className="w-3.5 h-3.5" />
        )}
      </div>
    </button>
  )
}

export default ThemeToggle
