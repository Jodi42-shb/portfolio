import ParticleField from '@/components/ParticleField'
import Navigation from '@/sections/Navigation'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Experience from '@/sections/Experience'
import Projects from '@/sections/Projects'
import Skills from '@/sections/Skills'
import Contact from '@/sections/Contact'

export default function Home() {
  return (
    <>
      <ParticleField />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
