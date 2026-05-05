import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTypewriter } from '@/hooks/useTypewriter'

const ROLES = [
  'AI Engineer',
  'RF & Microwave Graduate',
  'Multimodal ML Researcher',
  'Systems Builder',
  'Linux Administration Enthusiast',
]

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const typingRef = useRef<HTMLDivElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const { text, showCursor } = useTypewriter({
    words: ROLES,
    typingSpeed: 60,
    deletingSpeed: 35,
    pauseDuration: 1800,
  })

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })

    tl.fromTo(
      nameRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        taglineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        typingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        ctasRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )

    return () => {
      tl.kill()
    }
  }, [])

  // Fade out scroll indicator on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollIndicatorRef.current && window.scrollY > 100) {
        gsap.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.5 })
      } else if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.5 })
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col justify-center items-center text-center px-4 z-10"
    >
      <h1
        ref={nameRef}
        className="font-heading font-bold text-gradient-cyan opacity-0"
        style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
        }}
      >
        SHOBHIT PARVAN
      </h1>

      <p
        ref={taglineRef}
        className="mt-4 text-white/65 text-sm md:text-base font-body opacity-0"
      >
        Electronics Engineer · AI Systems · RF & Embedded
      </p>

      <div
        ref={typingRef}
        className="mt-6 font-mono text-cyan text-base md:text-lg opacity-0"
      >
        <span>{text}</span>
        <span
          className="inline-block w-[1px] h-[1.1em] bg-cyan-bright ml-0.5 align-middle"
          style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}
        />
      </div>

      <div ref={ctasRef} className="mt-10 flex gap-4 opacity-0">
        <a
          href="/resume.pdf"
          className="relative overflow-hidden px-8 py-3.5 rounded-full font-heading font-semibold text-sm text-[#050505] bg-gradient-to-r from-cyan to-cyan-bright transition-all duration-300 hover:scale-105 hover:shadow-glow"
        >
          View Resume
        </a>
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="relative overflow-hidden px-8 py-3.5 rounded-full font-heading font-semibold text-sm text-white border border-white/20 transition-all duration-300 hover:scale-105 hover:border-cyan/50 hover:shadow-glow-sm"
        >
          View Work
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-10 bg-white/30 relative overflow-hidden">
          <div className="w-full h-2 bg-white/60 rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  )
}
