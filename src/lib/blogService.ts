export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  views: number
  likes: number
  status: 'published' | 'draft' | 'archived'
  featured?: boolean
  author: {
    name: string
    avatar: string
    role: string
  }
}

const STORAGE_KEY = 'sampatakumar_blog_posts'

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
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
    content: `Building modern web applications requires a fine balance between developer productivity, lightning-fast render performance, and sleek UI aesthetics.

## Why React 19 Matters
React 19 introduces seamless handling of async operations, built-in asset loading, and optimized compiler features that drastically minimize unnecessary re-renders.

### Key Highlights:
- **Actions & Optimistic UI**: Native support for form state and optimistic transitions.
- **Direct Style & Script Tag Injection**: Preload resources directly from components without dynamic header hacks.
- **Enhanced Asset Loading**: Pre-fetching images and web fonts smoothly in the background.

\`\`\`tsx
import { useActionState } from 'react';

async function updateProfile(previousState, formData) {
  const name = formData.get("name");
  return await api.updateName(name);
}

function ProfileEditor() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);
  return (
    <form action={formAction}>
      <input name="name" defaultValue={state?.name} />
      <button disabled={isPending}>Save</button>
    </form>
  );
}
\`\`\`

## Embracing Modern CSS Capabilities
With Tailwind v4 and modern CSS standard modules (like oklch color spaces, container queries, and @starting-style), design systems can adapt dynamically without heavy JS runtime overhead.`
  },
  {
    id: '2',
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
    content: `Micro-interactions are the secret sauce of delightful digital products. They communicate status, provide immediate tactile feedback, and make interface navigation feel natural.

## 1. Intentional Motion
Every transition should serve a clear functional purpose—guiding the user's focus rather than distracting them.

> "Animation in software is not decoration; it is visual communication of state changes."

## 2. Micro-Haptics and Spatial Cues
Combining scale perturbations, glow effects, and smooth easing curves creates a sense of spatial depth that delights the eye.`
  },
  {
    id: '3',
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
    content: `Autonomous AI agents are reshaping how software workflows are executed. Building reliable agentic loops requires rigorous tool invocation guards, precise system prompt engineering, and fallback management.

## Core Pillars of Agent Engineering
1. **Tool Invocation Registry**: Strict schema definition with typed inputs and outputs.
2. **Context Window Optimization**: Token management with compact memory structures.
3. **Structured Verification**: Self-correction loops that validate outputs against schemas before committing changes.

\`\`\`json
{
  "agent": "CodeAuditor",
  "status": "verifying",
  "checks": ["typecheck", "lint", "security_scan"]
}
\`\`\`

## Managing State Across Agent Runs
Keeping subagents aligned requires localized scratchpads, durable logs, and human-in-the-loop validation checkpoints for critical side-effects.`
  },
  {
    id: '4',
    title: 'Mastering Full-Stack State Management in 2026',
    slug: 'mastering-full-stack-state-management-2026',
    excerpt: 'Comparing server state synchronization, URL state persistence, and reactive local signals in enterprise apps.',
    category: 'Engineering',
    tags: ['State Management', 'React', 'Architecture'],
    publishedAt: '2026-07-24',
    readTime: '5 min read',
    views: 740,
    likes: 95,
    status: 'published',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Sampatakumar V',
      avatar: '/avatar.png',
      role: 'Student'
    },
    content: `State management in frontend frameworks has evolved dramatically. The shift towards URL-driven state and atomic signals allows applications to stay synchronized effortlessly across tabs and re-renders.

### Best Practices:
- Keep shareable state in search query parameters (\`?filter=engineering&sort=date\`).
- Isolate temporary form inputs to local component state.
- Sync global persistent state via lightweight local storage providers.`
  },
  {
    id: '5',
    title: 'Next-Gen Portfolio Architecture: Behind the Scenes',
    slug: 'next-gen-portfolio-architecture',
    excerpt: 'An insider look into how this high-performance portfolio was engineered with Vite, Tailwind v4, custom shaders, and interactive dashboards.',
    category: 'Tutorials',
    tags: ['Portfolio', 'Vite', 'Tailwind', 'WebGPU'],
    publishedAt: '2026-07-25',
    readTime: '7 min read',
    views: 1890,
    likes: 240,
    status: 'published',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Sampatakumar V',
      avatar: '/avatar.png',
      role: 'Student'
    },
    content: `Creating a developer portfolio is more than showcasing projects—it's an opportunity to build an interactive canvas that demonstrates real-world software engineering capabilities.

## Architecture Highlights
- **WebGL Light Rays Background**: Hardware-accelerated canvas background for fluid visuals.
- **Dynamic Blog & Control Dashboard**: Built-in admin panel to manage, draft, and publish posts without external backend dependencies.
- **Glassmorphism UI System**: Modern semi-transparent frosted panels designed with dark mode palette.`
  }
]

