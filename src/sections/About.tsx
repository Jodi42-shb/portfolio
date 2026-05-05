import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: '6+ Years', label: 'Research & Engineering' },
  { value: 'JNU', label: 'New Delhi' },
  { value: 'RF · AI · Embedded', label: 'Focus Areas' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      tl.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .fromTo(bodyRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
        .fromTo(
          statsRef.current?.children ?? [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(visualRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[120px]"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)]">
        {/* Section label */}
        <div ref={labelRef} className="flex items-center gap-4 mb-12 opacity-0">
          <span className="font-mono text-xs uppercase tracking-[0.05em] text-cyan">ABOUT</span>
          <div className="h-[1px] w-10 bg-white/10" />
        </div>

        <div className="grid md:grid-cols-[55%_45%] gap-12 items-center">
          {/* Text column */}
          <div>
            <h2
              ref={headingRef}
              className="font-heading font-bold text-white opacity-0"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              Building systems where signal meets intelligence.
            </h2>

            <p
              ref={bodyRef}
              className="mt-6 text-white/65 font-body leading-[1.65] text-base opacity-0"
            >
              Integrated B.Tech + M.Tech student at Jawaharlal Nehru University specializing in
              Electronics, RF, and AI systems. Focused on building real-world systems that combine
              machine learning, signal processing, and hardware — from memristor memory cells to
              multimodal depression screening frameworks.
            </p>

            <div ref={statsRef} className="mt-8 flex flex-wrap gap-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading font-bold text-white text-lg">{stat.value}</div>
                  <div className="font-mono text-xs text-white/40 mt-1 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual column */}
          <div ref={visualRef} className="relative opacity-0">
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <img
                src="/about-visual.jpg"
                alt="Electromagnetic wave visualization"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
