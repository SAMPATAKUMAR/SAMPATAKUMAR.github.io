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
  Star,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  LogOut
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

export default function BlogControlDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  const [isChangePinOpen, setIsChangePinOpen] = useState(false)
  const [newPinInput, setNewPinInput] = useState('')

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Editor form state
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

  useEffect(() => {
    // Check if session is already authenticated
    setIsAuthenticated(isDashboardAuthenticated())
    fetchPostsAsync().then((fetched) => setPosts(fetched))
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

  // Dashboard Stats
  const stats = useMemo(() => {
    const total = posts.length
    const published = posts.filter((p) => p.status === 'published').length
    const drafts = posts.filter((p) => p.status === 'draft').length
    const views = posts.reduce((sum, p) => sum + (p.views || 0), 0)
    const likes = posts.reduce((sum, p) => sum + (p.likes || 0), 0)
    return { total, published, drafts, views, likes }
  }, [posts])

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

  // Handle open editor for creation
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

  // Handle open editor for modification
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

  // Reset Mock Data
  const handleResetData = async () => {
    if (window.confirm('Reset all blog posts to initial sample data? Custom posts will be replaced.')) {
      await resetBlogToDefaultsAsync()
      await refreshPosts()
      showToast('Blog data reset to default samples.')
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
            <h1 className="text-2xl font-bold text-white mb-2">Restricted Access</h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enter master PIN to unlock the Blog Control Dashboard.
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
              <Unlock className="w-4 h-4" /> Unlock Dashboard
            </button>

            <div className="pt-2 text-center">
              <Link to="/blog" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                ← Return to Public Blog
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // UNLOCKED DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/90 text-slate-950 font-bold text-sm shadow-2xl animate-bounce">
            <CheckCircle2 className="w-5 h-5" /> {toastMessage}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Blog
              </Link>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3 h-3" /> Authenticated Session
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Sliders className="w-8 h-8 text-amber-400" />
              Blog Control Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage articles, draft new ideas, monitor reader analytics, and publish updates in real time.
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
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all"
              title="Reset dataset to sample initial posts"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Samples
            </button>

            <button
              onClick={handleLockSession}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-all"
              title="Lock dashboard session"
            >
              <LogOut className="w-3.5 h-3.5" /> Lock
            </button>

            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Create Article
            </button>
          </div>
        </div>

        {/* Metrics Bar Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
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
            {/* Status Selector */}
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

            {/* Category Dropdown */}
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
          </div>

          {/* Search Field */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Posts Data Table / List */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 p-6">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No articles match your current criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setCategoryFilter('all')
                }}
                className="mt-3 text-xs text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Article</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Metrics</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Post info & thumbnail */}
                      <td className="py-4 px-6 max-w-md">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm truncate">{post.title}</span>
                              {post.featured && (
                                <span title="Featured Post">
                                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 font-mono block truncate">/{post.slug}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 border border-slate-700">
                          {post.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(post.id, post.status)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            post.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                        >
                          {post.status === 'published' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {post.status.toUpperCase()}
                        </button>
                      </td>

                      {/* Metrics */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-500" /> {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-400" /> {post.likes}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">{post.publishedAt}</td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Article"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Change PIN Modal */}
      {isChangePinOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" /> Change Master PIN
              </h3>
              <button
                onClick={() => setIsChangePinOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  New Master PIN
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new 4+ digit PIN..."
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center tracking-widest focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsChangePinOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Save New PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Create / Edit Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-y-auto flex flex-col font-sans text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                {editingPost.id ? 'Edit Article' : 'Create New Article'}
              </h2>

              <div className="flex items-center gap-3">
                {/* Tab Switcher (Write vs Live Preview) */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'write' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Write Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {activeTab === 'write' ? (
              <form onSubmit={handleSavePost} className="p-6 sm:p-8 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter article title..."
                    value={editingPost.title || ''}
                    onChange={(e) => {
                      const title = e.target.value
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      setEditingPost({ ...editingPost, title, slug })
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-base font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Grid row: Category, Tags, Status, Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering, AI & ML, Design"
                      value={editingPost.category || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, CSS"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Publishing Status
                    </label>
                    <select
                      value={editingPost.status || 'draft'}
                      onChange={(e) =>
                        setEditingPost({ ...editingPost, status: e.target.value as 'published' | 'draft' })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="published">Published (Visible to readers)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>

                  {/* Featured checkbox */}
                  <div className="flex items-center pt-6">
                    <label className="inline-flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editingPost.featured}
                        onChange={(e) => setEditingPost({ ...editingPost, featured: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-200">Set as Featured Spotlight Post</span>
                    </label>
                  </div>
                </div>

                {/* Cover Image URL */}
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
                  {editingPost.coverImage && (
                    <div className="h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img src={editingPost.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Short Excerpt / Summary
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description for the article card..."
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Main Content Body */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Article Body (Markdown Formatted)
                  </label>
                  <textarea
                    rows={12}
                    required
                    placeholder="Write article content using Markdown headings (##), blockquotes (>), or code blocks (```)..."
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                {/* Modal Footer actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all"
                  >
                    {editingPost.id ? 'Save Changes' : 'Publish Article'}
                  </button>
                </div>
              </form>
            ) : (
              /* Live Preview Mode */
              <div className="p-6 sm:p-10 space-y-6">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300">
                  <Sparkles className="w-4 h-4 inline mr-1" /> Live Preview mode showing how readers will see this post on the public site.
                </div>

                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                    {editingPost.category || 'Category'}
                  </span>
                  <h1 className="text-3xl font-extrabold text-white">{editingPost.title || 'Untitled Post'}</h1>
                  <p className="text-slate-400 italic">{editingPost.excerpt}</p>

                  {editingPost.coverImage && (
                    <div className="rounded-2xl overflow-hidden max-h-80 bg-slate-950 border border-slate-800">
                      <img src={editingPost.coverImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="prose prose-invert max-w-none space-y-4 text-slate-300 pt-4">
                    {(editingPost.content || '').split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={idx} className="text-xl font-bold text-white pt-2 border-b border-slate-800">
                            {paragraph.replace('## ', '')}
                          </h2>
                        )
                      }
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={idx} className="text-lg font-semibold text-slate-100">
                            {paragraph.replace('### ', '')}
                          </h3>
                        )
                      }
                      if (paragraph.startsWith('> ')) {
                        return (
                          <blockquote key={idx} className="p-3 rounded-lg bg-blue-500/10 border-l-4 border-blue-500 text-blue-200 italic">
                            {paragraph.replace('> ', '')}
                          </blockquote>
                        )
                      }
                      return <p key={idx}>{paragraph}</p>
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
