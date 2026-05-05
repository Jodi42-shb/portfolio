import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Github, Linkedin } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CONTACTS = [
  {
    label: 'shobhit.parvan@gmail.com',
    href: 'mailto:shobhit.parvan@gmail.com',
    icon: Mail,
  },
  {
    label: 'github.com/jodi42-shb',
    href: 'https://github.com/jodi42-shb',
    icon: Github,
  },
  {
    label: 'linkedin.com/in/shobhit-parvan',
    href: 'https://linkedin.com/in/shobhit-parvan-bb9946253/',
    icon: Linkedin,
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      tl.fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .fromTo(subtextRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')
        .fromTo(
          linksRef.current?.children ?? [],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[120px]"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(79,172,254,0.03) 0%, transparent 70%)',
      }}
    >
      <div className="max-w-[600px] mx-auto px-[clamp(1.5rem,5vw,4rem)] text-center">
        <h2
          ref={headingRef}
          className="font-heading font-bold text-white opacity-0"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          Let's build something that matters.
        </h2>

        <p ref={subtextRef} className="mt-4 text-white/65 font-body leading-[1.65] opacity-0">
          Open to research collaborations, engineering roles, and conversations about signal, systems,
          or intelligence.
        </p>

        <div ref={linksRef} className="mt-10 flex flex-wrap justify-center gap-3">
          {CONTACTS.map((contact) => {
            const Icon = contact.icon
            return (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full text-sm text-white/80 hover:text-cyan hover:bg-cyan/10 hover:border-cyan/30 transition-all duration-300 hover:shadow-glow-sm"
              >
                <Icon size={16} className="text-cyan" />
                <span className="font-body">{contact.label}</span>
              </a>
            )
          })}
        </div>

        <p className="mt-6 font-mono text-xs text-white/40">
          srijanm04@gmail.com
        </p>

        <div ref={footerRef} className="mt-16 opacity-0">
          <p className="font-mono text-xs text-white/30">
            © 2026 Shobhit Parvan · Built with signal and code.
          </p>
        </div>
      </div>
    </section>
  )
}
