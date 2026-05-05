import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EXPERIENCES = [
  {
    role: 'AWS Cloud Virtual Internship',
    company: 'Edu-Versity',
    location: 'Online',
    date: 'July – Sept 2024',
    bullets: [
      'Architected and deployed serverless ML inference pipeline using Lambda, S3, and API Gateway; reduced inference latency by 40% vs. on-premises',
      'Containerized multi-service application with Docker; orchestrated deployment across AWS EC2 and Google Cloud instances',
      'Configured VPC, IAM policies, and security groups for multi-tier application; implemented least-privilege access model',
    ],
  },
  {
    role: 'Summer Internship',
    company: 'Banaras Locomotive Workshop',
    location: 'Varanasi, On-site',
    date: 'June – July 2024',
    bullets: [
      'Received practical training in SCADA, TAS, TELE.EXCHANGE, and LTS systems',
      'Gained hands-on experience in maintenance and operation of locomotive systems',
      'Developed understanding of locomotive control systems, communication protocols, and safety measures',
    ],
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label animation
      gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
      })

      // Timeline line draw
      gsap.fromTo(
        timelineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: 'power3.out',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      )

      // Cards stagger in
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        const isLeft = i % 2 === 0
        gsap.fromTo(
          card,
          { opacity: 0, x: isLeft ? -30 : 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
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
      id="experience"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[120px]"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)]">
        {/* Section label */}
        <div ref={labelRef} className="flex items-center gap-4 mb-16 opacity-0">
          <span className="font-mono text-xs uppercase tracking-[0.05em] text-cyan">EXPERIENCE</span>
          <div className="h-[1px] w-10 bg-white/10" />
        </div>

        <div className="relative">
          {/* Timeline line - desktop center, mobile left */}
          <div
            ref={timelineRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 md:-translate-x-1/2"
          />

          <div className="space-y-12 md:space-y-0">
            {EXPERIENCES.map((exp, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={exp.role}
                  className={`relative md:flex md:items-center ${
                    isLeft ? 'md:justify-start' : 'md:justify-end'
                  } md:w-full`}
                >
                  {/* Mobile dot */}
                  <div className="absolute left-4 top-6 w-2 h-2 rounded-full bg-cyan md:hidden -translate-x-1/2" />

                  {/* Desktop dot on timeline */}
                  <div className="hidden md:block absolute left-1/2 top-8 w-2.5 h-2.5 rounded-full bg-cyan -translate-x-1/2 z-10" />

                  {/* Card */}
                  <div
                    ref={(el) => { cardsRef.current[i] = el }}
                    className={`glass rounded-2xl p-6 md:p-8 ml-10 md:ml-0 md:w-[46%] opacity-0 ${
                      isLeft ? 'md:mr-auto' : 'md:ml-auto'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                      <span className="font-mono text-xs text-white/40">{exp.date}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-white">{exp.role}</h3>
                    <p className="text-sm text-white/40 mt-0.5">
                      {exp.company} · {exp.location}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-white/65 leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
