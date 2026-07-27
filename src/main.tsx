import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

// Handle GitHub Pages SPA 404 redirect query parameter restoration
if (typeof window !== "undefined" && window.location.search.startsWith("?/")) {
  const redirectPath = window.location.search.slice(1).replace(/~and~/g, "&")
  const base = window.location.pathname.endsWith("/") ? window.location.pathname.slice(0, -1) : window.location.pathname
  window.history.replaceState(null, "", base + redirectPath + window.location.hash)
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)

