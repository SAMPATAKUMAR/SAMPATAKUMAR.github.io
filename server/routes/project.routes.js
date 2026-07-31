import express from 'express'
import mongoose from 'mongoose'
import Project from '../models/Project.js'

const router = express.Router()

// Initial Default Seed Projects
const INITIAL_SEED_PROJECTS = [
  {
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

// Helper to check DB connection
const isDbConnected = () => mongoose.connection.readyState === 1

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_SEED_PROJECTS)
  }

  try {
    let projects = await Project.find().sort({ createdAt: -1 })
    if (projects.length === 0) {
      // Seed default projects if DB is empty
      projects = await Project.insertMany(INITIAL_SEED_PROJECTS)
    }
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects', message: err.message })
  }
})

// GET /api/projects/:id - Get single project by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params

  if (!isDbConnected()) {
    const proj = INITIAL_SEED_PROJECTS.find((p) => p._id === id)
    if (!proj) return res.status(404).json({ error: 'Project not found' })
    return res.json(proj)
  }

  try {
    const proj = await Project.findById(id)
    if (!proj) return res.status(404).json({ error: 'Project not found' })
    res.json(proj)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project', message: err.message })
  }
})

// POST /api/projects - Create project
router.post('/', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database offline', message: 'Operating in standalone mode' })
  }

  try {
    const data = req.body
    const newProject = new Project(data)
    await newProject.save()
    res.status(201).json(newProject)
  } catch (err) {
    res.status(400).json({ error: 'Failed to create project', message: err.message })
  }
})

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  const { id } = req.params
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database offline', message: 'Operating in standalone mode' })
  }

  try {
    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ error: 'Project not found' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: 'Failed to update project', message: err.message })
  }
})

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database offline', message: 'Operating in standalone mode' })
  }

  try {
    const deleted = await Project.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Project not found' })
    res.json({ message: 'Project deleted successfully', id })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project', message: err.message })
  }
})

// POST /api/projects/reset - Reset to default seed dataset
router.post('/reset', async (req, res) => {
  if (!isDbConnected()) {
    return res.json(INITIAL_SEED_PROJECTS)
  }

  try {
    await Project.deleteMany({})
    const seeded = await Project.insertMany(INITIAL_SEED_PROJECTS)
    res.json(seeded)
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset projects dataset', message: err.message })
  }
})

export default router
