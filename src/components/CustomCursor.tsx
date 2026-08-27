import { useEffect, useRef, useState } from "react"

import "./CustomCursor.css"

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, label, [role='button'], .neomorph-btn, .neomorph-pill, .neomorph-card-hover, .cursor-pointer, [data-interactive='true']"

const TEXT_SELECTOR = "p, h1, h2, h3, h4, h5, h6, span, .text-type"

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateEnabled = () => setEnabled(finePointer.matches && !reducedMotion.matches)

    updateEnabled()
    finePointer.addEventListener("change", updateEnabled)
    reducedMotion.addEventListener("change", updateEnabled)
    return () => {
      finePointer.removeEventListener("change", updateEnabled)
      reducedMotion.removeEventListener("change", updateEnabled)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const cursor = cursorRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    if (!cursor || !dot || !ring) return

    document.documentElement.classList.add("has-custom-cursor")

    let animationFrame = 0
    let targetX = -100
    let targetY = -100
    let ringX = -100
    let ringY = -100
    let visible = false
    let mode = "default"

    const updateMode = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const isInteractive = Boolean(element?.closest(INTERACTIVE_SELECTOR))
      const isText = !isInteractive && Boolean(element?.closest(TEXT_SELECTOR))
      const nextMode = isInteractive ? "interactive" : isText ? "text" : "default"

      if (nextMode !== mode) {
        cursor.classList.remove(`custom-cursor--${mode}`)
        cursor.classList.add(`custom-cursor--${nextMode}`)
        mode = nextMode
      }
    }

    const renderRing = () => {
      ringX += (targetX - ringX) * 0.28
      ringY += (targetY - ringY) * 0.28
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`

      if (Math.abs(targetX - ringX) > 0.15 || Math.abs(targetY - ringY) > 0.15) {
        animationFrame = window.requestAnimationFrame(renderRing)
      } else {
        animationFrame = 0
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      updateMode(event.target)

      if (!visible) {
        cursor.classList.add("custom-cursor--visible")
        visible = true
      }
      if (!animationFrame) animationFrame = window.requestAnimationFrame(renderRing)
    }

    const hideCursor = () => {
      cursor.classList.remove("custom-cursor--visible")
      visible = false
    }

    const showCursor = () => {
      if (targetX > 0 && targetY > 0) {
        cursor.classList.add("custom-cursor--visible")
        visible = true
      }
    }

    const handlePointerDown = () => cursor.classList.add("custom-cursor--pressed")
    const handlePointerUp = () => cursor.classList.remove("custom-cursor--pressed")

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerdown", handlePointerDown, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    document.addEventListener("mouseleave", hideCursor)
    document.addEventListener("mouseenter", showCursor)
    window.addEventListener("blur", hideCursor)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      document.documentElement.classList.remove("has-custom-cursor")
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointerup", handlePointerUp)
      document.removeEventListener("mouseleave", hideCursor)
      document.removeEventListener("mouseenter", showCursor)
      window.removeEventListener("blur", hideCursor)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={cursorRef} className="custom-cursor custom-cursor--default" aria-hidden="true">
      <div ref={ringRef} className="custom-cursor__trail" />
      <div ref={dotRef} className="custom-cursor__pointer">
        <span className="custom-cursor__corner custom-cursor__corner--top-left" />
        <span className="custom-cursor__corner custom-cursor__corner--top-right" />
        <span className="custom-cursor__corner custom-cursor__corner--bottom-right" />
        <span className="custom-cursor__corner custom-cursor__corner--bottom-left" />
        <span className="custom-cursor__core" />
      </div>
    </div>
  )
}
