import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ScrollReveal from "../components/ScrollReveal.tsx"
import GlitchText from "../components/GlitchText.tsx"
import {
  FaGlobe,
  FaSearchDollar,
  FaMobileAlt,
  FaCode,
  FaCheckCircle,
  FaArrowRight,
  FaEnvelope,
  FaShieldAlt,
  FaBolt,
  FaLayerGroup,
  FaQuestionCircle,
  FaCalculator,
  FaWhatsapp
} from "react-icons/fa"

export default function Services() {
  useEffect(() => {
    document.title = "Website Building & Technical SEO Services | SV Digital Solutions"
    window.scrollTo(0, 0)
  }, [])

  // Quote Form State
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Custom Website Building",
    "SEO Management & Optimization"
  ])
  const [budget, setBudget] = useState<string>("$500 - $1,500")
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientWebsite, setClientWebsite] = useState("")
  const [projectDetails, setProjectDetails] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)

  const availableServices = [
    { id: "web", name: "Custom Website Building" },
    { id: "seo", name: "SEO Management & Optimization" },
    { id: "uiux", name: "UI/UX & Modern Redesign" },
    { id: "speed", name: "Speed & Core Web Vitals Audit" },
    { id: "ecom", name: "E-Commerce / Online Store" },
    { id: "maintenance", name: "Hosting & Monthly Maintenance" }
  ]

  const toggleService = (name: string) => {
    if (selectedServices.includes(name)) {
      setSelectedServices(selectedServices.filter((s) => s !== name))
    } else {
      setSelectedServices([...selectedServices, name])
    }
  }

  const [copied, setCopied] = useState(false)

  const generateFormattedSummary = () => {
    return (
      `Hello Sampatakumar,\n\nI would like to inquire about your services for my business.\n\n` +
      `Services Interested: ${selectedServices.join(", ")}\n` +
      `Estimated Budget: ${budget}\n` +
      `Client Name: ${clientName}\n` +
      `Email: ${clientEmail}\n` +
      `Website/Company: ${clientWebsite || "N/A"}\n\n` +
      `Project Details:\n${projectDetails}\n`
    )
  }

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    const rawBody = generateFormattedSummary()
    const subject = encodeURIComponent(`New Project Inquiry from ${clientName || "Client"}`)
    const body = encodeURIComponent(rawBody)

    // Try copying to clipboard for convenience
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawBody).catch(() => {})
    }

    // Trigger email client
    window.location.href = `mailto:sampatakumarsv@gmail.com?subject=${subject}&body=${body}`
  }

  const handleManualCopy = () => {
    const rawBody = generateFormattedSummary()
    navigator.clipboard.writeText(rawBody).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <div className="w-full overflow-x-hidden text-foreground pb-20">

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-[85vh] flex items-center justify-center px-6 lg:px-20 py-20 relative">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center gap-8">

          {/* Startup Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <GlitchText text="SV Digital Solutions • Web & SEO Agency" className="text-emerald-600 dark:text-emerald-400 font-bold" />
          </div>

          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Build High-Speed Websites & Drive Top <span className="text-gradient-emerald">Google Rankings</span>
            </h1>
            <p className="text-foreground/80 text-lg sm:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              We empower startups, local businesses, and enterprises with modern, lightning-fast websites and end-to-end SEO management that delivers measureable business growth.
            </p>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#quote-calculator"
              className="neomorph-btn px-8 py-4 rounded-2xl font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-all flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30"
            >
              <FaCalculator className="text-emerald-500" />
              Get Instant Quote & Consult
            </a>

            <a
              href="#pricing"
              className="neomorph-btn px-8 py-4 rounded-2xl font-semibold text-sm sm:text-base text-foreground/80 hover:text-emerald-500 transition-all flex items-center gap-2"
            >
              View Service Packages
              <FaArrowRight className="text-xs" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="w-full max-w-5xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Lighthouse Performance", value: "95+", icon: FaBolt },
              { label: "Mobile Responsive", value: "100%", icon: FaMobileAlt },
              { label: "SEO Indexing Ready", value: "Top Tier", icon: FaSearchDollar },
              { label: "Custom Architecture", value: "React / Node", icon: FaCode }
            ].map((stat, index) => (
              <div key={index} className="neomorph-card p-5 rounded-2xl flex flex-col items-center text-center gap-2 border border-border/40">
                <stat.icon className="text-emerald-500 text-2xl mb-1" />
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      <hr className="border-border/30 w-[90%] mx-auto my-8" />

      {/* ================= SERVICES SHOWCASE ================= */}
      <section id="services-list" className="px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto space-y-16">

          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <ScrollReveal textClassName="text-3xl sm:text-5xl font-extrabold text-gradient-emerald">
              Our Core Services
            </ScrollReveal>
            <p className="text-muted-foreground text-base sm:text-lg">
              Everything you need to establish a dominant online presence, attract organic traffic, and convert visitors into paying clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaGlobe,
                title: "Custom Website Building",
                desc: "Handcrafted, ultra-fast websites built with modern frameworks (React, TypeScript, Next.js, HTML5/CSS3). Completely responsive across mobile, tablet, and desktop.",
                highlights: ["High-speed loading", "Clean UI/UX Architecture", "Custom Animations", "Cross-Browser Compatibility"]
              },
              {
                icon: FaSearchDollar,
                title: "SEO Management & Growth",
                desc: "Complete Search Engine Optimization to help your business rank on the first page of Google. Technical SEO, keyword strategy, schema markup, and content optimization.",
                highlights: ["On-Page & Technical SEO", "Google Search Console Setup", "Local SEO & Google Maps", "Keyword & Competitor Audit"]
              },
              {
                icon: FaMobileAlt,
                title: "UI/UX & Modern Redesign",
                desc: "Transform outdated websites into high-converting digital experiences with sleek Glassmorphism, responsive component architecture, and fluid micro-animations.",
                highlights: ["User Experience Research", "Wireframing & Prototyping", "Modern Design Systems", "Conversion Rate Optimization"]
              },
              {
                icon: FaBolt,
                title: "Speed & Core Web Vitals Audit",
                desc: "Slow websites lose customers. We optimize assets, script loading, caching, and server response times to get your website loading in under 1 second.",
                highlights: ["Lighthouse 90+ Score", "Image & Code Minification", "CDN Setup & Caching", "Script Optimization"]
              },
              {
                icon: FaLayerGroup,
                title: "E-Commerce & Portfolios",
                desc: "Scale your online storefront or personal brand. Secure product catalogs, seamless payment integrations (Stripe, PayPal), and intuitive checkout flows.",
                highlights: ["Product Catalog Systems", "Secure Checkout", "Inventory Management", "Custom Landing Pages"]
              },
              {
                icon: FaShieldAlt,
                title: "Hosting & Maintenance",
                desc: "Hassle-free website hosting management, domain mapping, SSL certificate setup, automated backups, and 24/7 security patch monitoring.",
                highlights: ["Cloud Hosting Deployment", "SSL & Domain Setup", "Monthly Content Updates", "24/7 Security & Uptime"]
              }
            ].map((service, index) => (
              <div
                key={index}
                className="neomorph-card neomorph-card-hover p-8 rounded-3xl border border-border/40 flex flex-col justify-between gap-6 group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl neomorph-pill flex items-center justify-center text-emerald-500 text-2xl group-hover:scale-110 transition-transform">
                    <service.icon />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-foreground/75 text-sm sm:text-base leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-border/30">
                  {service.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <FaCheckCircle className="text-emerald-500 shrink-0 text-xs" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <hr className="border-border/30 w-[90%] mx-auto my-8" />

      {/* ================= AGENCY WORKFLOW ================= */}
      <section className="px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <ScrollReveal textClassName="text-3xl sm:text-5xl font-extrabold text-foreground">
              How We Work With You
            </ScrollReveal>
            <p className="text-muted-foreground text-base sm:text-lg">
              A transparent, step-by-step process engineered to take your project from concept to launch with zero headaches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { num: "01", title: "Discovery", desc: "We understand your goals, target market, and brand requirements." },
              { num: "02", title: "Architecture", desc: "Crafting wireframes, UI layouts, and selecting the optimal technology." },
              { num: "03", title: "Development", desc: "Writing clean, modular code with responsive layouts and fluid interactions." },
              { num: "04", title: "SEO & Audit", desc: "Optimizing meta tags, performance benchmarks, and index readiness." },
              { num: "05", title: "Launch & Grow", desc: "Deploying to live servers and providing ongoing maintenance & analytics." }
            ].map((step, i) => (
              <div key={i} className="neomorph-card p-6 rounded-2xl border border-border/40 flex flex-col gap-4 relative">
                <span className="font-mono text-3xl font-black text-emerald-500/40">{step.num}</span>
                <h4 className="text-lg font-bold text-foreground">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-border/30 w-[90%] mx-auto my-8" />

      {/* ================= PRICING & PACKAGES ================= */}
      <section id="pricing" className="px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <ScrollReveal textClassName="text-3xl sm:text-5xl font-extrabold text-gradient-emerald">
              Service Packages & Tiers
            </ScrollReveal>
            <p className="text-muted-foreground text-base sm:text-lg">
              Transparent, competitive pricing customized for your business scale. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Package */}
            <div className="neomorph-card p-8 rounded-3xl border border-border/40 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <span className="neomorph-pill px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Small Business / Personal
                </span>
                <h3 className="text-2xl font-bold text-foreground">Starter Website</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$300 - $600</span>
                  <span className="text-xs text-muted-foreground">/ one-time</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ideal for individuals, portfolios, local businesses, and single-page landing sites requiring a sleek modern online presence.
                </p>

                <ul className="space-y-3 pt-4 border-t border-border/30 text-sm">
                  {[
                    "Up to 3 - 5 Responsive Pages",
                    "Modern UI/UX Design System & Animations",
                    "Contact & Inquiry Form Integration",
                    "Basic On-Page SEO Setup",
                    "Mobile & Tablet Optimized",
                    "1 Month Free Support"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500 text-xs shrink-0" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#quote-calculator"
                onClick={() => {
                  setSelectedServices(["Custom Website Building"])
                  setBudget("$300 - $600")
                }}
                className="neomorph-btn text-center py-3.5 rounded-xl font-bold text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
              >
                Select Starter Plan
              </a>
            </div>

            {/* Growth Suite (Popular) */}
            <div className="neomorph-card p-8 rounded-3xl border-2 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.15)] flex flex-col justify-between gap-6 relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-extrabold uppercase px-4 py-1 rounded-full shadow">
                Most Popular
              </span>

              <div className="space-y-4">
                <span className="neomorph-pill px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Full Business & SEO
                </span>
                <h3 className="text-2xl font-bold text-foreground">Growth Web + SEO Suite</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$750 - $1,500</span>
                  <span className="text-xs text-muted-foreground">/ project</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete website engineering paired with full Technical SEO, Google Console indexation, speed tuning, and keyword strategy.
                </p>

                <ul className="space-y-3 pt-4 border-t border-border/30 text-sm">
                  {[
                    "Multi-page Web App (React / Next.js)",
                    "Comprehensive SEO & Keyword Audit",
                    "Google Search Console & Analytics",
                    "Lighthouse 90+ Speed Optimization",
                    "Custom Animations & Micro-Interactions",
                    "Domain & Cloud Hosting Deployment",
                    "3 Months Technical Support"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500 text-xs shrink-0" />
                      <span className="font-semibold text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#quote-calculator"
                onClick={() => {
                  setSelectedServices(["Custom Website Building", "SEO Management & Optimization", "Speed & Core Web Vitals Audit"])
                  setBudget("$750 - $1,500")
                }}
                className="neomorph-btn text-center py-3.5 rounded-xl font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 border border-emerald-400 shadow-md"
              >
                Get Growth Suite
              </a>
            </div>

            {/* Custom SaaS / Enterprise */}
            <div className="neomorph-card p-8 rounded-3xl border border-border/40 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <span className="neomorph-pill px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Complex / Web Apps
                </span>
                <h3 className="text-2xl font-bold text-foreground">Custom Web App / SaaS</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$1,500+</span>
                  <span className="text-xs text-muted-foreground">/ custom quote</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tailored web software, custom REST API backends, database integrations, authentication, payment gateways, and client portals.
                </p>

                <ul className="space-y-3 pt-4 border-t border-border/30 text-sm">
                  {[
                    "Full-Stack React + Node.js / MongoDB",
                    "User Auth & Database Architecture",
                    "Stripe / PayPal Payment Systems",
                    "E-Commerce / Custom SaaS Features",
                    "Monthly SEO & Analytics Reporting",
                    "Dedicated Maintenance & SLA"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500 text-xs shrink-0" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#quote-calculator"
                onClick={() => {
                  setSelectedServices(["Custom Website Building", "E-Commerce / Online Store", "Hosting & Monthly Maintenance"])
                  setBudget("$1,500+")
                }}
                className="neomorph-btn text-center py-3.5 rounded-xl font-bold text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
              >
                Inquire Enterprise Quote
              </a>
            </div>
          </div>

        </div>
      </section>

      <hr className="border-border/30 w-[90%] mx-auto my-8" />

      {/* ================= INTERACTIVE QUOTE FORM ================= */}
      <section id="quote-calculator" className="px-6 lg:px-20 py-20">
        <div className="max-w-4xl mx-auto space-y-10">

          <div className="text-center space-y-3">
            <ScrollReveal textClassName="text-3xl sm:text-4xl font-extrabold text-gradient-emerald">
              Interactive Project Quote & Inquiry
            </ScrollReveal>
            <p className="text-muted-foreground text-sm sm:text-base">
              Select the services you require to calculate an estimated project consultation with Sampatakumar.
            </p>
          </div>

          <form onSubmit={handleQuoteSubmit} className="neomorph-card p-8 sm:p-12 rounded-3xl border border-border/40 space-y-8">

            {/* Service Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider block">
                1. Select Required Services:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableServices.map((srv) => {
                  const isChecked = selectedServices.includes(srv.name)
                  return (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => toggleService(srv.name)}
                      className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between text-left transition-all ${
                        isChecked
                          ? "neomorph-pressed border border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                          : "neomorph-pill text-foreground/80 hover:text-emerald-500"
                      }`}
                    >
                      <span>{srv.name}</span>
                      {isChecked && <FaCheckCircle className="text-emerald-500 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Budget Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider block">
                2. Estimated Budget Range:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["$300 - $600", "$600 - $1,200", "$1,200 - $2,500", "$2,500+"].map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setBudget(b)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                      budget === b
                        ? "neomorph-pressed border border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "neomorph-pill text-foreground/70 hover:text-emerald-500"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 pt-4 border-t border-border/30">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider block">
                3. Your Details & Requirements:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="neomorph-inset w-full p-4 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all text-foreground"
                />

                <input
                  type="email"
                  required
                  placeholder="Your Email Address *"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="neomorph-inset w-full p-4 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all text-foreground"
                />
              </div>

              <input
                type="text"
                placeholder="Current Website URL or Business Name (Optional)"
                value={clientWebsite}
                onChange={(e) => setClientWebsite(e.target.value)}
                className="neomorph-inset w-full p-4 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all text-foreground"
              />

              <textarea
                rows={4}
                required
                placeholder="Describe your website goals, design preferences, or key features needed... *"
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                className="neomorph-inset w-full p-4 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all text-foreground resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="neomorph-btn w-full py-4 rounded-2xl font-extrabold text-base text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-all flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/40"
              >
                <FaEnvelope className="text-emerald-500" />
                Submit Project Request & Email Consultation
              </button>
            </div>

            {formSubmitted && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 space-y-3 text-center">
                <p className="text-sm font-bold flex items-center justify-center gap-2">
                  <FaCheckCircle className="text-emerald-500 text-base" />
                  Your project quote request has been prepared!
                </p>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Your email app should launch automatically. If it doesn't launch, click below to copy the structured project details to your clipboard and send them directly to <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">sampatakumarsv@gmail.com</span>.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleManualCopy}
                    className="neomorph-btn px-4 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-all flex items-center gap-2"
                  >
                    {copied ? "✓ Details Copied to Clipboard!" : "📋 Copy Quote Details"}
                  </button>

                  <a
                    href={`https://wa.me/919380395607?text=${encodeURIComponent(generateFormattedSummary())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neomorph-btn px-4 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2"
                  >
                    <FaWhatsapp className="text-emerald-500 text-sm" />
                    Send via WhatsApp
                  </a>

                  <a
                    href={`mailto:sampatakumarsv@gmail.com?subject=${encodeURIComponent(`Project Inquiry from ${clientName}`)}&body=${encodeURIComponent(generateFormattedSummary())}`}
                    className="neomorph-btn px-4 py-2 rounded-xl text-xs font-bold text-foreground hover:text-emerald-500 transition-all flex items-center gap-2"
                  >
                    <FaEnvelope className="text-emerald-500" />
                    Open Email App
                  </a>
                </div>
              </div>
            )}
          </form>

        </div>
      </section>

      <hr className="border-border/30 w-[90%] mx-auto my-8" />

      {/* ================= FAQ SECTION ================= */}
      <section className="px-6 lg:px-20 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-foreground flex items-center justify-center gap-3">
              <FaQuestionCircle className="text-emerald-500" />
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Common questions about working with SV Digital Solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "How long does it take to build a custom website?",
                a: "A typical starter website is built in 5-10 business days. Larger multi-page React applications or full SEO suites generally take 2 to 3 weeks depending on feature complexity."
              },
              {
                q: "How does SEO Management work?",
                a: "We perform complete technical audits, optimize page metadata, structure content for Google indexation, create sitemaps, setup Google Search Console, and enhance loading speeds to improve rank position."
              },
              {
                q: "Will my website be mobile friendly?",
                a: "Yes! Every single site we design is 100% responsive and tested across mobile phones, tablets, laptops, and ultra-wide screens."
              },
              {
                q: "Do you provide hosting and maintenance after launch?",
                a: "Yes, we offer ongoing maintenance packages including cloud deployment (Vercel/Render/AWS), SSL security renewals, domain linking, and monthly content updates."
              }
            ].map((faq, idx) => (
              <div key={idx} className="neomorph-card p-6 rounded-2xl border border-border/40 space-y-2">
                <h4 className="font-bold text-foreground text-base">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CONTACT CALLOUT ================= */}
      <section className="px-6 lg:px-20 pt-10">
        <div className="max-w-4xl mx-auto neomorph-card p-8 sm:p-12 rounded-3xl border border-emerald-500/30 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Ready to Launch Your Next <span className="text-gradient-emerald">Web Project?</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Directly connect with Sampatakumar to discuss your business goals, custom website specifications, or SEO strategy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/919380395607"
              target="_blank"
              rel="noopener noreferrer"
              className="neomorph-pill px-6 py-3.5 rounded-xl font-bold text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2"
            >
              <FaWhatsapp className="text-emerald-500 text-lg animate-pulse" />
              WhatsApp: +91 9380395607
            </a>
            <a
              href="mailto:sampatakumarsv@gmail.com"
              className="neomorph-pill px-6 py-3.5 rounded-xl font-bold text-sm text-foreground hover:text-emerald-500 flex items-center gap-2"
            >
              <FaEnvelope className="text-emerald-500" />
              sampatakumarsv@gmail.com
            </a>
            <Link
              to="/#contact"
              className="neomorph-pill px-6 py-3.5 rounded-xl font-semibold text-sm text-foreground hover:text-emerald-500 flex items-center gap-2"
            >
              Return to Portfolio Home
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
