export interface Project {
  id: string
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

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
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

export async function fetchProjectsAsync(): Promise<Project[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('Error reading projects from storage', e)
  }
  // Initialize default projects if none stored
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS))
  return INITIAL_PROJECTS
}

export async function saveProjectAsync(project: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
  const current = await fetchProjectsAsync()
  let updatedProject: Project

  if (project.id) {
    // Update existing
    updatedProject = {
      ...current.find((p) => p.id === project.id)!,
      ...project,
      id: project.id
    }
    const updatedList = current.map((p) => (p.id === project.id ? updatedProject : p))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
  } else {
    // Create new
    updatedProject = {
      ...project,
      id: 'proj_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    const updatedList = [updatedProject, ...current]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
  }

  window.dispatchEvent(new Event('storage'))
  return updatedProject
}

export async function deleteProjectAsync(id: string): Promise<boolean> {
  const current = await fetchProjectsAsync()
  const updatedList = current.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
  window.dispatchEvent(new Event('storage'))
  return true
}

export async function resetProjectsToDefaultsAsync(): Promise<Project[]> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS))
  window.dispatchEvent(new Event('storage'))
  return INITIAL_PROJECTS
}
