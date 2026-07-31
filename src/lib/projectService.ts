export interface Project {
  id?: string
  _id?: string
  title: string
  description: string
  longDescription?: string
  image: string
  techStack: string[]
  liveDemoUrl?: string
  githubUrl?: string
  category?: string
  featured?: boolean
  createdAt?: string
}

const STORAGE_KEY = 'sampatakumar_portfolio_projects'
const RENDER_BACKEND_URL = 'https://sampatakumar-github-io.onrender.com'

const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('github.io') ? RENDER_BACKEND_URL : 'http://localhost:5000')

const API_BASE = rawApiUrl ? `${rawApiUrl.replace(/\/$/, '')}/api/projects` : '/api/projects'

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    _id: '66a4f2000000000000000001',
    title: 'Smart Skill HubX',
    description: 'AI-powered learning platform that recommends personalized learning paths and automated skill development.',
    longDescription: 'Smart Skill HubX leverages AI to analyze user skill gaps, recommend curated learning modules, track progress with interactive analytics dashboards, and issue verified completion credentials.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Groq AI'],
    liveDemoUrl: 'https://smart-skill-hubx.vercel.app',
    githubUrl: 'https://github.com/sampatakumar/smart-skill-hubx',
    category: 'AI & Web',
    featured: true,
    createdAt: '2026-06-10'
  },
  {
    id: '2',
    _id: '66a4f2000000000000000002',
    title: 'Krishi Kendra — Agriculture E-Commerce',
    description: 'Online e-commerce platform connecting farmers directly with consumers for fresh produce trading and logistics tracking.',
    longDescription: 'Krishi Kendra eliminates middlemen in agriculture by providing a direct marketplace. Features real-time price updates, weather forecasts integration, crop diagnostics, and order tracking.',
    image: '/agri.png',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    liveDemoUrl: 'https://krishi-kendra.vercel.app/',
    githubUrl: 'https://github.com/sampatakumar/Krishi-Kendra',
    category: 'Full-Stack',
    featured: true,
    createdAt: '2026-05-20'
  },
  {
    id: '3',
    _id: '66a4f2000000000000000003',
    title: 'ResumeAI Engine',
    description: 'AI-driven career builder that generates ATS-compliant resumes, cover letters, and personal portfolio sites.',
    longDescription: 'ResumeAI analyzes job descriptions using Groq AI, suggests targeted keyword enhancements, optimizes formatting for ATS parsers, and builds responsive personal sites in seconds.',
    image: '/resumeai.png',
    techStack: ['React', 'TypeScript', 'Express', 'Supabase', 'Groq AI', 'Firebase'],
    liveDemoUrl: 'https://resumeaidev.vercel.app',
    githubUrl: 'https://github.com/sampatakumar/ResumeAI',
    category: 'AI & Tools',
    featured: true,
    createdAt: '2026-07-01'
  },
  {
    id: '4',
    _id: '66a4f2000000000000000004',
    title: 'DevPulse — Realtime Code Metrics Dashboard',
    description: 'Developer analytics dashboard tracking commit velocity, code review metrics, and deployment pipelines.',
    longDescription: 'DevPulse provides actionable insights into engineering team workflows. Connects with GitHub & GitLab webhooks to display real-time CI/CD status, PR reviews, and code coverage.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    techStack: ['React', 'TypeScript', 'Node.js', 'WebSocket', 'Chart.js'],
    liveDemoUrl: 'https://devpulse-demo.vercel.app',
    githubUrl: 'https://github.com/sampatakumar/devpulse',
    category: 'Dev Tools',
    featured: false,
    createdAt: '2026-04-15'
  },
  {
    id: '5',
    _id: '66a4f2000000000000000005',
    title: 'CloudVault — Encrypted File Storage System',
    description: 'Secure, zero-knowledge end-to-end encrypted cloud document storage with instant shareable links.',
    longDescription: 'CloudVault secures files client-side before upload using AES-256-GCM encryption. Includes expiration dates on links, access PIN protection, and chunked parallel streaming.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop',
    techStack: ['React', 'Node.js', 'WebCrypto API', 'MongoDB', 'AWS S3'],
    liveDemoUrl: 'https://cloudvault-demo.vercel.app',
    githubUrl: 'https://github.com/sampatakumar/cloudvault',
    category: 'Security & Cloud',
    featured: false,
    createdAt: '2026-03-28'
  }
]

function mapProject(p: any): Project {
  return {
    ...p,
    id: p._id || p.id || 'proj_' + Math.random().toString(36).substr(2, 9)
  }
}

export async function fetchProjectsAsync(): Promise<Project[]> {
  try {
    const response = await fetch(API_BASE, {
      headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data)) {
        const mapped = data.map(mapProject)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped))
        return mapped
      }
    }
  } catch (err) {
    console.warn('MongoDB API unreachable, using LocalStorage fallback for projects:', err)
  }

  // Fallback to localStorage
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data !== null) {
      const parsed = JSON.parse(data)
      return parsed.map(mapProject)
    }
  } catch (e) {
    console.error('Error reading projects from LocalStorage', e)
  }

  // Fallback to default static list on initial run
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS))
  return INITIAL_PROJECTS
}

export async function saveProjectAsync(project: Omit<Project, 'id'> & { id?: string; _id?: string }): Promise<Project> {
  const targetId = project._id || project.id

  // Try API first
  try {
    let response: Response
    if (targetId && targetId.length === 24) {
      response = await fetch(`${API_BASE}/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      })
    } else {
      response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      })
    }

    if (response.ok) {
      const savedDb = await response.json()
      const mapped = mapProject(savedDb)
      // Sync LocalStorage
      const current = await fetchProjectsAsync()
      const updatedList = targetId ? current.map((p) => (p.id === targetId || p._id === targetId ? mapped : p)) : [mapped, ...current]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
      window.dispatchEvent(new Event('storage'))
      return mapped
    }
  } catch (err) {
    console.warn('MongoDB API unreachable, saving project to LocalStorage only:', err)
  }

  // Fallback to local save if DB API is offline
  const currentLocal = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  let updatedProject: Project

  if (targetId) {
    updatedProject = {
      ...currentLocal.find((p: any) => p.id === targetId || p._id === targetId),
      ...project,
      id: targetId
    }
    const updatedList = currentLocal.map((p: any) => (p.id === targetId || p._id === targetId ? updatedProject : p))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
  } else {
    updatedProject = {
      ...project,
      id: 'proj_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    const updatedList = [updatedProject, ...currentLocal]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
  }

  window.dispatchEvent(new Event('storage'))
  return updatedProject
}

export async function deleteProjectAsync(id: string): Promise<boolean> {
  // Try API first
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      console.log('Project deleted from MongoDB backend')
    }
  } catch (err) {
    console.warn('MongoDB API unreachable, deleting from LocalStorage only:', err)
  }

  // Sync LocalStorage
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const updatedList = current.filter((p: any) => p.id !== id && p._id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
  window.dispatchEvent(new Event('storage'))
  return true
}

export async function resetProjectsToDefaultsAsync(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE}/reset`, {
      method: 'POST'
    })
    if (response.ok) {
      const resetDb = await response.json()
      const mapped = resetDb.map(mapProject)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped))
      window.dispatchEvent(new Event('storage'))
      return mapped
    }
  } catch (err) {
    console.warn('MongoDB API reset unreachable, resetting LocalStorage only:', err)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS))
  window.dispatchEvent(new Event('storage'))
  return INITIAL_PROJECTS
}
