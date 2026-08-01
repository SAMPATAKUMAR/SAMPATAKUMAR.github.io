import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaGithub, FaExternalLinkAlt, FaSearch, FaArrowLeft, FaCode, FaRocket, FaFilter, FaTimes } from 'react-icons/fa'
import { fetchProjectsAsync, type Project } from '../lib/projectService'
import ScrollReveal from '../components/ScrollReveal'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchProjectsAsync().then((data) => setProjects(data))

    const handleStorage = () => {
      fetchProjectsAsync().then((data) => setProjects(data))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Categories derived from projects
  const categories = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return ['All', ...Array.from(set)]
  }, [projects])

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
      const q = searchQuery.toLowerCase().trim()
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [projects, selectedCategory, searchQuery])

  return (
    <div className="min-h-screen pb-24 px-4 sm:px-8 max-w-7xl mx-auto text-foreground">
      
      {/* Top Header Navigation */}
      <div className="pt-8 pb-6 flex items-center justify-between">
        <Link
          to="/"
          className="neomorph-btn px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
        >
          <FaArrowLeft /> Back to Portfolio Home
        </Link>
        <span className="neomorph-pill text-xs font-mono text-emerald-600 dark:text-emerald-400 px-3.5 py-1.5 rounded-full font-semibold">
          Showing {filteredProjects.length} Projects
        </span>
      </div>

      {/* Hero Banner */}
      <div className="text-center py-12 space-y-4">
        <div className="neomorph-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <FaRocket /> Software Engineering Portfolio
        </div>
        <ScrollReveal textClassName="text-4xl sm:text-6xl font-extrabold text-gradient-emerald">
          Full-Stack Projects Gallery
        </ScrollReveal>
        <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg">
          Explore interactive web applications, AI integrations, REST APIs, and microservices crafted with React, Node.js, and TypeScript.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="neomorph-card rounded-3xl p-6 mb-12 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
            <input
              type="text"
              placeholder="Search by project name or tech stack (e.g., React, MongoDB)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neomorph-inset w-full pl-11 pr-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm text-foreground placeholder:text-muted-foreground font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap overflow-x-auto w-full md:w-auto">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1 font-mono">
              <FaFilter /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'neomorph-pressed bg-emerald-500 text-slate-950 font-bold'
                    : 'neomorph-btn text-foreground/80 hover:text-emerald-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="neomorph-card rounded-3xl p-12 text-center space-y-4">
          <FaCode className="text-4xl text-muted-foreground mx-auto" />
          <h3 className="text-xl font-bold text-foreground">No projects found matching your search</h3>
          <p className="text-muted-foreground text-sm">Try clearing your search query or selecting another category.</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}
            className="neomorph-btn px-6 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 dark:text-emerald-400"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="neomorph-card neomorph-card-hover rounded-3xl overflow-hidden group flex flex-col justify-between"
            >
              <div>
                {/* Project Image Header */}
                <div className="relative h-56 w-full overflow-hidden border-b border-border/40 bg-background/50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80"></div>
                  
                  {project.featured && (
                    <span className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      Featured
                    </span>
                  )}

                  {project.category && (
                    <span className="absolute bottom-3 left-3 neomorph-pill text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex gap-1.5 flex-wrap pt-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="neomorph-pill px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neomorph-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                    >
                      <FaExternalLinkAlt className="text-[10px]" /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neomorph-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                    >
                      <FaGithub className="text-sm" /> Code
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProjectModal(project)}
                  className="text-xs text-muted-foreground hover:text-emerald-500 underline font-medium"
                >
                  Details
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Detailed Project Modal */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="neomorph-card max-w-2xl w-full rounded-3xl overflow-hidden border border-border/50 shadow-2xl relative my-auto animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col">
            
            <button
              onClick={() => setSelectedProjectModal(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full neomorph-btn text-foreground hover:text-emerald-500 transition-all flex items-center justify-center"
            >
              <FaTimes />
            </button>

            <div className="h-56 sm:h-64 w-full relative shrink-0">
              <img
                src={selectedProjectModal.image}
                alt={selectedProjectModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
            </div>

            <div className="p-6 md:p-8 space-y-4 overflow-y-auto flex-1">
              <div className="flex items-center gap-2">
                <span className="neomorph-pill text-emerald-600 dark:text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold">
                  {selectedProjectModal.category || 'Project'}
                </span>
                {selectedProjectModal.createdAt && (
                  <span className="text-xs text-muted-foreground font-mono">Added: {selectedProjectModal.createdAt}</span>
                )}
              </div>

              <h2 className="text-3xl font-extrabold text-gradient-emerald">{selectedProjectModal.title}</h2>

              <p className="text-foreground/90 text-sm md:text-base leading-relaxed">
                {selectedProjectModal.longDescription || selectedProjectModal.description}
              </p>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 tracking-wider font-bold">Technologies Used</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedProjectModal.techStack.map((tech) => (
                    <span key={tech} className="neomorph-pill px-3 py-1 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border/40">
                {selectedProjectModal.liveDemoUrl && (
                  <a
                    href={selectedProjectModal.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neomorph-btn px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
                  >
                    <FaExternalLinkAlt /> Launch Live Application
                  </a>
                )}
                {selectedProjectModal.githubUrl && (
                  <a
                    href={selectedProjectModal.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neomorph-btn px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
                  >
                    <FaGithub /> Source Code
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
