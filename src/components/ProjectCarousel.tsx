import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaGithub, FaExternalLinkAlt, FaArrowRight, FaRocket } from 'react-icons/fa'
import { type Project } from '../lib/projectService'

interface ProjectCarouselProps {
  projects: Project[]
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const total = projects.length

  const handleNext = useCallback(() => {
    if (total === 0) return
    setActiveIndex((prev) => (prev + 1) % total)
  }, [total])

  const handlePrev = useCallback(() => {
    if (total === 0) return
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (diff > 40) {
      handleNext()
    } else if (diff < -40) {
      handlePrev()
    }
    setTouchStart(null)
  }

  // Auto slide effect
  useEffect(() => {
    if (isPaused || total <= 1) return
    const interval = setInterval(() => {
      handleNext()
    }, 4500)
    return () => clearInterval(interval)
  }, [isPaused, total, handleNext])

  if (total === 0) return null

  return (
    <div
      className="relative w-full max-w-6xl mx-auto py-4 sm:py-8 touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main 3D Stage */}
      <div className="relative h-[480px] sm:h-[480px] w-full flex items-center justify-center overflow-hidden sm:overflow-visible">
        {projects.map((project, idx) => {
          // Calculate relative position
          let diff = idx - activeIndex
          if (diff < -1 && activeIndex === total - 1 && idx === 0) diff = 1
          if (diff > 1 && activeIndex === 0 && idx === total - 1) diff = -1

          const isCenter = diff === 0
          const isRight = diff === 1 || (diff > 1 && idx > activeIndex)
          const isLeft = diff === -1 || (diff < -1 && idx < activeIndex)

          let transformClass = 'opacity-0 scale-75 pointer-events-none translate-x-0 z-0'
          if (isCenter) {
            transformClass = 'translate-x-0 scale-100 opacity-100 z-30 shadow-[0_15px_40px_rgba(16,185,129,0.3)] border-emerald-500/60 pointer-events-auto'
          } else if (isRight) {
            transformClass = 'translate-x-[20%] sm:translate-x-[55%] lg:translate-x-[65%] scale-[0.82] sm:scale-[0.88] opacity-40 sm:opacity-60 z-20 border-slate-700 pointer-events-auto cursor-pointer hover:opacity-90'
          } else if (isLeft) {
            transformClass = '-translate-x-[20%] sm:-translate-x-[55%] lg:-translate-x-[65%] scale-[0.82] sm:scale-[0.88] opacity-40 sm:opacity-60 z-20 border-slate-700 pointer-events-auto cursor-pointer hover:opacity-90'
          }

          return (
            <div
              key={project.id}
              onClick={() => {
                if (isLeft) handlePrev()
                if (isRight) handleNext()
              }}
              className={`absolute top-0 w-[90%] max-w-[310px] sm:max-w-[420px] lg:max-w-[460px] transition-all duration-700 ease-out glass-panel rounded-3xl overflow-hidden group flex flex-col justify-between ${transformClass}`}
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden border-b border-emerald-500/20 bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {project.featured && (
                    <span className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                      Featured
                    </span>
                  )}
                  {project.category && (
                    <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {project.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tech stack badges */}
                  <div className="flex gap-1 flex-wrap pt-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-6 pt-0 flex gap-2.5">
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="emerald-glow-btn px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FaExternalLinkAlt className="text-[10px]" /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="emerald-glow-btn px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FaGithub className="text-sm" /> Code
                  </a>
                )}
              </div>

            </div>
          )
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 mt-4 sm:mt-6 z-40 relative">
        
        {/* Navigation Buttons & Pagination Dots */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handlePrev}
            aria-label="Previous Project"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-panel border border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-400 transition-all flex items-center justify-center shadow-lg active:scale-95"
          >
            <FaChevronLeft size={16} />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full ${
                  idx === activeIndex
                    ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-emerald-400 shadow-[0_0_10px_#10b981]'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next Project"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-panel border border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-400 transition-all flex items-center justify-center shadow-lg active:scale-95"
          >
            <FaChevronRight size={16} />
          </button>
        </div>

        {/* View All Projects Button */}
        <Link
          to="/projects"
          className="emerald-glow-btn px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-extrabold inline-flex items-center gap-2.5 shadow-xl hover:scale-105 transition-all"
        >
          <FaRocket /> View All Projects ({projects.length}) <FaArrowRight />
        </Link>

      </div>

    </div>
  )
}
