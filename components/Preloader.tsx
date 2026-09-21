'use client'

import React, { useEffect, useState, useRef } from 'react'
import './Preloader.css'

interface ArchitecturalRef {
  src: string
  title: string
  architect: string
  year: string
}

/* ─── Curated Iconic Architectural Landmarks & Spatial Details ─── */
const ARCHITECTURAL_REFS: ArchitecturalRef[] = [
  {
    src: '/preloader/arch-1.jpg',
    title: 'BARCELONA PAVILION',
    architect: 'MIES VAN DER ROHE',
    year: '1929',
  },
  {
    src: '/preloader/arch-2.jpg',
    title: 'SALK INSTITUTE',
    architect: 'LOUIS KAHN',
    year: '1965',
  },
  {
    src: '/preloader/arch-3.jpg',
    title: 'VILLA SAVOYE',
    architect: 'LE CORBUSIER',
    year: '1931',
  },
  {
    src: '/preloader/arch-4.jpg',
    title: 'CHURCH OF THE LIGHT',
    architect: 'TADAO ANDO',
    year: '1989',
  },
  {
    src: '/preloader/arch-5.jpg',
    title: 'FALLINGWATER',
    architect: 'FRANK LLOYD WRIGHT',
    year: '1935',
  },
  {
    src: '/preloader/arch-6.jpg',
    title: 'FARNSWORTH HOUSE',
    architect: 'MIES VAN DER ROHE',
    year: '1951',
  },
  {
    src: '/preloader/arch-7.jpg',
    title: 'SCULPTURAL STAIRWAY & VOID',
    architect: 'CONCRETE MONOLITH',
    year: 'STUDIO REF.',
  },
  {
    src: '/preloader/arch-8.jpg',
    title: 'COLONNADE & SHADOW GRID',
    architect: 'STRUCTURAL AXIS',
    year: 'ARCHIVE',
  },
]

type PreloaderStage =
  | 'counting'    // Phase 1 & 2: Rapid cycle + counter 00% -> 100%
  | 'hold100'     // Phase 3: Hold 100% and final image briefly
  | 'frameFade'   // Phase 3: Image frame scales down and fades out
  | 'negative'    // Phase 3: Brief intentional negative space
  | 'helloReveal' // Phase 4: "HELLO." appears
  | 'helloExit'   // Phase 4: "HELLO." fades upward
  | 'overlayFade' // Phase 5: Warm-white backdrop dissolves, revealing homepage
  | 'done'        // Phase 5: Preloader unmounted completely

const STORAGE_KEY = 'aparna_portfolio_preloader_seen'

