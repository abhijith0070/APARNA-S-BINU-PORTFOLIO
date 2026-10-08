'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import { archiveImages, type ArchiveImage } from '@/lib/archiveImages'
import './archive.css'

/* ============================================================
   TYPE DEFINITIONS
   ============================================================ */
type ArchiveView = 'feature' | 'grid'

/* ============================================================
   INTERSECTION OBSERVER HOOK — Subtle reveal on scroll
   ============================================================ */
function useRevealOnScroll(activeView: ArchiveView) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const selector = activeView === 'feature' ? '.archive-feature-item' : '.archive-grid-item'

    if (prefersReducedMotion) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((e) => e.isIntersecting)
        entering.forEach((entry, idx) => {
          const delay = Math.min(idx * 60, 240)
          setTimeout(() => {
            entry.target.classList.add('is-visible')
          }, delay)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )

    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [activeView])
}

/* ============================================================
   VIEW SWITCHER — Only FEATURE | GRID
   ============================================================ */
function ArchiveViewSwitcher({
  active,
  onChange,
}: {
  active: ArchiveView
  onChange: (mode: ArchiveView) => void
}) {
  return (
    <div className="archive-view-switcher" role="tablist" aria-label="Archive view mode">
      <button
        role="tab"
        aria-selected={active === 'feature'}
        className={`archive-view-btn ${active === 'feature' ? 'is-active' : ''}`}
        onClick={() => onChange('feature')}
        type="button"
        data-cursor="link"
      >
        Feature
      </button>
      <button
        role="tab"
        aria-selected={active === 'grid'}
        className={`archive-view-btn ${active === 'grid' ? 'is-active' : ''}`}
        onClick={() => onChange('grid')}
        type="button"
        data-cursor="link"
      >
        Grid
      </button>
    </div>
  )
}

/* ============================================================
   LIGHTBOX — Architecture Publication Image Viewer
   ============================================================ */