export const getStoredPosts = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS))
      return INITIAL_POSTS
    }
    const posts: BlogPost[] = JSON.parse(raw)
    const updated = posts.map((p) => ({
      ...p,
      author: {
        name: 'Sampatakumar V',
        avatar: '/avatar.png',
        role: 'Student'
      }
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (err) {
    console.error('Failed to read blog posts from localStorage', err)
    return INITIAL_POSTS
  }
}


export const savePostsToStorage = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  } catch (err) {
    console.error('Failed to save blog posts to localStorage', err)
  }
}

// API Backend Integration Helpers with LocalStorage Fallback
const rawApiUrl = import.meta.env.VITE_API_URL
const API_BASE = rawApiUrl ? `${rawApiUrl.replace(/\/$/, '')}/api/blogs` : '/api/blogs'

export const getAuthorDetails = (author?: any) => {
  const defaultAuthor = {
    name: 'Sampatakumar V',
    avatar: '/avatar.png',
    role: 'Student'
  }
  if (!author) return defaultAuthor
  const name = !author.name || author.name === 'Sampatakumar' ? defaultAuthor.name : author.name
  const role = !author.role || author.role === 'Full Stack Engineer' ? defaultAuthor.role : author.role
  const avatar = !author.avatar || author.avatar.includes('unsplash') ? defaultAuthor.avatar : author.avatar
  return { name, avatar, role }
}

const normalizeMongoPost = (item: any): BlogPost => ({
  id: item._id || item.id || Date.now().toString(),
  title: item.title,
  slug: item.slug,
  excerpt: item.excerpt || '',
  content: item.content || '',
  coverImage: item.coverImage || '',
  category: item.category || 'Engineering',
  tags: item.tags || [],
  publishedAt: item.publishedAt || new Date().toISOString().split('T')[0],
  readTime: item.readTime || '5 min read',
  views: item.views || 0,
  likes: item.likes || 0,
  status: item.status || 'draft',
  featured: !!item.featured,
  author: getAuthorDetails(item.author)
})

export const fetchPostsAsync = async (): Promise<BlogPost[]> => {
  try {
    const res = await fetch(API_BASE)
    if (res.ok) {
      const data = await res.json()
      const normalized = data.map(normalizeMongoPost)
      savePostsToStorage(normalized)
      return normalized
    }
  } catch (err) {
    console.warn('Backend API unavailable, serving posts from localStorage fallback:', err)
  }
  return getStoredPosts()
}

export const savePostAsync = async (post: Partial<BlogPost>): Promise<BlogPost> => {
  const postWithAuthor = {
    ...post,
    author: getAuthorDetails(post.author)
  }
  try {
    const isEdit = !!post.id && post.id.length >= 10
    const url = isEdit ? `${API_BASE}/${post.id}` : API_BASE
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postWithAuthor)
    })


    if (res.ok) {
      const data = await res.json()
      const saved = normalizeMongoPost(data)
      const current = getStoredPosts()
      const next = isEdit ? current.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...current]
      savePostsToStorage(next)
      return saved
    }
  } catch (err) {
    console.warn('Backend API unavailable, saving to localStorage fallback:', err)
  }
  return savePost(post)
}

export const deletePostAsync = async (id: string): Promise<void> => {
  try {
    if (id.length >= 10) {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
    }
  } catch (err) {
    console.warn('Backend API unavailable for delete:', err)
  }
  deletePost(id)
}

