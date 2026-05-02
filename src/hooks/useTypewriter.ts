import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTypewriterOptions {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function useTypewriter({
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
}: UseTypewriterOptions) {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const type = useCallback(() => {
    const fullText = words[currentIndex]

    if (isDeleting) {
      setCurrentText(fullText.substring(0, currentText.length - 1))
      if (currentText.length <= 1) {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % words.length)
      }
    } else {
      setCurrentText(fullText.substring(0, currentText.length + 1))
      if (currentText.length + 1 >= fullText.length) {
        timerRef.current = setTimeout(() => {
          setIsDeleting(true)
        }, pauseDuration)
        return
      }
    }
  }, [currentText, currentIndex, isDeleting, words, pauseDuration])

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed
    timerRef.current = setTimeout(type, speed)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [type, isDeleting, typingSpeed, deletingSpeed])

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return { text: currentText, showCursor }
}
