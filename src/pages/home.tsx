import ProfileCard from '../components/ProfileCard.tsx'
import ScrollReveal from '../components/ScrollReveal.tsx'
import ProjectCarousel from '../components/ProjectCarousel.tsx'
import { FaGithub, FaLinkedin, FaTerminal, FaCode, FaFileDownload } from "react-icons/fa"
import { useEffect, useState } from "react";
import BlurText from "../components/BlurText.js"
import TextType from '../components/TextType.tsx';
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
    <div className="w-full overflow-x-hidden text-slate-100">

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
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Full-Stack Web Developer & Software Engineer
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-medium text-emerald-400/90 tracking-wide">
                <BlurText text="Hello, World! I am" />
              </h3>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                <span className="text-gradient-emerald">Sampatakumar V</span>
              </h1>
            </div>

            <div className="text-slate-300 text-base sm:text-lg leading-relaxed min-h-[90px]">
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
            <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30 font-mono text-xs text-slate-300 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-500/20 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="ml-2 text-slate-400 text-[11px] flex items-center gap-1">
                    <FaTerminal className="text-emerald-400 text-xs" /> developer@sampatakumar:~
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">JS/TS</span>
              </div>
              <div className="space-y-1 leading-relaxed">
                <p><span className="text-emerald-400">const</span> <span className="text-cyan-300">stack</span> = &#123;</p>
                <p className="pl-4"><span className="text-slate-400">frontend:</span> [<span className="text-emerald-300">'React.js'</span>, <span className="text-emerald-300">'TypeScript'</span>, <span className="text-emerald-300">'Tailwind CSS'</span>],</p>
                <p className="pl-4"><span className="text-slate-400">backend:</span> [<span className="text-cyan-300">'Node.js'</span>, <span className="text-cyan-300">'Express.js'</span>, <span className="text-cyan-300">'REST APIs'</span>],</p>
                <p className="pl-4"><span className="text-slate-400">databases:</span> [<span className="text-emerald-300">'MongoDB'</span>, <span className="text-emerald-300">'Firebase'</span>]</p>
                <p>&#125;;</p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() =>
                  window.open("https://linkedin.com/in/sampatakumar-sv", "_blank")
                }
                className="emerald-glow-btn px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-sm"
              >
                <FaLinkedin size={18} />
                LinkedIn
              </button>

              <button
                onClick={() =>
                  window.open("https://github.com/sampatakumar", "_blank")
                }
                className="emerald-glow-btn px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-sm"
              >
                <FaGithub size={18} />
                GitHub
              </button>
            </div>
          </div>

          {/* RIGHT PROFILE CARD */}
          <div className="scale-95 lg:scale-100 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-xl opacity-75 animate-pulse pointer-events-none"></div>
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
              behindGlowColor="rgba(16, 185, 129, 0.45)"
              innerGradient="linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(16, 185, 129, 0.2) 100%)"
              onContactClick={() =>
                window.location.href = "mailto:sampatakumarsv@gmail.com"
              }
            />
          </div>

        </div>

      </section>

      <hr className="border-emerald-500/20 w-[90%] mx-auto shadow-[0_0_15px_rgba(16,185,129,0.1)]" />

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      >
        <ScrollReveal textClassName="text-4xl md:text-5xl font-extrabold tracking-wide text-center text-gradient-emerald mb-16">
          About Me
        </ScrollReveal>

        <div className="w-full max-w-4xl mx-auto glass-panel glass-panel-hover p-8 md:p-12 rounded-3xl space-y-6 text-center text-base md:text-lg text-slate-300 leading-relaxed">
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

      <hr className="border-emerald-500/20 w-[90%] mx-auto shadow-[0_0_15px_rgba(16,185,129,0.1)]" />

      {/* ================= SKILLS ================= */}
      <section
        id="skills"
        className="min-h-screen px-6 lg:px-20 py-24 flex flex-col items-center"
      >
        <ScrollReveal textClassName="text-4xl md:text-5xl font-extrabold text-center text-gradient-emerald mb-16">
          Technical Skills & Expertise
        </ScrollReveal>

        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* Frontend */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl group">
              <div className="flex items-center gap-3 mb-4">
                <FaCode className="text-emerald-400 text-xl" />
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Frontend
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "React Router", "Responsive Design", "Tailwind CSS"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl group">
              <div className="flex items-center gap-3 mb-4">
                <FaTerminal className="text-cyan-400 text-xl" />
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Backend
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Node.js", "Express.js", "REST APIs", "JWT Auth", "Microservices"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Database */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl group">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Database & Cloud
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["MongoDB", "Firebase", "Firestore", "PostgreSQL", "SQL"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl group">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
                  Tools & DevOps
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Git", "GitHub", "Vite", "Postman", "Vercel", "Firebase Auth"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl group">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Languages
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "TypeScript", "Python", "Java", "C++"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Concepts */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl group">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Core CS Concepts
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["DSA", "OOP", "System Architecture", "Software Design", "Clean Code"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Exploring */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl group">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  Innovations
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["AI Integration", "LLM APIs", "Next.js", "Docker", "Cloud Native"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Professional Mindset */}
            <div className="glass-panel glass-panel-hover p-6 rounded-3xl group">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Professional Competencies
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Agile Workflow", "Problem Solving", "Technical Communication", "Code Review"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <hr className="border-emerald-500/20 w-[90%] mx-auto shadow-[0_0_15px_rgba(16,185,129,0.1)]" />

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

      <hr className="border-emerald-500/20 w-[90%] mx-auto shadow-[0_0_15px_rgba(16,185,129,0.1)]" />

      {/* ================= CONTACT ================= */}

      <section
        id="contact"
        className="px-6 lg:px-20 py-24 pb-36"
      >
        <ScrollReveal textClassName="text-4xl md:text-5xl font-extrabold text-center text-gradient-emerald mb-16">
          Get In Touch
        </ScrollReveal>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">

          {/* CONTACT FORM */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-6 lg:p-10">

            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent successfully!");
              }}
            >
              <div className="flex flex-col gap-2">
                <label className="text-slate-200 font-semibold text-sm">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all text-white placeholder:text-slate-500 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-200 font-semibold text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all text-white placeholder:text-slate-500 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-200 font-semibold text-sm">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Hi Sampatakumar, I'd like to discuss a software engineering opportunity..."
                  className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 outline-none resize-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all text-white placeholder:text-slate-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="emerald-glow-btn mt-2 py-4 rounded-xl font-bold text-white tracking-wide text-base shadow-lg"
              >
                Send Message
              </button>
            </form>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            {/* LinkedIn Card */}
            <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex justify-center">
              <div
                className="badge-base LI-profile-badge"
                data-locale="en_US"
                data-size="large"
                data-theme="dark"
                data-type="VERTICAL"
                data-vanity="sampatakumar-sv"
                data-version="v1"
              >
                <a
                  className="badge-base__link LI-simple-link"
                  href="https://in.linkedin.com/in/sampatakumar-sv"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sampatakumar’s LinkedIn Profile"
                ></a>
              </div>
            </div>

            {/* GitHub Card */}
            <a
              href="https://github.com/sampatakumar"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel glass-panel-hover rounded-3xl p-6 block group"
            >
              <div className="flex gap-5 items-center">
                <img
                  src="https://avatars.githubusercontent.com/u/148532254?v=4"
                  alt="GitHub"
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                />

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    GitHub Profile
                  </h3>
                  <p className="text-emerald-400 text-sm font-mono">
                    @sampatakumar
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Explore full-stack web repos & open-source solutions.
                  </p>
                </div>
              </div>
            </a>

            {/* Resume Button */}
            <a
              href="/Sampatakumar_Resume.pdf"
              download
              className="w-full"
            >
              <button
                className="emerald-glow-btn w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg"
              >
                <FaFileDownload /> Download Resume (PDF)
              </button>
            </a>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-emerald-500/20 bg-[#0b0f19]/90 backdrop-blur-lg py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="text-slate-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Sampatakumar V. All rights reserved.<br />
            <span className="text-xs text-slate-500">Architected with React, TypeScript & Cyber Emerald Glassmorphism</span>
          </div>

          <div className="flex items-center justify-center gap-6 text-slate-400">
            <a href="https://github.com/sampatakumar" aria-label="Sampatakumar’s GitHub Profile" className="hover:text-emerald-400 hover:scale-110 transition-all text-2xl">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/sampatakumar-sv" aria-label="Sampatakumar’s LinkedIn Profile" className="hover:text-emerald-400 hover:scale-110 transition-all text-2xl">
              <FaLinkedin />
            </a>
          </div>

        </div>
      </footer>

    </div>
  )
}