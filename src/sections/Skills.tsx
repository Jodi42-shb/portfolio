import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SKILL_CATEGORIES = [
  {
    label: 'Languages',
    skills: ['Python', 'C/C++', 'Bash', 'Rust', 'SQL', 'LaTeX'],
  },
  {
    label: 'ML / Deep Learning',
    skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost', 'RoBERTa', 'Wav2Vec', 'Semantic Embeddings'],
  },
  {
    label: 'Audio & NLP',
    skills: ['COVAREP', 'librosa', 'Speech Processing', 'Multimodal Fusion', 'TTS (Piper, XTTS-v2)'],
  },
  {
    label: 'RAG & LLMs',
    skills: ['Ollama', 'ChromaDB', 'SentenceTransformers', 'Retrieval-Augmented Generation'],
  },
  {
    label: 'Data & Processing',
    skills: ['Pandas', 'NumPy', 'SciPy', 'Feature Engineering', 'Class Imbalance Handling'],
  },
  {
    label: 'Deployment',
    skills: ['Docker (CPU & GPU)', 'Streamlit', 'FastAPI', 'HuggingFace Spaces', 'GitHub API'],
  },
  {
    label: 'Databases',
    skills: ['Firebase', 'MySQL', 'ChromaDB', 'AWS S3'],
  },
  {
    label: 'RF / Microwave',
    skills: ['Ansys HFSS', 'CST Studio Suite', 'Cadence OrCAD Capture'],
  },
  {
    label: 'Systems',
    skills: ['Linux (Arch)', 'Bash Scripting', 'Git/GitHub'],
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const groupsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
      })

      groupsRef.current.filter(Boolean).forEach((group, i) => {
        const tags = group?.querySelectorAll('.skill-tag')
        gsap.fromTo(
          group,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
        if (tags && tags.length > 0) {
          gsap.fromTo(
            tags,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: 'power3.out',
              delay: i * 0.15 + 0.2,
              scrollTrigger: {
                trigger: group,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[120px]"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)]">
        {/* Section label */}
        <div ref={labelRef} className="flex items-center gap-4 mb-16 opacity-0">
          <span className="font-mono text-xs uppercase tracking-[0.05em] text-cyan">SKILLS</span>
          <div className="h-[1px] w-10 bg-white/10" />
        </div>

        <div className="space-y-10">
          {SKILL_CATEGORIES.map((category, i) => (
            <div
              key={category.label}
              ref={(el) => { groupsRef.current[i] = el }}
              className="opacity-0"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.05em] text-white/40 mb-4">
                {category.label}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag font-mono text-sm px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white/65 transition-all duration-200 hover:bg-cyan/10 hover:border-cyan/40 hover:text-cyan hover:scale-105 cursor-default"
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
  )
}
