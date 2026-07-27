import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Tag,
  Clock,
  Eye,
  Heart,
  BookOpen,
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
  X,
  Check,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Calendar
} from 'lucide-react'
import {
  fetchPostsAsync,
  likePostAsync,
  incrementViewsAsync,
  getAuthorDetails,
  type BlogPost
} from '../lib/blogService'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'likes'>('latest')
  const [activePost, setActivePost] = useState<BlogPost | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({})
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({})
  const [commentInput, setCommentInput] = useState('')
  const [comments, setComments] = useState<Record<string, { id: string; author: string; text: string; date: string }[]>>({
    '1': [
      { id: 'c1', author: 'Alex Chen', text: 'Great breakdown of React 19 features! The new action hooks are a game changer.', date: '2 days ago' },
      { id: 'c2', author: 'Sarah Jenkins', text: 'Tailwind v4 integration tips were super helpful, thanks for sharing.', date: '1 day ago' }
    ],
    '3': [
      { id: 'c3', author: 'Marcus Vance', text: 'Structured output validation for agent loops is so critical for production workloads.', date: '3 hours ago' }
    ]
  })

  useEffect(() => {
    // Load published posts from server or local fallback
    fetchPostsAsync().then((allPosts) => {
      setPosts(allPosts.filter((p) => p.status === 'published'))
    })

    // Load user likes & bookmarks from localStorage
    const localLikes = localStorage.getItem('blog_user_likes')
    if (localLikes) setUserLikes(JSON.parse(localLikes))

    const localBookmarks = localStorage.getItem('blog_user_bookmarks')
    if (localBookmarks) setUserBookmarks(JSON.parse(localBookmarks))
  }, [])

  // Listen to window storage events if user edits posts in control dashboard in another tab or window
  useEffect(() => {
    const handleStorage = () => {
      fetchPostsAsync().then((allPosts) => {
        setPosts(allPosts.filter((p: BlogPost) => p.status === 'published'))
      })
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => set.add(p.category))
    return ['All', ...Array.from(set)]
  }, [posts])

  // All Tags list
  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return Array.from(set)
  }, [posts])

  // Filtered & sorted posts
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
        const matchesTag = !selectedTag || post.tags.includes(selectedTag)
        const query = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !query ||
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((t) => t.toLowerCase().includes(query))
        return matchesCategory && matchesTag && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.views - a.views
        if (sortBy === 'likes') return b.likes - a.likes
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      })
  }, [posts, selectedCategory, selectedTag, searchQuery, sortBy])

  // Featured post spotlight
  const featuredPost = useMemo(() => {
    return posts.find((p) => p.featured) || posts[0]
  }, [posts])

  // Handle open article modal
  const handleOpenPost = async (post: BlogPost) => {
    setActivePost(post)
    const newViews = await incrementViewsAsync(post.id)
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, views: newViews } : p)))
  }

  // Handle like button click
  const handleLike = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const newLikesCount = await likePostAsync(postId)
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: newLikesCount } : p)))
    const updatedUserLikes = { ...userLikes, [postId]: true }
    setUserLikes(updatedUserLikes)
    localStorage.setItem('blog_user_likes', JSON.stringify(updatedUserLikes))
    if (activePost && activePost.id === postId) {
      setActivePost({ ...activePost, likes: newLikesCount })
    }
  }

  // Handle toggle bookmark
  const handleBookmark = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const updated = { ...userBookmarks, [postId]: !userBookmarks[postId] }
    setUserBookmarks(updated)
    localStorage.setItem('blog_user_bookmarks', JSON.stringify(updated))
  }

  // Share article link
  const handleShare = (post: BlogPost) => {
    const url = window.location.origin + `/blog?id=${post.id}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  // Submit comment
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return
    const newComment = {
      id: Date.now().toString(),
      author: 'You (Visitor)',
      text: commentInput.trim(),
      date: 'Just now'
    }
    const current = comments[postId] || []
    setComments({ ...comments, [postId]: [newComment, ...current] })
    setCommentInput('')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Header / Hero */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-900/20 via-slate-900/60 to-slate-950 border border-slate-800/80 p-8 sm:p-12 mb-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Technical Insights & Thoughts
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Engineering & Design Journal
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                Deep dives into full-stack development, AI agent architecture, web performance, micro-interactions, and modern software design systems.
              </p>
            </div>
          </div>

          {/* Search Bar & Filters Bar */}
          <div className="relative z-10 mt-8 pt-8 border-t border-slate-800/80 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles by title, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Sort by:</span>
              <div className="flex bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
                {(['latest', 'popular', 'likes'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSortBy(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      sortBy === mode ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Categories & Tag Filters */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setSelectedTag(null)
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat && !selectedTag
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Tags list */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium text-slate-500 mr-1">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {allTags.map((tag) => {
                const isActive = selectedTag === tag
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isActive ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                        : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    #{tag}
                  </button>
                )
              })}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-xs text-blue-400 hover:underline ml-2 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear Tag Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Featured Post Spotlight Banner (Shown when no active search/tag filter) */}
        {!searchQuery && selectedCategory === 'All' && !selectedTag && featuredPost && (
          <section className="mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Featured Spotlight
            </h2>
            <div
              onClick={() => handleOpenPost(featuredPost)}
              className="group cursor-pointer relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-blue-500/10 grid lg:grid-cols-12 gap-0"
            >
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
                      {featuredPost.category}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {featuredPost.publishedAt}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-slate-300 line-clamp-3 text-base leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={getAuthorDetails(featuredPost.author).avatar}
                      alt={getAuthorDetails(featuredPost.author).name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{getAuthorDetails(featuredPost.author).name}</p>
                      <p className="text-xs text-slate-400">{getAuthorDetails(featuredPost.author).role}</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                    Read Article <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 lg:bg-gradient-to-r lg:from-slate-950/80 lg:to-transparent" />
              </div>
            </div>
          </section>
        )}

        {/* Article Grid Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
              {filteredPosts.length}
            </span>
          </h2>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-slate-900/50 border border-slate-800 p-8">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300 mb-2">No articles found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              We couldn't find any articles matching your search query or filter. Try clearing your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedTag(null)
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const isLiked = !!userLikes[post.id]
              const isBookmarked = !!userBookmarks[post.id]

              return (
                <article
                  key={post.id}
                  onClick={() => handleOpenPost(post)}
                  className="group cursor-pointer flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-blue-500/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                >
                  {/* Image container */}
                  <div className="relative h-48 overflow-hidden bg-slate-800">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-medium text-blue-300">
                        {post.category}
                      </span>
                    </div>

                    {/* Bookmark quick button */}
                    <button
                      onClick={(e) => handleBookmark(post.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${
                        isBookmarked
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark post'}
                    >
                      <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {post.publishedAt}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer stats & author */}
                    <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/50 text-[11px] text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <img
                            src={getAuthorDetails(post.author).avatar}
                            alt={getAuthorDetails(post.author).name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-medium text-slate-300">{getAuthorDetails(post.author).name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 hover:text-slate-200">
                            <Eye className="w-3.5 h-3.5 text-slate-500" /> {post.views}
                          </span>

                          <button
                            onClick={(e) => handleLike(post.id, e)}
                            className={`flex items-center gap-1 transition-colors ${
                              isLiked ? 'text-rose-400 font-semibold' : 'hover:text-rose-400'
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5" fill={isLiked ? 'currentColor' : 'none'} /> {post.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-y-auto flex flex-col font-sans text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Top Nav */}
            <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setActivePost(null)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Articles
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(activePost.id)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    userLikes[activePost.id]
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" fill={userLikes[activePost.id] ? 'currentColor' : 'none'} />
                  {activePost.likes} {userLikes[activePost.id] ? 'Liked' : 'Like'}
                </button>

                <button
                  onClick={() => handleShare(activePost)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Copied Link!' : 'Share'}
                </button>

                <button
                  onClick={() => setActivePost(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Header Info */}
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
                    {activePost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Published on {activePost.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {activePost.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {activePost.views} views
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">
                  {activePost.title}
                </h1>

                {/* Author card header */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <img
                    src={getAuthorDetails(activePost.author).avatar}
                    alt={getAuthorDetails(activePost.author).name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{getAuthorDetails(activePost.author).name}</h4>
                    <p className="text-xs text-slate-400">{getAuthorDetails(activePost.author).role}</p>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden max-h-96 bg-slate-950 border border-slate-800">
                <img src={activePost.coverImage} alt={activePost.title} className="w-full h-full object-cover" />
              </div>

              {/* Main Text Body */}
              <div className="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed text-base">
                {activePost.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-2xl font-bold text-white pt-4 pb-1 border-b border-slate-800">
                        {paragraph.replace('## ', '')}
                      </h2>
                    )
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-xl font-semibold text-slate-100 pt-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    )
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="p-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 text-blue-200 italic">
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    )
                  }
                  if (paragraph.startsWith('```')) {
                    const code = paragraph.replace(/```[a-z]*/g, '').trim()
                    return (
                      <pre key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto text-blue-300">
                        <code>{code}</code>
                      </pre>
                    )
                  }
                  return <p key={idx}>{paragraph}</p>
                })}
              </div>

              {/* Tags Footer */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-2">Article Tags:</span>
                {activePost.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Comments Section */}
              <div className="pt-8 border-t border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Discussion ({(comments[activePost.id] || []).length})
                </h3>

                {/* Comment input box */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Share your thoughts on this article..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(activePost.id)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleAddComment(activePost.id)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
                  >
                    Post
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4 pt-2">
                  {(comments[activePost.id] || []).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No comments yet. Be the first to start the conversation!</p>
                  ) : (
                    comments[activePost.id].map((c) => (
                      <div key={c.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200">{c.author}</span>
                          <span className="text-slate-500">{c.date}</span>
                        </div>
                        <p className="text-sm text-slate-300">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