export default function Preloader() {
  const [stage, setStage] = useState<PreloaderStage | null>(null)
  const [counter, setCounter] = useState(0)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const activeImageIdxRef = useRef(0)
  const timerIds = useRef<NodeJS.Timeout[]>([])

  const addTimer = (cb: () => void, ms: number) => {
    const id = setTimeout(cb, ms)
    timerIds.current.push(id)
    return id
  }

  useEffect(() => {
    // Expose dev helper to replay anytime in console
    if (typeof window !== 'undefined') {
      ;(window as any).replayPreloader = () => {
        sessionStorage.removeItem(STORAGE_KEY)
        window.location.reload()
      }
    }

    // Check if session has already seen preloader
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const forceMode = searchParams?.get('preloader') === 'true' || searchParams?.get('reload') === '1'
    const alreadySeen = typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY)

    if (alreadySeen && !forceMode) {
      setStage('done')
      return
    }

    // Lock body scroll while preloader is active
    document.body.style.overflow = 'hidden'

    // Preload all 8 reference images into memory for zero lag
    ARCHITECTURAL_REFS.forEach((ref) => {
      const img = new Image()
      img.src = ref.src
    })

    setStage('counting')

    // Phase 1: Smooth 00% -> 100% counting animation (~1600ms)
    const duration = 1600
    const startTime = performance.now()
    let animationFrameId: number

    const updateCounter = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Architectural ease-out: slightly faster in middle, settling smoothly into 100%
      const eased = 1 - Math.pow(1 - progress, 2.2)
      const currentVal = Math.floor(eased * 100)

      setCounter(currentVal)

      // Calculate which architectural image is active (0 to 7)
      const imgIdx = Math.min(
        ARCHITECTURAL_REFS.length - 1,
        Math.floor(progress * ARCHITECTURAL_REFS.length)
      )

      if (imgIdx !== activeImageIdxRef.current) {
        activeImageIdxRef.current = imgIdx
        setActiveImageIdx(imgIdx)
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter)
      } else {
        setCounter(100)
        setActiveImageIdx(ARCHITECTURAL_REFS.length - 1)

        // Phase 3: Hold 100% for ~180ms
        setStage('hold100')

        addTimer(() => {
          // Frame scales down & fades away
          setStage('frameFade')

          addTimer(() => {
            // Brief quiet warm-white negative space
            setStage('negative')

            addTimer(() => {
              // Phase 4: Reveal "HELLO."
              setStage('helloReveal')

              addTimer(() => {
                // "HELLO." fades out & drifts upward
                setStage('helloExit')

                addTimer(() => {
                  // Phase 5: Warm-white backdrop dissolves, revealing homepage
                  setStage('overlayFade')

                  addTimer(() => {
                    // Preloader complete
                    try {
                      sessionStorage.setItem(STORAGE_KEY, 'true')
                    } catch {
                      // ignore storage errors in restricted contexts
                    }
                    document.body.style.overflow = ''
                    setStage('done')
                  }, 500) // matches overlay transition duration
                }, 260)
              }, 600) // HELLO hold duration
            }, 200) // Negative space duration
          }, 350) // Frame fade duration
        }, 180) // 100% hold duration
      }
    }

    animationFrameId = requestAnimationFrame(updateCounter)

    return () => {
      cancelAnimationFrame(animationFrameId)
      timerIds.current.forEach(clearTimeout)
      document.body.style.overflow = ''
    }
  }, [])

  if (!stage || stage === 'done') {
    return null
  }

  // Format counter to 2 digits ("00%" -> "09%" -> "100%")
  const formattedCount = counter < 10 ? `0${counter}%` : `${counter}%`
  const safeIdx = Math.max(0, Math.min(ARCHITECTURAL_REFS.length - 1, typeof activeImageIdx === 'number' && !isNaN(activeImageIdx) ? activeImageIdx : 0))
  const activeRef = ARCHITECTURAL_REFS[safeIdx] || ARCHITECTURAL_REFS[0]

  const isFrameHidden =
    stage === 'frameFade' ||
    stage === 'negative' ||
    stage === 'helloReveal' ||
    stage === 'helloExit' ||
    stage === 'overlayFade'

  const isHelloVisible = stage === 'helloReveal'
  const isHelloExit = stage === 'helloExit'
  const isOverlayExiting = stage === 'overlayFade'

  return (
    <div
      className={`preloader-overlay ${isOverlayExiting ? 'is-exiting' : ''}`}
      aria-hidden="true"
      data-stage={stage}
    >
      {/* ─── Phase 1 & 2: Architectural Contact Sheet Frame ─── */}
      <div className={`preloader-frame-unit ${isFrameHidden ? 'is-frame-hidden' : ''}`}>
        {/* Top bar: Studio Name & Numerical Counter */}
        <div className="preloader-topbar">
          <span className="preloader-name">APARNA S BINU</span>
          <span className="preloader-counter">{formattedCount}</span>
        </div>

        {/* Central Rectangular Architectural Frame */}
        <div className="preloader-image-frame">
          {/* Subtle architectural drafting corner registration ticks */}
          <div className="preloader-corner preloader-corner-tl" />
          <div className="preloader-corner preloader-corner-tr" />
          <div className="preloader-corner preloader-corner-bl" />
          <div className="preloader-corner preloader-corner-br" />

          {/* Rapidly cycling iconic architectural references */}
          {ARCHITECTURAL_REFS.map((ref, idx) => (
            <img
              key={ref.src}
              className={`preloader-img ${idx === safeIdx ? 'is-active' : ''}`}
              src={ref.src}
              alt=""
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ))}
        </div>

        {/* Bottom bar: Architectural Reference Citation */}
        <div className="preloader-bottombar">
          <span className="preloader-bottom-label">ARCHITECTURAL ARCHIVE</span>
          <span className="preloader-bottom-ref">
            REF. 0{safeIdx + 1} — {activeRef?.architect ?? 'MIES VAN DER ROHE'}
          </span>
        </div>
      </div>

      {/* ─── Phase 4: "HELLO." Editorial Reveal ─── */}
      <div
        className={`preloader-hello-wrap ${isHelloVisible ? 'is-hello-visible' : ''} ${
          isHelloExit ? 'is-hello-exit' : ''
        }`}
      >
        <h1 className="preloader-hello-title">
          HELLO<span className="preloader-hello-dot">.</span>
        </h1>
      </div>
    </div>
  )
}