function Lightbox({
  images,
  activeIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: {
  images: ArchiveImage[]
  activeIndex: number
  isOpen: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, onPrev, onNext])

  // Focus trap on open
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      const closeBtn = overlayRef.current.querySelector<HTMLButtonElement>('.archive-lightbox-close')
      closeBtn?.focus()
    }
  }, [isOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) onNext()
      else onPrev()
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  const current = images[activeIndex]
  if (!current) return null

  return (
    <div
      ref={overlayRef}
      className={`archive-lightbox-overlay ${isOpen ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="archive-lightbox-content">
        <button
          className="archive-lightbox-close"
          onClick={onClose}
          aria-label="Close lightbox"
          data-cursor="link"
          type="button"
        >
          ✕
        </button>

        <button
          className="archive-lightbox-nav archive-lightbox-prev"
          onClick={onPrev}
          aria-label="Previous image"
          data-cursor="link"
          type="button"
        >
          ←
        </button>

        <img
          key={current.id}
          className="archive-lightbox-img"
          src={encodeURI(current.src)}
          alt={current.alt}
          draggable={false}
        />

        <button
          className="archive-lightbox-nav archive-lightbox-next"
          onClick={onNext}
          aria-label="Next image"
          data-cursor="link"
          type="button"
        >
          →
        </button>

        <span className="archive-lightbox-counter" aria-live="polite">
          {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

/* ============================================================
   FEATURE VIEW — Large, Immersive, Editorial Architecture Collage
   Image-dominant, full-canvas visual spreads with tight gutters.
   Total 16 photographs organized into rhythmic editorial spreads:
   - Comp 1: BIG + BIG (Photos 01 & 02)
   - Comp 2: MEDIUM + BIG (Photos 03 & 04)
   - Comp 3: BIG + MEDIUM (Photos 05 & 06)
   - Comp 4: BIG + BIG (Photos 07 & 08)
   - Comp 5: FULL-WIDTH PANORAMIC MOMENT (Photo 09)
   - Comp 6: MEDIUM + BIG (Photos 10 & 11)
   - Comp 7: BIG + BIG (Photos 12 & 13)
   - Comp 8: BIG + MEDIUM (Photos 14 & 15)
   - Comp 9: FULL-WIDTH FINALE SPREAD (Photo 16)
   ============================================================ */
function ArchiveFeatureView({ onImageClick }: { onImageClick: (index: number) => void }) {
  const images = archiveImages

  return (
    <div className="archive-feature">
      {/* ─── Spread 1: BIG + BIG (Photos 01 & 02) ─── */}
      <section className="feature-comp feature-comp--big-big">
        <div
          className="archive-feature-item comp-item comp-item--big-1"
          onClick={() => onImageClick(0)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 01"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(0)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[0].src)}
            alt={images[0].alt}
            width={images[0].width}
            height={images[0].height}
            loading="eager"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--big-2"
          onClick={() => onImageClick(1)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 02"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(1)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[1].src)}
            alt={images[1].alt}
            width={images[1].width}
            height={images[1].height}
            loading="eager"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 2: MEDIUM + BIG (Photos 03 & 04) ─── */}
      <section className="feature-comp feature-comp--med-big">
        <div
          className="archive-feature-item comp-item comp-item--med"
          onClick={() => onImageClick(2)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 03"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(2)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[2].src)}
            alt={images[2].alt}
            width={images[2].width}
            height={images[2].height}
            loading="eager"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--big"
          onClick={() => onImageClick(3)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 04"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(3)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[3].src)}
            alt={images[3].alt}
            width={images[3].width}
            height={images[3].height}
            loading="eager"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 3: BIG + MEDIUM (Photos 05 & 06) ─── */}
      <section className="feature-comp feature-comp--big-med">
        <div
          className="archive-feature-item comp-item comp-item--big"
          onClick={() => onImageClick(4)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 05"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(4)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[4].src)}
            alt={images[4].alt}
            width={images[4].width}
            height={images[4].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--med"
          onClick={() => onImageClick(5)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 06"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(5)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[5].src)}
            alt={images[5].alt}
            width={images[5].width}
            height={images[5].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 4: BIG + BIG (Photos 07 & 08) ─── */}
      <section className="feature-comp feature-comp--big-big">
        <div
          className="archive-feature-item comp-item comp-item--big-1"
          onClick={() => onImageClick(6)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 07"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(6)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[6].src)}
            alt={images[6].alt}
            width={images[6].width}
            height={images[6].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--big-2"
          onClick={() => onImageClick(7)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 08"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(7)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[7].src)}
            alt={images[7].alt}
            width={images[7].width}
            height={images[7].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 5: FULL-WIDTH PANORAMIC MOMENT (Photo 09) ─── */}
      <section className="feature-comp feature-comp--full">
        <div
          className="archive-feature-item comp-item comp-item--full-bleed"
          onClick={() => onImageClick(8)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 09"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(8)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[8].src)}
            alt={images[8].alt}
            width={images[8].width}
            height={images[8].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 6: MEDIUM + BIG (Photos 10 & 11) ─── */}
      <section className="feature-comp feature-comp--med-big">
        <div
          className="archive-feature-item comp-item comp-item--med"
          onClick={() => onImageClick(9)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 10"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(9)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[9].src)}
            alt={images[9].alt}
            width={images[9].width}
            height={images[9].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--big"
          onClick={() => onImageClick(10)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 11"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(10)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[10].src)}
            alt={images[10].alt}
            width={images[10].width}
            height={images[10].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 7: BIG + BIG (Photos 12 & 13) ─── */}
      <section className="feature-comp feature-comp--big-big">
        <div
          className="archive-feature-item comp-item comp-item--big-1"
          onClick={() => onImageClick(11)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 12"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(11)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[11].src)}
            alt={images[11].alt}
            width={images[11].width}
            height={images[11].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--big-2"
          onClick={() => onImageClick(12)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 13"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(12)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[12].src)}
            alt={images[12].alt}
            width={images[12].width}
            height={images[12].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 8: BIG + MEDIUM (Photos 14 & 15) ─── */}
      <section className="feature-comp feature-comp--big-med">
        <div
          className="archive-feature-item comp-item comp-item--big"
          onClick={() => onImageClick(13)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 14"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(13)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[13].src)}
            alt={images[13].alt}
            width={images[13].width}
            height={images[13].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--med"
          onClick={() => onImageClick(14)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 15"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(14)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[14].src)}
            alt={images[14].alt}
            width={images[14].width}
            height={images[14].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 9: FULL-WIDTH SPREAD (Photo 16) ─── */}
      <section className="feature-comp feature-comp--full">
        <div
          className="archive-feature-item comp-item comp-item--full-bleed"
          onClick={() => onImageClick(15)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 16"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(15)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[15].src)}
            alt={images[15].alt}
            width={images[15].width}
            height={images[15].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 10: BIG + BIG (Photos 17 & 18) ─── */}
      <section className="feature-comp feature-comp--big-big">
        <div
          className="archive-feature-item comp-item comp-item--big-1"
          onClick={() => onImageClick(16)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 17"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(16)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[16].src)}
            alt={images[16].alt}
            width={images[16].width}
            height={images[16].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--big-2"
          onClick={() => onImageClick(17)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 18"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(17)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[17].src)}
            alt={images[17].alt}
            width={images[17].width}
            height={images[17].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 11: FULL-WIDTH PANORAMIC MOMENT (Photo 19) ─── */}
      <section className="feature-comp feature-comp--full">
        <div
          className="archive-feature-item comp-item comp-item--full-bleed"
          onClick={() => onImageClick(18)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 19"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(18)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[18].src)}
            alt={images[18].alt}
            width={images[18].width}
            height={images[18].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 12: MEDIUM + BIG (Photos 20 & 21) ─── */}
      <section className="feature-comp feature-comp--med-big">
        <div
          className="archive-feature-item comp-item comp-item--med"
          onClick={() => onImageClick(19)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 20"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(19)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[19].src)}
            alt={images[19].alt}
            width={images[19].width}
            height={images[19].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--big"
          onClick={() => onImageClick(20)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 21"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(20)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[20].src)}
            alt={images[20].alt}
            width={images[20].width}
            height={images[20].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>

      {/* ─── Spread 13: BIG + MEDIUM (Photos 22 & 23) ─── */}
      <section className="feature-comp feature-comp--big-med">
        <div
          className="archive-feature-item comp-item comp-item--big"
          onClick={() => onImageClick(21)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 22"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(21)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[21].src)}
            alt={images[21].alt}
            width={images[21].width}
            height={images[21].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>

        <div
          className="archive-feature-item comp-item comp-item--med"
          onClick={() => onImageClick(22)}
          role="button"
          tabIndex={0}
          aria-label="View photograph 23"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(22)
            }
          }}
        >
          <img
            className="archive-feature-img"
            src={encodeURI(images[22].src)}
            alt={images[22].alt}
            width={images[22].width}
            height={images[22].height}
            loading="lazy"
            decoding="async"
            data-cursor="link"
          />
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   GRID VIEW — Clean Uniform Archive Index (UNTOUCHED)
   ============================================================ */
function ArchiveGridView({ onImageClick }: { onImageClick: (index: number) => void }) {
  return (
    <div className="archive-grid">
      {archiveImages.map((img, i) => (
        <div
          className="archive-grid-item"
          key={img.id}
          onClick={() => onImageClick(i)}
          role="button"
          tabIndex={0}
          aria-label={`View photograph ${String(img.id).padStart(2, '0')}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onImageClick(i)
            }
          }}
        >
          <img
            className="archive-grid-img"
            src={encodeURI(img.src)}
            alt={img.alt}
            width={img.width}
            height={img.height}
            loading={i < 8 ? 'eager' : 'lazy'}
            decoding="async"
            data-cursor="link"
          />
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   MAIN ARCHIVE PAGE
   ============================================================ */