export const togglePublishStatusAsync = async (id: string, currentStatus: string): Promise<BlogPost | undefined> => {
  const nextStatus = currentStatus === 'published' ? 'draft' : 'published'
  try {
    if (id.length >= 10) {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
      if (res.ok) {
        const data = await res.json()
        const updated = normalizeMongoPost(data)
        const current = getStoredPosts()
        savePostsToStorage(current.map((p) => (p.id === updated.id ? updated : p)))
        return updated
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable for toggle status:', err)
  }
  return togglePublishStatus(id)
}

export const likePostAsync = async (id: string): Promise<number> => {
  try {
    if (id.length >= 10) {
      const res = await fetch(`${API_BASE}/${id}/like`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        const current = getStoredPosts()
        savePostsToStorage(current.map((p) => (p.id === id ? { ...p, likes: data.likes } : p)))
        return data.likes
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable for like:', err)
  }
  return likePost(id)
}

export const incrementViewsAsync = async (id: string): Promise<number> => {
  try {
    if (id.length >= 10) {
      const res = await fetch(`${API_BASE}/${id}`)
      if (res.ok) {
        const data = await res.json()
        return data.views
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable for views increment:', err)
  }
  return incrementViews(id)
}

export const resetBlogToDefaultsAsync = async (): Promise<BlogPost[]> => {
  try {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      const normalized = data.blogs.map(normalizeMongoPost)
      savePostsToStorage(normalized)
      return normalized
    }
  } catch (err) {
    console.warn('Backend API unavailable for seed reset:', err)
  }
  return resetBlogToDefaults()
}

export const getPostById = (id: string): BlogPost | undefined => {
  const posts = getStoredPosts()
  return posts.find((p) => p.id === id)
}

export const savePost = (post: Partial<BlogPost>): BlogPost => {
  const posts = getStoredPosts()
  let updatedPosts: BlogPost[]

  if (post.id) {
    // Edit existing
    updatedPosts = posts.map((p) => (p.id === post.id ? ({ ...p, ...post } as BlogPost) : p))
  } else {
    // Create new
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: post.title || 'Untitled Post',
      slug: post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'untitled'),
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImage: post.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop',
      category: post.category || 'Engineering',
      tags: post.tags || ['Tech'],
      publishedAt: post.publishedAt || new Date().toISOString().split('T')[0],
      readTime: post.readTime || `${Math.max(2, Math.ceil((post.content || '').split(' ').length / 180))} min read`,
      views: post.views || 0,
      likes: post.likes || 0,
      status: post.status || 'draft',
      featured: post.featured || false,
      author: post.author || {
        name: 'Sampatakumar V',
        avatar: '/avatar.png',
        role: 'Student'
      }
    }
    updatedPosts = [newPost, ...posts]
  }

  savePostsToStorage(updatedPosts)
  return updatedPosts.find((p) => p.id === (post.id || updatedPosts[0].id))!
}

export const deletePost = (id: string): void => {
  const posts = getStoredPosts()
  const filtered = posts.filter((p) => p.id !== id)
  savePostsToStorage(filtered)
}

export const togglePublishStatus = (id: string): BlogPost | undefined => {
  const posts = getStoredPosts()
  let updated: BlogPost | undefined
  const nextPosts = posts.map((p) => {
    if (p.id === id) {
      const nextStatus: 'published' | 'draft' = p.status === 'published' ? 'draft' : 'published'
      updated = { ...p, status: nextStatus }
      return updated
    }
    return p
  })
  savePostsToStorage(nextPosts)
  return updated
}

export const likePost = (id: string): number => {
  const posts = getStoredPosts()
  let likes = 0
  const nextPosts = posts.map((p) => {
    if (p.id === id) {
      likes = p.likes + 1
      return { ...p, likes }
    }
    return p
  })
  savePostsToStorage(nextPosts)
  return likes
}

export const incrementViews = (id: string): number => {
  const posts = getStoredPosts()
  let views = 0
  const nextPosts = posts.map((p) => {
    if (p.id === id) {
      views = p.views + 1
      return { ...p, views }
    }
    return p
  })
  savePostsToStorage(nextPosts)
  return views
}

export const resetBlogToDefaults = (): BlogPost[] => {
  savePostsToStorage(INITIAL_POSTS)
  return INITIAL_POSTS
}

const PIN_STORAGE_KEY = 'sampatakumar_blog_pin'
const SESSION_AUTH_KEY = 'sampatakumar_blog_auth_session'

export const getStoredPin = (): string => {
  return localStorage.getItem(PIN_STORAGE_KEY) || '1234'
}

export const saveNewPin = (newPin: string): void => {
  localStorage.setItem(PIN_STORAGE_KEY, newPin)
}

export const verifyPin = (inputPin: string): boolean => {
  return inputPin === getStoredPin()
}

export const isDashboardAuthenticated = (): boolean => {
  return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true'
}

export const setDashboardAuthenticated = (status: boolean): void => {
  if (status) {
    sessionStorage.setItem(SESSION_AUTH_KEY, 'true')
  } else {
    sessionStorage.removeItem(SESSION_AUTH_KEY)
  }
}


