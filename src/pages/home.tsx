import ProfileCard from '../components/ProfileCard.tsx'
import ScrollReveal from '../components/ScrollReveal.tsx'
import { FaGithub, FaLinkedin } from "react-icons/fa"

import BlurText from "../components/BlurText.js"
import TextType from '../components/TextType.tsx';
import '../styles/home.css'

export default function Home() {

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="w-full overflow-x-hidden">

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
          lg:gap-24
          "
        >

          {/* LEFT CONTENT */}

          <div
            className="
            flex
            flex-col
            max-w-2xl
            gap-8
            text-center
            lg:text-left
            "
          >

            <h3 className="font-bold leading-tight text-4xl sm:text-5xl lg:text-2xl">

              <BlurText text="Hi there! I am " />


              <BlurText
                text="Sampatakumar V"
                delay={200}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="text-5xl mb-8"
              /></h3>




            <div className="text-gray-300 text-base sm:text-lg lg:text-xl leading-8">



              <TextType
                // text={["Text typing effect", "for your websites", "Happy coding!"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor
                cursorCharacter="_"
                text={[
                  "Computer Science Engineering student passionate about Software Development, Web Technologies, and Artificial Intelligence.",
                  "Building scalable web applications with React.js, JavaScript, Firebase, and MongoDB.",
                  "Transforming ideas into interactive digital experiences through clean and efficient code.",
                  "Continuously learning modern technologies and exploring innovative solutions to real-world problems.",
                  "Passionate about creating user-friendly applications that combine functionality with great design.",
                  "Focused on full-stack development, problem-solving, and writing maintainable software.",
                  "Enthusiastic about AI, cloud technologies, and the future of intelligent applications.",
                  "Driven by curiosity, creativity, and a commitment to continuous improvement.",
                  "Turning complex challenges into simple and impactful software solutions.",
                  "Aspiring Software Engineer dedicated to building products that make a difference."
                ]}
                cursorBlinkDuration={0.5}
              />

            </div>


            {/* BUTTONS */}

            <div
              className="
              flex
              flex-wrap
              gap-4
              justify-center
              lg:justify-start
              "
            >

              <button
                onClick={() =>
                  window.open(
                    "https://linkedin.com/in/sampatakumar-sv",
                    "_blank"
                  )
                }
                className="
                flex items-center gap-2
                px-6 py-3
                rounded-xl
                border border-gray-700
                hover:bg-white
                hover:text-black
                transition-all duration-300
                btn-primary
                "
              >
                <FaLinkedin size={20} />
                LinkedIn
              </button>


              <button
                onClick={() =>
                  window.open(
                    "https://github.com/sampatakumar",
                    "_blank"
                  )
                }
                className="
                flex items-center gap-2
                px-6 py-3
                rounded-xl
                border border-gray-700
                hover:bg-white
                hover:text-black
                transition-all duration-300
                btn-primary
                "
              >
                <FaGithub size={20} />
                GitHub
              </button>

            </div>

          </div>


          {/* RIGHT PROFILE CARD */}

          <div className="scale-90 lg:scale-100">

            <ProfileCard
              name="Sampatakumar V"
              title="Software Engineer"
              handle="sampatakumar_sv"
              status="Online"
              contactText="Contact Me"
              avatarUrl="/avatar.png"
              iconUrl="/brands/github.svg"
              showUserInfo
              enableTilt
              enableMobileTilt
              behindGlowEnabled
              behindGlowColor="rgba(150,190,255,0.67)"
              innerGradient="
              linear-gradient(
              145deg,
              #60496e8c 0%,
              #71C4FF44 100%
              )"
              onContactClick={() =>
                window.location.href =
                "mailto:wlcmdevilworld@gmail.com"
              }
            />

          </div>

        </div>

      </section>


      <hr className="border-gray-700 w-[90%] mx-auto" />


      {/* ================= ABOUT ================= */}
<section
  id="about"
  className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
>
  <ScrollReveal textClassName="text-4xl md:text-5xl font-bold tracking-wide text-center text-white mb-16">
    About Me
  </ScrollReveal>

  <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 text-center text-lg md:text-xl font-normal text-gray-300 leading-relaxed lg:leading-loose">
    <BlurText
      text="I am Sampatakumar, a Computer Science Engineering student passionate about Software Development, Web Technologies, and Artificial Intelligence. I enjoy building modern, scalable, and user-friendly applications that solve real-world problems."
      delay={200}
      animateBy="words"
    />
    <BlurText
      text="My expertise includes React.js, JavaScript, Firebase, MongoDB, and Node.js. I am constantly exploring emerging technologies, improving my development skills, and creating projects that combine functionality with exceptional user experiences."
      delay={400}
      animateBy="words"
    />
    <BlurText
      text="Beyond coding, I enjoy learning new concepts, solving challenging problems, and transforming innovative ideas into impactful digital solutions. My goal is to grow as a software engineer and contribute to meaningful technology that makes a difference."
      delay={600}
      animateBy="words"
    />
  </div>
</section>

      <hr className="border-gray-700 w-[90%] mx-auto" />


      {/* ================= SKILLS ================= */}

      {/* ================= SKILLS ================= */}

    <section
  id="skills"
  className="min-h-screen px-6 lg:px-20 py-24 flex flex-col items-center"
>
  <ScrollReveal textClassName="text-6xl md:text-5xl font-bolder text-center text-white mb-16">
    Skills
  </ScrollReveal>

  <div className="w-full max-w-7xl">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {/* Frontend */}
      <div className="h-full p-6 rounded-3xl border border-gray-800 bg-gray-900/20 backdrop-blur-lg hover:border-purple-500/50 hover:bg-purple-900/10 transition-all duration-500 group">
        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
          Frontend
        </h3>

        <div className="flex flex-wrap gap-2">
          {["HTML5", "CSS3", "JavaScript", "React.js", "React Router", "Responsive Design", "UI/UX"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Backend */}
      <div className="h-full p-6 rounded-3xl border border-gray-800 bg-gray-900/20 backdrop-blur-lg hover:border-blue-500/50 hover:bg-blue-900/10 transition-all duration-500 group">
        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
          Backend
        </h3>

        <div className="flex flex-wrap gap-2">
          {["Node.js", "Express.js", "REST APIs", "Authentication"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Database */}
      <div className="h-full p-6 rounded-3xl border border-gray-800 bg-gray-900/20 backdrop-blur-lg hover:border-green-500/50 hover:bg-green-900/10 transition-all duration-500 group">
        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-green-300 transition-colors">
          Database
        </h3>

        <div className="flex flex-wrap gap-2">
          {["MongoDB", "Firebase", "Firestore", "SQL"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="h-full p-6 rounded-3xl border border-gray-800 bg-gray-900/20 backdrop-blur-lg hover:border-yellow-500/50 hover:bg-yellow-900/10 transition-all duration-500 group">
        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">
          Tools & Tech
        </h3>

        <div className="flex flex-wrap gap-2">
          {["Git", "GitHub", "Firebase Auth", "Vite", "Postman"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="h-full p-6 rounded-3xl border border-gray-800 bg-gray-900/20 backdrop-blur-lg hover:border-pink-500/50 hover:bg-pink-900/10 transition-all duration-500 group">
        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-pink-300 transition-colors">
          Languages
        </h3>

        <div className="flex flex-wrap gap-2">
          {["JavaScript", "Python", "Java"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Core Concepts */}
      <div className="h-full p-6 rounded-3xl border border-gray-800 bg-gray-900/20 backdrop-blur-lg hover:border-indigo-500/50 hover:bg-indigo-900/10 transition-all duration-500 group">
        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
          Core Concepts
        </h3>

        <div className="flex flex-wrap gap-2">
          {["DSA", "OOP", "Problem Solving", "Software Design"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Exploring */}
      <div className="h-full p-6 rounded-3xl border border-gray-800 bg-gray-900/20 backdrop-blur-lg hover:border-cyan-500/50 hover:bg-cyan-900/10 transition-all duration-500 group">
        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
          Exploring
        </h3>

        <div className="flex flex-wrap gap-2">
          {["AI", "Machine Learning", "Cloud", "Next.js"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="h-full p-6 rounded-3xl border border-gray-800 bg-gray-900/20 backdrop-blur-lg hover:border-orange-500/50 hover:bg-orange-900/10 transition-all duration-500 group">
        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-orange-300 transition-colors">
          Soft Skills
        </h3>

        <div className="flex flex-wrap gap-2">
          {["Communication", "Teamwork", "Leadership", "Quick Learning"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>

      <hr className="border-gray-700 w-[90%] mx-auto" />

      {/* ================= PROJECTS ================= */}

      <section
        id="projects"
        className="px-6 lg:px-20 py-24"
      >

        <ScrollReveal textClassName="text-4xl md:text-5xl font-bold tracking-wide text-center text-white mb-16">
          Project Showcase
        </ScrollReveal>

        <div
          className="
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    gap-8
    max-w-7xl
    mx-auto
    "
        >

          {/* Project Card 1 */}

          <div
            className="
      rounded-3xl
      overflow-hidden
      bg-gray-900/40
      border border-gray-700
      backdrop-blur-lg
      hover:scale-105
      transition-all
      duration-500
      "
          >

            <div className="w-full h-52 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 relative overflow-hidden flex items-center justify-center">
              <span className="text-gray-400 font-medium tracking-widest text-sm group-hover:scale-110 transition-transform duration-500">SMART SKILL HUBX</span>
            </div>

            <div className="p-6">

              <h2 className="text-2xl font-bold mb-3">
                Smart Skill HubX
              </h2>

              <p className="text-gray-300 text-sm leading-7">
                AI-powered learning platform that recommends
                personalized learning paths and skill development.
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">React</span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">Node.js</span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-medium">MongoDB</span>
              </div>

              <div className="flex gap-4 mt-6">
                <button className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white hover:text-black transition-colors text-sm font-medium">Live Demo</button>
                <button className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white hover:text-black transition-colors text-sm font-medium">GitHub</button>
              </div>

            </div>

          </div>


          {/* Project Card 2 */}
          <div className="rounded-3xl overflow-hidden bg-gray-900/40 border border-gray-700 backdrop-blur-lg hover:scale-105 transition-all duration-500 group">
            <div className="w-full h-52 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 relative overflow-hidden flex items-center justify-center">
              <span className="text-gray-400 font-medium tracking-widest text-sm group-hover:scale-110 transition-transform duration-500">AGRICULTURE E-COMMERCE</span>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-white">Agriculture E-Commerce</h2>
              <p className="text-gray-300 text-sm leading-7">
                Online platform for farmers and customers to directly buy and sell agricultural products with real-time tracking.
              </p>
              
              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-medium">React</span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">Node.js</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">MongoDB</span>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white hover:text-black transition-colors text-sm font-medium">Live Demo</button>
                <button className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white hover:text-black transition-colors text-sm font-medium">GitHub</button>
              </div>
            </div>
          </div>

          {/* Project Card 3 */}
          <div className="rounded-3xl overflow-hidden bg-gray-900/40 border border-gray-700 backdrop-blur-lg hover:scale-105 transition-all duration-500 group">
            <div className="w-full h-52 bg-gradient-to-br from-purple-900/40 to-pink-900/40 relative overflow-hidden flex items-center justify-center">
              <span className="text-gray-400 font-medium tracking-widest text-sm group-hover:scale-110 transition-transform duration-500">IPC CHATBOT</span>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-white">IPC Chatbot</h2>
              <p className="text-gray-300 text-sm leading-7">
                Intelligent NLP chatbot designed to answer complex legal questions regarding the Indian Penal Code.
              </p>
              
              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-medium">Python</span>
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-medium">NLP</span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">React</span>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white hover:text-black transition-colors text-sm font-medium">Live Demo</button>
                <button className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white hover:text-black transition-colors text-sm font-medium">GitHub</button>
              </div>
            </div>
          </div>
        </div>

      </section>

      <hr className="border-gray-700 w-[90%] mx-auto" />

      {/* ================= CONTACT ================= */}

      <section
        id="contact"
        className="px-6 lg:px-20 py-24 pb-48 lg:pb-64"
      >

        <ScrollReveal textClassName="text-4xl md:text-5xl font-bold tracking-wide text-center text-white mb-16">
          Contact Me
        </ScrollReveal>

        <div
          className="
    w-full
    max-w-3xl
    mx-auto
    rounded-3xl
    bg-gray-900/40
    backdrop-blur-lg
    border border-gray-700
    p-6 lg:p-10
    "
        >

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault()

              alert("Message sent!")
            }}
          >

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 font-medium text-sm ml-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="p-4 rounded-xl bg-gray-800/60 border border-gray-600 outline-none focus:border-purple-400 focus:bg-gray-800 focus:ring-2 focus:ring-purple-400/30 transition-all text-white placeholder:text-gray-400 shadow-inner"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 font-medium text-sm ml-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="p-4 rounded-xl bg-gray-800/60 border border-gray-600 outline-none focus:border-purple-400 focus:bg-gray-800 focus:ring-2 focus:ring-purple-400/30 transition-all text-white placeholder:text-gray-400 shadow-inner"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 font-medium text-sm ml-1">Message</label>
              <textarea
                rows={5}
                placeholder="Write your message..."
                className="p-4 rounded-xl bg-gray-800/60 border border-gray-600 outline-none resize-none focus:border-purple-400 focus:bg-gray-800 focus:ring-2 focus:ring-purple-400/30 transition-all text-white placeholder:text-gray-400 shadow-inner"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 font-semibold tracking-wide text-white"
            >
              Send Message
            </button>

          </form>

        </div>
        <script src="https://platform.linkedin.com/badges/js/profile.js" async defer type="text/javascript"></script>
        <div class="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="dark" data-type="VERTICAL" data-vanity="sampatakumar-sv" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/sampatakumar-sv?trk=profile-badge">Sampatakumar S V</a></div>
              

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-800 bg-gray-900/20 py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-gray-500 font-light text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Sampatakumar V. All rights reserved.<br/>
            Built with React & Tailwind CSS.
          </div>
          
          <div className="flex items-center justify-center gap-6 text-gray-500">
            <a href="#" className="hover:text-purple-400 hover:scale-110 transition-all duration-300 text-2xl">
              <FaGithub />
            </a>
            <a href="#" className="hover:text-purple-400 hover:scale-110 transition-all duration-300 text-2xl">
              <FaLinkedin />
            </a>

          </div>
          
          
        </div>
      </footer>

    </div>
  )
}