import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    excerpt: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop'
    },
    category: {
      type: String,
      default: 'Engineering'
    },
    tags: {
      type: [String],
      default: ['Tech']
    },
    publishedAt: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    readTime: {
      type: String,
      default: '5 min read'
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'draft'
    },
    featured: {
      type: Boolean,
      default: false
    },
    author: {
      name: { type: String, default: 'Sampatakumar V' },
      avatar: { type: String, default: '/avatar.png' },
      role: { type: String, default: 'Student' }
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Blog', BlogSchema)
