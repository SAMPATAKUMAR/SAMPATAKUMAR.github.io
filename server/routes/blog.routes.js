import express from 'express'
import mongoose from 'mongoose'
import Blog from '../models/Blog.js'

const router = express.Router()

// Initial Seed Data
const INITIAL_SEED_POSTS = [
  {
    _id: '66a4f1000000000000000001',
    title: 'Building Scalable Web Applications with React 19 & Modern CSS',
    slug: 'building-scalable-web-apps-react-19',
    excerpt: 'Explore state-of-the-art patterns for building hyper-performant React applications with modern CSS features, server actions, and dynamic asset streaming.',
    category: 'Engineering',
    tags: ['React', 'TypeScript', 'CSS', 'Performance'],
    publishedAt: '2026-07-15',
    readTime: '6 min read',
    views: 1420,
    likes: 184,
    status: 'published',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Sampatakumar V',
      avatar: '/avatar.png',
      role: 'Student'
    },
    content: `Building modern web applications requires a fine balance between developer productivity, lightning-fast render performance, and sleek UI aesthetics.\n\n## Why React 19 Matters\nReact 19 introduces seamless handling of async operations, built-in asset loading, and optimized compiler features that drastically minimize unnecessary re-renders.`
  },
  {
    _id: '66a4f1000000000000000002',
    title: 'Designing Intuitive Micro-Interactions for Modern Web Interfaces',
    slug: 'designing-intuitive-micro-interactions',
    excerpt: 'How subtle animations, tactile feedback, and glassmorphic visuals transform ordinary user interfaces into captivating digital experiences.',
    category: 'UI/UX Design',
    tags: ['UI/UX', 'Animation', 'CSS', 'Design Systems'],
    publishedAt: '2026-07-20',
    readTime: '4 min read',
    views: 980,
    likes: 132,
    status: 'published',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Sampatakumar V',
      avatar: '/avatar.png',
      role: 'Student'
    },
    content: `Micro-interactions are the secret sauce of delightful digital products. They communicate status, provide immediate tactile feedback, and make interface navigation feel natural.`
  },
  {
    _id: '66a4f1000000000000000003',
    title: 'Architecting AI Agents for Complex Workflow Automation',
    slug: 'architecting-ai-agents-workflow-automation',
    excerpt: 'A comprehensive guide to multi-agent architectures, structured JSON output validation, and deterministic tool execution.',
    category: 'AI & ML',
    tags: ['AI', 'LLM', 'TypeScript', 'Architecture'],
    publishedAt: '2026-07-22',
    readTime: '8 min read',
    views: 2150,
    likes: 310,
    status: 'published',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Sampatakumar V',
      avatar: '/avatar.png',
      role: 'Student'
    },
    content: `Autonomous AI agents are reshaping how software workflows are executed. Building reliable agentic loops requires rigorous tool invocation guards, precise system prompt engineering, and fallback management.`
  }
]

// Helper to check DB connection
const isDbConnected = () => mongoose.connection.readyState === 1

// GET /api/blogs - Get all blogs
router.get('/', async (req, res) => {
  const { status, category } = req.query
  if (!isDbConnected()) {
    let posts = INITIAL_SEED_POSTS
    if (status) posts = posts.filter((p) => p.status === status)
    if (category && category !== 'All') posts = posts.filter((p) => p.category === category)
    return res.json(posts)
  }

  try {
    const filter = {}
    if (status) filter.status = status
    if (category && category !== 'All') filter.category = category

    const blogs = await Blog.find(filter).sort({ createdAt: -1 })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs', message: err.message })
  }
})

// GET /api/blogs/:id - Get single blog by ID or Slug
router.get('/:id', async (req, res) => {
  const { id } = req.params

  if (!isDbConnected()) {
    const blog = INITIAL_SEED_POSTS.find((p) => p._id === id || p.slug === id)
    if (!blog) return res.status(404).json({ error: 'Blog post not found' })
    return res.json(blog)
  }

  try {
    let blog
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id)
    } else {
      blog = await Blog.findOne({ slug: id })
    }

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' })
    }

    // Increment views
    blog.views += 1
    await blog.save()

    res.json(blog)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog post', message: err.message })
  }
})

// POST /api/blogs - Create new blog post
router.post('/', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database offline', message: 'Operating in standalone fallback mode' })
  }

  try {
    const data = req.body
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    if (!data.author || !data.author.name || data.author.name === 'Sampatakumar') {
      data.author = {
        name: 'Sampatakumar V',
        avatar: '/avatar.png',
        role: 'Student'
      }
    }
    const blog = new Blog(data)
    await blog.save()
    res.status(201).json(blog)
  } catch (err) {
    res.status(400).json({ error: 'Failed to create blog post', message: err.message })
  }
})

// PUT /api/blogs/:id - Update existing blog post
router.put('/:id', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database offline', message: 'Operating in standalone fallback mode' })
  }

  try {
    const { id } = req.params
    const data = req.body
    if (data.author && (data.author.name === 'Sampatakumar' || data.author.role === 'Full Stack Engineer' || data.author.avatar?.includes('unsplash'))) {
      data.author = {
        name: 'Sampatakumar V',
        avatar: '/avatar.png',
        role: 'Student'
      }
    }
    let updated
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    } else {
      updated = await Blog.findOneAndUpdate({ slug: id }, data, { new: true, runValidators: true })
    }
    if (!updated) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: 'Failed to update blog post', message: err.message })
  }
})

// DELETE /api/blogs/:id - Delete blog post
router.delete('/:id', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database offline', message: 'Operating in standalone fallback mode' })
  }

  try {
    const { id } = req.params
    let deleted
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Blog.findByIdAndDelete(id)
    } else {
      deleted = await Blog.findOneAndDelete({ $or: [{ slug: id }, { _id: id }] })
    }
    if (!deleted) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json({ message: 'Blog post deleted successfully', id })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog post', message: err.message })
  }
})

// POST /api/blogs/:id/like - Increment like count
router.post('/:id/like', async (req, res) => {
  if (!isDbConnected()) {
    const blog = INITIAL_SEED_POSTS.find((p) => p._id === req.params.id)
    const likes = blog ? blog.likes + 1 : 1
    return res.json({ id: req.params.id, likes })
  }

  try {
    const { id } = req.params
    const blog = await Blog.findById(id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    blog.likes += 1
    await blog.save()
    res.json({ id: blog._id, likes: blog.likes })
  } catch (err) {
    res.status(500).json({ error: 'Failed to like blog post', message: err.message })
  }
})

// POST /api/blogs/seed - Seed database with sample posts
router.post('/seed', async (req, res) => {
  if (!isDbConnected()) {
    return res.json({ message: 'Fallback seed posts active', count: INITIAL_SEED_POSTS.length, blogs: INITIAL_SEED_POSTS })
  }

  try {
    await Blog.deleteMany({})
    const seeded = await Blog.insertMany(INITIAL_SEED_POSTS)
    res.json({ message: 'Database seeded successfully', count: seeded.length, blogs: seeded })
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed database', message: err.message })
  }
})

export default router

