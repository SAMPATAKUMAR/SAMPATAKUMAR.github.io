import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    longDescription: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop'
    },
    techStack: {
      type: [String],
      default: ['React', 'Node.js']
    },
    liveDemoUrl: {
      type: String,
      default: ''
    },
    githubUrl: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'Full-Stack'
    },
    featured: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Project', ProjectSchema)