export default function ArchivePage() {
  const [view, setView] = useState<ArchiveView>('feature')
  const [transitioning, setTransitioning] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Trigger reveal on view mount or switch
  useRevealOnScroll(view)

  const handleViewChange = useCallback(
    (mode: ArchiveView) => {
      if (mode === view) return
      setTransitioning(true)
      setTimeout(() => {
        setView(mode)
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        setTimeout(() => setTransitioning(false), 50)
      }, 200)
    },
    [view]
  )

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev <= 0 ? archiveImages.length - 1 : prev - 1))
  }, [])

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev >= archiveImages.length - 1 ? 0 : prev + 1))
  }, [])

  return (
    <main className="archive-page">
      <Header />

      {/* ─── Intro ─── */}
      <section className="archive-intro" aria-labelledby="archive-heading">
        <hr className="archive-intro-rule" aria-hidden="true" />
        <h1 id="archive-heading" className="archive-title">Archive</h1>
        <p className="archive-subtitle">
          A visual record of architecture, space, material and light.
        </p>
      </section>

      {/* ─── Controls ─── */}
      <div className="archive-controls">
        <span className="archive-count">
          {String(archiveImages.length).padStart(2, '0')} Photographs
        </span>
        <ArchiveViewSwitcher active={view} onChange={handleViewChange} />
      </div>

      {/* ─── Content ─── */}
      <div className={`archive-content ${transitioning ? 'is-transitioning' : ''}`}>
        {view === 'feature' && <ArchiveFeatureView onImageClick={openLightbox} />}
        {view === 'grid' && <ArchiveGridView onImageClick={openLightbox} />}
      </div>

      {/* ─── Lightbox ─── */}
      <Lightbox
        images={archiveImages}
        activeIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />

      {/* ─── Footer ─── */}
      <footer className="archive-footer">
        <span>APARNA S BINU</span>
        <span>Architecture · Spatial Design · Visual Storytelling</span>
        <span>© 2026</span>
      </footer>
    </main>
  )
}
