import ProfileCard from '../components/ProfileCard.tsx'
import ScrollReveal from '../components/ScrollReveal.tsx'
import ProjectCarousel from '../components/ProjectCarousel.tsx'
import { FaGithub, FaLinkedin, FaTerminal, FaFileDownload, FaEnvelope, FaExternalLinkAlt, FaGlobe, FaSearchDollar, FaRocket, FaArrowRight, FaWhatsapp } from "react-icons/fa"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlurText from "../components/BlurText.js"
import TextType from '../components/TextType.tsx';
import GlitchText from '../components/GlitchText.tsx';
import { fetchProjectsAsync, type Project } from '../lib/projectService.ts'
import '../styles/home.css'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetchProjectsAsync().then((data) => setProjects(data))

    const handleStorage = () => {
      fetchProjectsAsync().then((data) => setProjects(data))
    }
    window.addEventListener('storage', handleStorage)

    // Load LinkedIn script once
    const script = document.createElement("script");
    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      window.removeEventListener('storage', handleStorage)
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden text-foreground">

      {/* ================= HOME / HERO ================= */}

      <section
        id="home"
        className="
        min-h-screen
        flex
        items-center
        px-6
        lg:px-20
        py-20
        "
      >

        <div
          className="
          w-full
          max-w-7xl
          mx-auto
          flex
          flex-col-reverse
          lg:flex-row
          items-center
          justify-between
          gap-12
          lg:gap-16
          "
        >

          {/* LEFT CONTENT */}

          <div
            className="
            flex
            flex-col
            max-w-2xl
            gap-6
            text-center
            lg:text-left
            "
          >
            {/* Live Availability Badge */}
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <GlitchText text="Full-Stack Web Developer & Software Engineer" className="text-emerald-600 dark:text-emerald-400" />
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">
                <BlurText text="Hello, World! I am" />
              </h3>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                <span className="text-gradient-emerald">Sampatakumar V</span>
              </h1>
            </div>

            <div className="text-foreground/80 font-medium text-base sm:text-lg leading-snug h-[64px] min-h-[64px] max-h-[64px] shrink-0 overflow-hidden select-none">
              <TextType
                typingSpeed={65}
                pauseDuration={1800}
                showCursor
                cursorCharacter="▋"
                text={[
                  "Computer Science Engineer passionate about Full-Stack Web Development & System Architecture.",
                  "Building high-performance web apps using React, Node.js, TypeScript, and MongoDB.",
                  "Architecting clean REST APIs, microservices, and AI-powered web solutions.",
                  "Transforming complex requirements into seamless, user-centric web applications.",
                  "Always exploring cutting-edge web frameworks, cloud technology, and AI integrations."
                ]}
                cursorBlinkDuration={0.6}
              />
            </div>

            {/* Live Interactive Terminal Window */}
            <div className="neomorph-inset rounded-2xl p-4 font-mono text-xs text-foreground/90 shadow-inner text-left shrink-0">
              <div className="flex items-center justify-between pb-2.5 border-b border-border/40 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="ml-2 text-muted-foreground text-[11px] flex items-center gap-1">
                    <FaTerminal className="text-emerald-500 text-xs" /> developer@sampatakumar:~
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 neomorph-pill px-2 py-0.5 rounded">JS/TS</span>
              </div>
              <div className="space-y-1 leading-relaxed">
                <p><span className="text-emerald-600 dark:text-emerald-400">const</span> <span className="text-teal-600 dark:text-cyan-300">stack</span> = &#123;</p>
                <p className="pl-4"><span className="text-muted-foreground">frontend:</span> [<span className="text-emerald-700 dark:text-emerald-300">'React.js'</span>, <span className="text-emerald-700 dark:text-emerald-300">'TypeScript'</span>, <span className="text-emerald-700 dark:text-emerald-300">'Tailwind CSS'</span>],</p>
                <p className="pl-4"><span className="text-muted-foreground">backend:</span> [<span className="text-teal-700 dark:text-cyan-300">'Node.js'</span>, <span className="text-teal-700 dark:text-cyan-300">'Express.js'</span>, <span className="text-teal-700 dark:text-cyan-300">'REST APIs'</span>],</p>
                <p className="pl-4"><span className="text-muted-foreground">databases:</span> [<span className="text-emerald-700 dark:text-emerald-300">'MongoDB'</span>, <span className="text-emerald-700 dark:text-emerald-300">'Firebase'</span>]</p>
                <p>&#125;;</p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2 shrink-0">
              <button
                onClick={() =>
                  window.open("https://linkedin.com/in/sampatakumar-sv", "_blank")
                }
                className="neomorph-btn px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <FaLinkedin size={18} />
                LinkedIn
              </button>

              <button
                onClick={() =>
                  window.open("https://github.com/sampatakumar", "_blank")
                }
                className="neomorph-btn px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <FaGithub size={18} />
                GitHub
              </button>
            </div>
          </div>

          {/* RIGHT PROFILE CARD */}
          <div className="scale-95 lg:scale-100 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-xl opacity-60 pointer-events-none"></div>
            <ProfileCard
              name="Sampatakumar V"
              title="Full-Stack Developer"
              handle="sampatakumar_sv"
              status="Online"
              contactText="Contact Me"
              avatarUrl="/avatar.png"
              iconUrl="/brands/github.svg"
              showUserInfo
              enableTilt
              enableMobileTilt
              behindGlowEnabled
              behindGlowColor="rgba(16, 185, 129, 0.35)"
              innerGradient="linear-gradient(145deg, var(--card) 0%, var(--background) 100%)"
              onContactClick={() =>
                window.location.href = "mailto:sampatakumarsv@gmail.com"
              }
            />
          </div>

        </div>

      </section>

      <hr className="border-border/30 w-[90%] mx-auto" />

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      >
        <ScrollReveal textClassName="text-4xl md:text-5xl font-extrabold tracking-wide text-center text-gradient-emerald mb-16">
          About Me
        </ScrollReveal>

        <div className="w-full max-w-4xl mx-auto neomorph-card neomorph-card-hover p-8 md:p-12 rounded-3xl space-y-6 text-center text-base md:text-lg text-foreground/80 leading-relaxed">
          <BlurText
            text="I am Sampatakumar, a Computer Science Engineering student passionate about Software Development, Full-Stack Web Engineering, and Artificial Intelligence. I take pride in building scalable, resilient, and responsive digital products."
            delay={200}
            animateBy="words"
          />
          <BlurText
            text="My core tech stack spans React.js, TypeScript, Node.js, Express, MongoDB, and Firebase. I focus on clean software architecture, component-driven UI design, and reliable backend services."
            delay={400}
            animateBy="words"
          />
          <BlurText
            text="Driven by curiosity and high technical standards, I continuously turn complex ideas into refined, impactful applications. I am seeking opportunities to bring value to innovative engineering teams."
            delay={600}
            animateBy="words"
          />
        </div>
      </section>

      <hr className="border-border/30 w-[90%] mx-auto" />

      {/* ================= THE STACK ================= */}
      <section
        id="skills"
        className="min-h-screen px-6 lg:px-20 py-24 flex flex-col justify-center items-center"
      >
        <div className="w-full max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <ScrollReveal textClassName="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground dark:text-slate-100">
              THE STACK
            </ScrollReveal>
            <p className="text-muted-foreground text-sm md:text-base max-w-xs leading-relaxed text-left sm:text-right">
              Technologies I use to build scalable, maintainable, and production-ready applications.
            </p>
          </div>

          {/* Stack Cards */}
          <div className="flex flex-col gap-6">
            {[
              {
                id: "L01",
                category: "Frontend",
                skills: ["React.js", "Next.js", "Redux", "JavaScript", "HTML", "CSS"],
              },
              {
                id: "L02",
                category: "Backend",
                skills: ["Node.js", "Express.js", "WebSockets", "REST APIs", "Python"],
              },
              {
                id: "L03",
                category: "Databases",
                skills: ["MongoDB", "Firebase"],
              },
              {
                id: "L04",
                category: "Practices",
                skills: ["REST API Design", "Agile Collaboration", "Git / GitHub"],
              },
            ].map((stack) => (
              <div
                key={stack.id}
                className="neomorph-card neomorph-card-hover p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-all duration-300"
              >
                {/* Left: ID + Category */}
                <div className="flex items-center gap-6 sm:gap-10 shrink-0">
                  <span className="font-mono text-xs sm:text-sm text-muted-foreground/70 tracking-wider font-semibold select-none">
                    {stack.id}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    {stack.category}
                  </h3>
                </div>

                {/* Right: Skill Pills */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 justify-start md:justify-end">
                  {stack.skills.map((skill) => (
                    <span
                      key={skill}
                      className="neomorph-pill font-mono text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2 rounded-full text-foreground/90 dark:text-slate-200 border border-border/50 hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-border/30 w-[90%] mx-auto" />

      {/* ================= PROJECTS ================= */}

      <section
        id="projects"
        className="px-6 lg:px-20 py-24"
      >

        <ScrollReveal textClassName="text-4xl md:text-5xl font-extrabold text-center text-gradient-emerald mb-16">
          Featured Full-Stack Projects
        </ScrollReveal>

        <ProjectCarousel projects={projects} />
      </section>

      <hr className="border-border/30 w-[90%] mx-auto" />

      {/* ================= CLIENT SERVICES & STARTUP BUSINESS ================= */}
      <section
        id="services"
        className="px-6 lg:px-20 py-24 bg-background/50"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <FaRocket className="text-emerald-500" /> Startup & Client Services
              </span>
              <ScrollReveal textClassName="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                Website Building & SEO Management
              </ScrollReveal>
            </div>
            
            <Link
              to="/services"
              className="neomorph-btn px-6 py-3.5 rounded-xl font-bold text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <span>Explore All Services & Get Quote</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {/* Quick Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="neomorph-card neomorph-card-hover p-8 rounded-3xl border border-border/40 space-y-4 group">
              <div className="w-12 h-12 rounded-xl neomorph-pill flex items-center justify-center text-emerald-500 text-xl group-hover:scale-110 transition-transform">
                <FaGlobe />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                Custom Website Development
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Handcrafted responsive websites, landing pages, and web apps built with modern React, Next.js, and TypeScript.
              </p>
              <Link to="/services#services-list" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2">
                Learn more <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            <div className="neomorph-card neomorph-card-hover p-8 rounded-3xl border border-border/40 space-y-4 group">
              <div className="w-12 h-12 rounded-xl neomorph-pill flex items-center justify-center text-emerald-500 text-xl group-hover:scale-110 transition-transform">
                <FaSearchDollar />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                SEO & Ranking Growth
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Technical SEO audits, keyword optimization, Google Search Console indexing, and performance tuning for top search results.
              </p>
              <Link to="/services#services-list" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2">
                Learn more <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            <div className="neomorph-card neomorph-card-hover p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Starting a Business?
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  Get a Custom Quote & Strategy
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Have a specific project or need monthly SEO management? Calculate your budget & book a free strategy call.
                </p>
              </div>

              <Link
                to="/services#quote-calculator"
                className="neomorph-btn w-full text-center py-3 rounded-xl font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 border border-emerald-400"
              >
                Instant Quote Calculator
              </Link>
            </div>
          </div>

        </div>
      </section>

      <hr className="border-border/30 w-[90%] mx-auto" />

      {/* ================= CONTACT / CTA ================= */}
      <section
        id="contact"
        className="px-6 lg:px-20 py-24 pb-36 min-h-[70vh] flex flex-col justify-center items-center"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-10">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground dark:text-slate-100 leading-[1.15] sm:leading-[1.1] max-w-6xl">
            LOOKING FOR A <GlitchText text="FULL STACK DEVELOPER" className="text-amber-500 dark:text-amber-400" /> WHO ENJOYS SOLVING CHALLENGING PROBLEMS?<span className="inline-block w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_#f59e0b] ml-3 align-middle"></span>
            <br className="hidden sm:inline" />
            {" "}LET’S BUILD SOMETHING GREAT TOGETHER.
          </h2>

          <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 pt-4">
            {/* WhatsApp Inquiry Pill */}
            <a
              href="https://wa.me/919380395607"
              target="_blank"
              rel="noopener noreferrer"
              className="neomorph-pill font-mono text-xs sm:text-sm px-5 py-3 sm:px-6 sm:py-3.5 rounded-full text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/40 hover:border-emerald-500 hover:text-emerald-500 bg-emerald-500/10 flex items-center gap-3 transition-all duration-200"
            >
              <FaWhatsapp className="text-emerald-500 text-base animate-pulse" />
              <span>WhatsApp: +91 9380395607</span>
            </a>

            {/* Email Pill */}
            <a
              href="mailto:sampatakumarsv@gmail.com"
              className="neomorph-pill font-mono text-xs sm:text-sm px-5 py-3 sm:px-6 sm:py-3.5 rounded-full text-foreground/90 dark:text-slate-200 border border-border/50 hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-3 transition-all duration-200"
            >
              <FaEnvelope className="text-emerald-500 text-sm" />
              <span>sampatakumarsv@gmail.com</span>
            </a>

            {/* GitHub Pill */}
            <a
              href="https://github.com/sampatakumar"
              target="_blank"
              rel="noopener noreferrer"
              className="neomorph-pill font-mono text-xs sm:text-sm px-5 py-3 sm:px-6 sm:py-3.5 rounded-full text-foreground/90 dark:text-slate-200 border border-border/50 hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-3 transition-all duration-200"
            >
              <FaExternalLinkAlt className="text-emerald-500 text-xs" />
              <span>github.com/sampatakumar</span>
            </a>

            {/* LinkedIn Pill */}
            <a
              href="https://www.linkedin.com/in/sampatakumar-sv"
              target="_blank"
              rel="noopener noreferrer"
              className="neomorph-pill font-mono text-xs sm:text-sm px-5 py-3 sm:px-6 sm:py-3.5 rounded-full text-foreground/90 dark:text-slate-200 border border-border/50 hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-3 transition-all duration-200"
            >
              <FaExternalLinkAlt className="text-emerald-500 text-xs" />
              <span>LinkedIn</span>
            </a>

            {/* Resume Pill */}
            <a
              href="/Sampatakumar_Resume.pdf"
              download
              className="neomorph-pill font-mono text-xs sm:text-sm px-5 py-3 sm:px-6 sm:py-3.5 rounded-full text-foreground/90 dark:text-slate-200 border border-border/50 hover:border-emerald-500/50 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-3 transition-all duration-200"
            >
              <FaFileDownload className="text-emerald-500 text-xs" />
              <span>Download Resume</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="neomorph-card border-t border-border/40 bg-background/90 backdrop-blur-lg py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="text-muted-foreground text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Sampatakumar V. All rights reserved.<br />
            <span className="text-xs opacity-75">Architected with React, TypeScript & Modern High-Performance UI/UX Design System</span>
          </div>

          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <a href="https://github.com/sampatakumar" aria-label="Sampatakumar’s GitHub Profile" className="hover:text-emerald-500 hover:scale-110 transition-all text-2xl">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/sampatakumar-sv" aria-label="Sampatakumar’s LinkedIn Profile" className="hover:text-emerald-500 hover:scale-110 transition-all text-2xl">
              <FaLinkedin />
            </a>
          </div>

        </div>
      </footer>

    </div>
  )
}