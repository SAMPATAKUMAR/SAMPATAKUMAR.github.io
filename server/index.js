import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import blogRoutes from './routes/blog.routes.js'
import projectRoutes from './routes/project.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'

// CORS configuration for Render deployment and local development
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['*']
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or matched origins
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(null, true) // Permissive CORS for portfolio demo
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use(express.json())

// Health check endpoints for Render web service monitoring
const getHealthStatus = () => ({
  status: 'OK',
  service: 'Portfolio Express API',
  dbConnected: mongoose.connection.readyState === 1,
  timestamp: new Date().toISOString()
})

app.get('/', (req, res) => res.json(getHealthStatus()))
app.get('/health', (req, res) => res.json(getHealthStatus()))
app.get('/api/health', (req, res) => res.json(getHealthStatus()))

// API Routes
app.use('/api/blogs', blogRoutes)
app.use('/api/projects', projectRoutes)

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl })
})

// Mongoose connection options & server startup
mongoose.set('bufferCommands', false) // Prevent request hanging when DB is disconnected

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log(`Connected to MongoDB successfully.`)
    app.listen(PORT, () => {
      console.log(`Portfolio Backend Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.warn(`MongoDB connection warning (${err.message}). Starting server in LocalStorage fallback mode...`)
    app.listen(PORT, () => {
      console.log(`Portfolio Backend Server running on port ${PORT} (Standalone fallback mode)`)
    })
  })

