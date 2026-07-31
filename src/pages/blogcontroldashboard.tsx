import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Heart,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Sliders,
  X,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  LogOut,
  FolderPlus,
  Code,
  Globe,
  Layers
} from 'lucide-react'
import {
  fetchPostsAsync,
  savePostAsync,
  deletePostAsync,
  togglePublishStatusAsync,
  resetBlogToDefaultsAsync,
  verifyPin,
  saveNewPin,
  isDashboardAuthenticated,
  setDashboardAuthenticated,
  type BlogPost
} from '../lib/blogService'

import {
  fetchProjectsAsync,
  saveProjectAsync,
  deleteProjectAsync,
  resetProjectsToDefaultsAsync,
  type Project
} from '../lib/projectService'

export default function BlogControlDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  const [isChangePinOpen, setIsChangePinOpen] = useState(false)
  const [newPinInput, setNewPinInput] = useState('')

  // Top Section Switcher: 'blogs' | 'projects'
  const [dashboardSection, setDashboardSection] = useState<'blogs' | 'projects'>('blogs')

  // Blog posts state
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Blog Editor state
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Engineering',
    tags: ['Tech'],
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop',
    status: 'draft',
    featured: false
  })
  const [tagsInput, setTagsInput] = useState('Tech')

  // Portfolio Projects state
  const [projects, setProjects] = useState<Project[]>([])
  const [projectSearchQuery, setProjectSearchQuery] = useState('')
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    longDescription: '',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    techStack: ['React', 'Node.js'],
    liveDemoUrl: '',
    githubUrl: '',
    category: 'Full-Stack',
    featured: true
  })
  const [projectTechStackInput, setProjectTechStackInput] = useState('React, Node.js')

  useEffect(() => {
    setIsAuthenticated(isDashboardAuthenticated())
    fetchPostsAsync().then((fetched) => setPosts(fetched))
    fetchProjectsAsync().then((fetchedProj) => setProjects(fetchedProj))
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle PIN unlock form submission
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyPin(pinInput)) {
      setDashboardAuthenticated(true)
      setIsAuthenticated(true)
      setPinError(false)
      setPinInput('')
      showToast('Dashboard unlocked successfully!')
    } else {
      setPinError(true)
      setPinInput('')
    }
  }

  // Handle PIN change
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPinInput.trim() || newPinInput.length < 4) {
      alert('PIN must be at least 4 characters long.')
      return
    }
    saveNewPin(newPinInput.trim())
    setIsChangePinOpen(false)
    setNewPinInput('')
    showToast('Dashboard Master PIN updated successfully!')
  }

  // Handle logout / lock
  const handleLockSession = () => {
    setDashboardAuthenticated(false)
    setIsAuthenticated(false)
    showToast('Dashboard locked.')
  }

  // Reload posts list
  const refreshPosts = async () => {
    const fetched = await fetchPostsAsync()
    setPosts(fetched)
  }

  // Reload projects list
  const refreshProjects = async () => {
    const fetched = await fetchProjectsAsync()
    setProjects(fetched)
  }

  // Dashboard Stats
  const stats = useMemo(() => {
    const total = posts.length
    const published = posts.filter((p) => p.status === 'published').length
    const drafts = posts.filter((p) => p.status === 'draft').length
    const views = posts.reduce((sum, p) => sum + (p.views || 0), 0)
    const likes = posts.reduce((sum, p) => sum + (p.likes || 0), 0)
    return { total, published, drafts, views, likes }
  }, [posts])

  // Project Stats
  const projectStats = useMemo(() => {
    const total = projects.length
    const featured = projects.filter((p) => p.featured).length
    const categoriesCount = new Set(projects.map((p) => p.category || 'General')).size
    return { total, featured, categoriesCount }
  }, [projects])

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => set.add(p.category))
    return Array.from(set)
  }, [posts])

  // Filtered posts list
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
      const q = searchQuery.toLowerCase().trim()
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      return matchesStatus && matchesCategory && matchesQuery
    })
  }, [posts, statusFilter, categoryFilter, searchQuery])

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const q = projectSearchQuery.toLowerCase().trim()
      return (
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.techStack.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [projects, projectSearchQuery])

  // Handle open editor for creation (Blog)
  const handleCreateNew = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Engineering',
      tags: ['Tech'],
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      status: 'draft',
      featured: false
    })
    setTagsInput('Tech, Engineering')
    setActiveTab('write')
    setIsEditorOpen(true)
  }

  // Handle open editor for modification (Blog)
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setTagsInput(post.tags.join(', '))
    setActiveTab('write')
    setIsEditorOpen(true)
  }

  // Save Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost.title?.trim()) {
      alert('Please provide a post title.')
      return
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    await savePostAsync({
      ...editingPost,
      tags: tagsArray.length > 0 ? tagsArray : ['General'],
      author: {
        name: 'Sampatakumar V',
        avatar: '/avatar.png',
        role: 'Student'
      }
    })

    showToast(editingPost.id ? 'Article updated successfully!' : 'New article created!')
    setIsEditorOpen(false)
    await refreshPosts()
  }

  // Toggle draft / publish status
  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const updated = await togglePublishStatusAsync(id, currentStatus)
    if (updated) {
      showToast(`Article status changed to ${updated.status.toUpperCase()}`)
      await refreshPosts()
    }
  }

  // Delete Post
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deletePostAsync(id)
      showToast('Article deleted.')
      await refreshPosts()
    }
  }

  // Reset Mock Data (Blog)
  const handleResetData = async () => {
    if (window.confirm('Reset all blog posts to initial sample data? Custom posts will be replaced.')) {
      await resetBlogToDefaultsAsync()
      await refreshPosts()
      showToast('Blog data reset to default samples.')
    }
  }

  // --- PROJECT MANAGEMENT HANDLERS ---
  const handleCreateNewProject = () => {
    setEditingProject({
      title: '',
      description: '',
      longDescription: '',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
      techStack: ['React', 'Node.js', 'TypeScript'],
      liveDemoUrl: '',
      githubUrl: '',
      category: 'Full-Stack',
      featured: true
    })
    setProjectTechStackInput('React, Node.js, TypeScript')
    setIsProjectEditorOpen(true)
  }

  const handleEditProject = (proj: Project) => {
    setEditingProject(proj)
    setProjectTechStackInput(proj.techStack.join(', '))
    setIsProjectEditorOpen(true)
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject.title?.trim()) {
      alert('Please enter a project title.')
      return
    }

    const techArray = projectTechStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    await saveProjectAsync({
      ...editingProject,
      title: editingProject.title.trim(),
      description: editingProject.description?.trim() || '',
      longDescription: editingProject.longDescription?.trim() || '',
      image: editingProject.image?.trim() || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
      techStack: techArray.length > 0 ? techArray : ['React'],
      category: editingProject.category?.trim() || 'Full-Stack',
      liveDemoUrl: editingProject.liveDemoUrl?.trim() || '',
      githubUrl: editingProject.githubUrl?.trim() || '',
      featured: editingProject.featured ?? true
    })

    showToast(editingProject.id ? 'Project updated successfully!' : 'New project added to portfolio!')
    setIsProjectEditorOpen(false)
    await refreshProjects()
  }

  const handleDeleteProject = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      await deleteProjectAsync(id)
      showToast('Project deleted successfully.')
      await refreshProjects()
    }
  }

  const handleResetProjects = async () => {
    if (window.confirm('Reset all portfolio projects to default initial samples?')) {
      await resetProjectsToDefaultsAsync()
      await refreshProjects()
      showToast('Projects dataset reset to defaults.')
    }
  }

  // PASSCODE LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-amber-500/30">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Restricted Admin Access</h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enter master PIN to unlock the Developer Control Dashboard.
              <br />
              <span className="text-slate-500 italic">(Default PIN: 1234)</span>
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-5 relative z-10">
            <div>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  maxLength={10}
                  placeholder="Enter 4-digit PIN..."
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value)
                    setPinError(false)
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border text-center font-mono tracking-widest text-lg text-white placeholder-slate-600 focus:outline-none transition-all ${
                    pinError
                      ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500'
                      : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
              </div>
              {pinError && (
                <p className="text-xs text-rose-400 font-semibold mt-2 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN code. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" /> Unlock Admin Dashboard
            </button>

            <div className="pt-2 text-center flex justify-center gap-4 text-xs text-slate-500">
              <Link to="/" className="hover:text-slate-300 transition-colors">
                ← Portfolio Home
              </Link>
              <Link to="/blog" className="hover:text-slate-300 transition-colors">
                Public Blog
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // UNLOCKED DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-2xl animate-bounce">
            <CheckCircle2 className="w-5 h-5" /> {toastMessage}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
              </Link>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3 h-3" /> Admin Session Active
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Sliders className="w-8 h-8 text-emerald-400" />
              Developer Control Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage portfolio projects, draft articles, configure tech stacks, and update content in real time.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsChangePinOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all"
              title="Change master passcode PIN"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" /> Change PIN
            </button>

            <button
              onClick={handleLockSession}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-all"
              title="Lock dashboard session"
            >
              <LogOut className="w-3.5 h-3.5" /> Lock
            </button>

            {dashboardSection === 'blogs' ? (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Create Article
              </button>
            ) : (
              <button
                onClick={handleCreateNewProject}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <FolderPlus className="w-4 h-4" /> Add Project
              </button>
            )}
          </div>
        </div>

        {/* Section Switcher Tabs: Blog Posts vs Portfolio Projects */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mb-8 w-fit">
          <button
            onClick={() => setDashboardSection('blogs')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              dashboardSection === 'blogs'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Blog Articles ({posts.length})
          </button>
          <button
            onClick={() => setDashboardSection('projects')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              dashboardSection === 'projects'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderPlus className="w-4 h-4" /> Portfolio Projects ({projects.length})
          </button>
        </div>

        {/* SECTION 1: BLOG ARTICLES DASHBOARD */}
        {dashboardSection === 'blogs' && (
          <div>
            {/* Metrics Bar Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Total Articles</span>
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-3xl font-extrabold text-white">{stats.total}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Published</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-3xl font-extrabold text-emerald-400">{stats.published}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Drafts</span>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-3xl font-extrabold text-amber-400">{stats.drafts}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Total Views</span>
                  <Eye className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-3xl font-extrabold text-purple-300">{stats.views.toLocaleString()}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Total Likes</span>
                  <Heart className="w-4 h-4 text-rose-400" />
                </div>
                <span className="text-3xl font-extrabold text-rose-400">{stats.likes.toLocaleString()}</span>
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['all', 'published', 'draft'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        statusFilter === st
                          ? 'bg-slate-800 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleResetData}
                  className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 ml-2"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Blog Samples
                </button>
              </div>

              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search articles by title, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Articles Table */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-6">Article</th>
                      <th className="py-4 px-6">Category & Tags</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          No blog posts found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-bold text-white leading-snug line-clamp-1">{post.title}</h4>
                                <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                                {post.category}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((t) => (
                                  <span key={t} className="text-[10px] text-slate-400">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleTogglePublish(post.id, post.status)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                post.status === 'published'
                                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25'
                              }`}
                            >
                              {post.status.toUpperCase()}
                            </button>
                          </td>

                          <td className="py-4 px-6 text-xs text-slate-400 font-mono">{post.publishedAt}</td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(post)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
                                title="Edit post"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(post.id, post.title)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors"
                                title="Delete post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PORTFOLIO PROJECTS DASHBOARD */}
        {dashboardSection === 'projects' && (
          <div>
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Total Portfolio Projects</span>
                  <FolderPlus className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-3xl font-extrabold text-emerald-400">{projectStats.total}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Featured Carousel Projects</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-3xl font-extrabold text-amber-400">{projectStats.featured}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Categories</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-3xl font-extrabold text-cyan-300">{projectStats.categoriesCount}</span>
              </div>
            </div>

            {/* Filter and Actions Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCreateNewProject}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-emerald-400 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add New Project
                </button>
                <button
                  onClick={handleResetProjects}
                  className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Project Samples
                </button>
              </div>

              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search projects by title, tech stack..."
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Projects Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-slate-900/80 rounded-3xl border border-slate-800 text-slate-500">
                  No projects found. Click "+ Add New Project" to add your first portfolio item!
                </div>
              ) : (
                filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="relative h-44 w-full bg-slate-950 overflow-hidden border-b border-slate-800">
                        <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {proj.featured && (
                          <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                        <span className="absolute bottom-3 left-3 bg-slate-900/90 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          {proj.category || 'Full-Stack'}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{proj.title}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{proj.description}</p>
                        
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.techStack.map((tech) => (
                            <span key={tech} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-3 pt-3">
                      <div className="flex gap-2 text-xs">
                        {proj.liveDemoUrl && (
                          <a href={proj.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" /> Demo
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                            <Code className="w-3.5 h-3.5" /> Code
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(proj)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                          title="Edit project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id || proj._id || '', proj.title)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* CHANGE PIN MODAL */}
      {isChangePinOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setIsChangePinOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" /> Change Master PIN
            </h3>
            <p className="text-slate-400 text-xs mb-6">Set a new passcode PIN for dashboard admin access.</p>

            <form onSubmit={handleChangePin} className="space-y-4">
              <input
                type="text"
                required
                minLength={4}
                maxLength={10}
                placeholder="Enter new 4-digit PIN..."
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-lg text-white focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
              >
                Save New Passcode
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BLOG ARTICLE EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">
                  {editingPost.id ? 'Edit Article' : 'Create New Article'}
                </h2>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      activeTab === 'write' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              <button onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'write' ? (
                <form onSubmit={handleSavePost} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Article Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Title of your technical blog post..."
                      value={editingPost.title || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-base text-white focus:outline-none focus:border-blue-500 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Engineering, Architecture..."
                        value={editingPost.category || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="React, TypeScript, CSS..."
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Status
                      </label>
                      <select
                        value={editingPost.status || 'draft'}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, status: e.target.value as 'published' | 'draft' })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={editingPost.coverImage || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 font-mono focus:outline-none focus:border-blue-500 mb-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Summary Excerpt
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief excerpt for readers..."
                      value={editingPost.excerpt || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Article Body (Markdown)
                    </label>
                    <textarea
                      rows={10}
                      required
                      placeholder="Write your article using Markdown..."
                      value={editingPost.content || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditorOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg"
                    >
                      Save Article
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-4">
                  <h1 className="text-3xl font-extrabold text-white">{editingPost.title || 'Untitled Post'}</h1>
                  <p className="text-slate-400 italic">{editingPost.excerpt}</p>
                  {editingPost.coverImage && (
                    <img src={editingPost.coverImage} alt="Cover" className="w-full max-h-72 object-cover rounded-2xl" />
                  )}
                  <div className="prose prose-invert max-w-none text-slate-300 pt-4">
                    {(editingPost.content || '').split('\n\n').map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO PROJECT EDITOR MODAL */}
      {isProjectEditorOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[90vh] rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col my-auto">
            
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-emerald-400" />
                {editingProject.id ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
              </h2>
              <button onClick={() => setIsProjectEditorOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-5">
              
              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Skill HubX, Krishi Kendra..."
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Stack, AI, Dev Tools"
                    value={editingProject.category || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Short Card Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Concise 1-2 sentence overview of the project..."
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Detailed Project Description (Modal details)
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain architecture, key features, user impact, and AI or backend details..."
                  value={editingProject.longDescription || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Tech Stack (Comma-separated tags) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, Express, MongoDB, TypeScript..."
                  value={projectTechStackInput}
                  onChange={(e) => setProjectTechStackInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  placeholder="/agri.png or https://images.unsplash.com/..."
                  value={editingProject.image || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-sm focus:outline-none focus:border-emerald-500 mb-2"
                />
                {editingProject.image && (
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img src={editingProject.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* URLs: Live Demo & GitHub */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Live Demo Application URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://my-app.vercel.app"
                    value={editingProject.liveDemoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    GitHub Code Repository URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center pt-2">
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProject.featured}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-200">Showcase in Home Carousel (Featured)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProjectEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {editingProject.id ? 'Save Project Changes' : 'Publish Project to Portfolio'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}
