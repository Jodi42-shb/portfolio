import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    title: 'Multimodal Framework for PTSD Detection',
    category: 'ML RESEARCH',
    description:
      'RoBERTa + audio ML pipeline for depression screening on the DAIC-WOZ dataset. AUC 0.65 · 400+ features · SMOTE pipeline',
  },
  {
    title: 'Memristor Memory Design',
    category: 'RF DESIGN',
    description:
      'Non-volatile SRAM alternative using Cadence OrCAD. 1T-1R cell with 0.4 µs write, 0.2 µs read. Hardware breadboard prototype validated.',
  },
  {
    title: 'Microstrip Patch Antenna',
    category: 'RF DESIGN',
    description:
      '2.4 GHz S-band rectangular patch antenna on HFSS with FR4 substrate. 608 MHz bandwidth, -14.44 dB return loss.',
  },
  {
    title: 'Local RAG AI Assistant',
    category: 'AI APPLICATION',
    description:
      'ArchWiki semantic search with embeddings. SentenceTransformers + ChromaDB + Ollama. Hybrid search with BM25 + embeddings.',
  },
  {
    title: 'Text-to-Audio Audiobook Generator',
    category: 'SYSTEMS',
    description:
      'Offline TTS with Piper, Facebook MMS, XTTS-v2. Dual Docker builds (CPU/GPU). Speed and pitch controls via numpy/scipy.',
  },
]

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
      })

      gsap.fromTo(subtitleRef.current, { opacity: 0, y: 15 }, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
      })

      cardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[120px]"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)]">
        {/* Section label */}
        <div ref={labelRef} className="flex items-center gap-4 mb-2 opacity-0">
          <span className="font-mono text-xs uppercase tracking-[0.05em] text-cyan">PROJECTS</span>
          <div className="h-[1px] w-10 bg-white/10" />
        </div>

        <p ref={subtitleRef} className="text-sm text-white/40 mb-12 opacity-0">
          Research & Personal Projects
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => { cardsRef.current[i] = el }}
              className="group glass rounded-[20px] p-8 transition-all duration-400 hover:-translate-y-1 hover:border-cyan/30 hover:shadow-[0_8px_32px_rgba(79,172,254,0.15)] cursor-default opacity-0"
            >
              {/* Category tag */}
              <span className="inline-block font-mono text-xs text-cyan px-3 py-1 rounded-full bg-cyan/10 mb-4">
                {project.category}
              </span>

              {/* Title */}
              <h3 className="font-heading font-semibold text-lg text-white group-hover:text-cyan transition-colors duration-300">
                {project.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-white/55 leading-relaxed">
                {project.description}
              </p>

              {/* Top glow on hover */}
              <div className="absolute inset-x-0 top-0 h-24 rounded-t-[20px] bg-gradient-to-b from-cyan/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
