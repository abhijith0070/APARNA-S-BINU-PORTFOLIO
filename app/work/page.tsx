'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { projects, allDisciplines, type Project } from '@/lib/projects'
import './work.css'

/* ============================================================
   TYPE DEFINITIONS
   ============================================================ */
type ViewMode = 'fullscreen' | 'grid' | 'list'

/* ============================================================
   VIEW SWITCHER
   ============================================================ */
function ViewSwitcher({
  active,
  onChange,
}: {
  active: ViewMode
  onChange: (mode: ViewMode) => void
}) {
  const modes: { key: ViewMode; label: string }[] = [
    { key: 'fullscreen', label: 'Fullscreen' },
    { key: 'grid', label: 'Grid' },
    { key: 'list', label: 'List' },
  ]

  return (
    <div className="work-view-switcher" role="tablist" aria-label="View mode">
      <span className="work-view-label">View</span>
      {modes.map((m) => (
        <button
          key={m.key}
          role="tab"
          aria-selected={active === m.key}
          className={`work-view-btn ${active === m.key ? 'is-active' : ''}`}
          onClick={() => onChange(m.key)}
          type="button"
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}

/* ============================================================
   FULLSCREEN VIEW
   Full-bleed architectural presentation with stacked photographic
   transitions and subtle depth parallax.
   ============================================================ */
function FullscreenView() {
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const metaTopRefs = useRef<(HTMLDivElement | null)[]>([])
  const metaBottomRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let rafId: number

    const handleScroll = () => {
      const vh = window.innerHeight
      const scrollY = window.scrollY

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return
        const slideTop = i * vh
        const progress = (scrollY - slideTop) / vh // 0 when at top, -1 when 1vh below, >0 when pinned

        const media = mediaRefs.current[i]
        const title = titleRefs.current[i]
        const metaTop = metaTopRefs.current[i]
        const metaBottom = metaBottomRefs.current[i]

        if (progress >= 0 && progress < 1) {
          // Slide is pinned at top and being covered by slide i+1
          if (media) {
            const scale = 1 - progress * 0.05
            const translateY = -progress * 40
            media.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
            media.style.opacity = `${1 - progress * 0.35}`
          }
        } else if (progress < 0 && progress >= -1) {
          // Slide is entering from bottom (-1 to 0)
          const enterProgress = 1 + progress // 0 to 1
          if (media) {
            const imgScale = 1.05 - enterProgress * 0.05
            const imgY = (1 - enterProgress) * 35
            media.style.transform = `translate3d(0, ${imgY}px, 0) scale(${imgScale})`
            media.style.opacity = '1'
          }
          // Title parallax: ~85% scroll velocity (slight lag of 40px settling to 0)
          if (title) {
            const titleLag = (1 - enterProgress) * 40
            title.style.transform = `translate3d(0, ${titleLag}px, 0)`
          }
          // Metadata parallax: ~75% scroll velocity (slight lag of 55px/45px settling to 0)
          if (metaTop) {
            const metaLag = (1 - enterProgress) * 55
            metaTop.style.transform = `translate3d(0, ${metaLag}px, 0)`
          }
          if (metaBottom) {
            const metaLag = (1 - enterProgress) * 45
            metaBottom.style.transform = `translate3d(0, ${metaLag}px, 0)`
          }
        } else if (progress >= 1) {
          // Covered completely
          if (media) {
            media.style.transform = `translate3d(0, -40px, 0) scale(0.95)`
            media.style.opacity = '0.65'
          }
        } else {
          // Below viewport
          if (media) {
            media.style.transform = 'translate3d(0, 35px, 0) scale(1.05)'
          }
          if (title) title.style.transform = 'translate3d(0, 40px, 0)'
          if (metaTop) metaTop.style.transform = 'translate3d(0, 55px, 0)'
          if (metaBottom) metaBottom.style.transform = 'translate3d(0, 45px, 0)'
        }
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="work-fullscreen">
      {projects.map((project, i) => (
        <section
          key={project.id}
          ref={(el) => {
            slideRefs.current[i] = el
          }}
          className="work-fs-slide"
          style={{ zIndex: i + 1 }}
        >
          <Link
            href={`/work/${project.slug}`}
            className="work-fs-link"
            data-cursor="view"
            aria-label={`View project ${project.title}`}
          >
            <div
              className="work-fs-media"
              ref={(el) => {
                mediaRefs.current[i] = el
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="work-fs-image"
                style={{ objectPosition: project.imagePosition || 'center' }}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="work-fs-scrim" aria-hidden="true" />
            </div>

            <div className="work-fs-meta">
              <div
                className="work-fs-meta-top"
                ref={(el) => {
                  metaTopRefs.current[i] = el
                }}
              >
                <span className="work-fs-number">{project.number}</span>
              </div>

              <h2
                className="work-fs-title"
                ref={(el) => {
                  titleRefs.current[i] = el
                }}
              >
                {project.title}
              </h2>

              <div
                className="work-fs-meta-bottom"
                ref={(el) => {
                  metaBottomRefs.current[i] = el
                }}
              >
                <p className="work-fs-disciplines">
                  {project.disciplines.join(' / ')}
                </p>
                <span className="work-fs-year">{project.year}</span>
                <span className="work-fs-counter">
                  {project.number} / {String(projects.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </Link>
        </section>
      ))}
    </div>
  )
}

/* ============================================================
   GRID VIEW
   ============================================================ */
function GridView() {
  return (
    <div className="work-grid">
      {projects.map((project, i) => (
        <Link
          key={project.id}
          href={`/work/${project.slug}`}
          className={`work-grid-card ${i === projects.length - 1 && projects.length % 2 !== 0 ? 'is-full' : ''}`}
          data-cursor="view"
        >
          <div className="work-grid-image-wrap">
            <img
              src={project.image}
              alt={project.title}
              className="work-grid-image"
              loading="lazy"
            />
          </div>
          <div className="work-grid-info">
            <span className="work-grid-number">{project.number}</span>
            <h3 className="work-grid-title">{project.title}</h3>
            <p className="work-grid-disciplines">
              {project.disciplines.join(' / ')}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

/* ============================================================
   LIST VIEW
   ============================================================ */
function ListView() {
  const [filter, setFilter] = useState<string>('All')
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track mouse for floating preview
  useEffect(() => {
    if (isMobile) return

    const handleMouse = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouse)

    const animate = () => {
      if (previewRef.current && hoveredProject) {
        const x = mousePos.current.x + 24
        const y = mousePos.current.y - 60
        previewRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [hoveredProject, isMobile])

  const filtered =
    filter === 'All'
      ? projects
      : projects.filter((p) => p.disciplines.includes(filter))

  return (
    <div className="work-list-wrap">
      {/* Filter row */}
      <div className="work-list-filters" role="group" aria-label="Filter by discipline">
        <button
          className={`work-filter-btn ${filter === 'All' ? 'is-active' : ''}`}
          onClick={() => setFilter('All')}
          type="button"
        >
          All
        </button>
        {allDisciplines.map((d) => (
          <button
            key={d}
            className={`work-filter-btn ${filter === d ? 'is-active' : ''}`}
            onClick={() => setFilter(d)}
            type="button"
          >
            {d}
          </button>
        ))}
      </div>

      {/* Project list */}
      <div className="work-list">
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/work/${project.slug}`}
            className="work-list-row"
            data-cursor="view"
            onMouseEnter={() => !isMobile && setHoveredProject(project)}
            onMouseLeave={() => !isMobile && setHoveredProject(null)}
          >
            <span className="work-list-num">{project.number}</span>
            <span className="work-list-title">{project.title}</span>
            <span className="work-list-disciplines">
              {project.disciplines.join(' / ')}
            </span>
            <span className="work-list-year">{project.year}</span>
            <span className="work-list-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>

      {/* Floating hover preview (desktop only) */}
      {!isMobile && (
        <div
          ref={previewRef}
          className={`work-list-preview ${hoveredProject ? 'is-visible' : ''}`}
          aria-hidden="true"
        >
          {hoveredProject && (
            <img
              src={hoveredProject.image}
              alt=""
              className="work-list-preview-img"
            />
          )}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   MAIN WORK PAGE
   ============================================================ */
export default function WorkPage() {
  const [view, setView] = useState<ViewMode>('fullscreen')
  const [transitioning, setTransitioning] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleViewChange = useCallback(
    (mode: ViewMode) => {
      if (mode === view) return
      setTransitioning(true)

      // Brief fade out, swap view, fade in
      setTimeout(() => {
        setView(mode)
        // Scroll to top of content area on view change
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        setTimeout(() => setTransitioning(false), 50)
      }, 300)
    },
    [view]
  )

  const isFullscreen = view === 'fullscreen'

  return (
    <main className={`work-page ${isFullscreen ? 'is-fullscreen' : 'is-standard-view'}`}>
      {/* Universal Portfolio Navigation across all view modes */}
      <Header theme={isFullscreen ? 'dark' : 'light'} />

      {/* View Switcher Controls — separate UI from main navbar */}
      {isFullscreen ? (
        <div className="work-fs-switcher-wrap">
          <ViewSwitcher active={view} onChange={handleViewChange} />
        </div>
      ) : (
        <div className="work-controls-bar">
          <div className="work-controls-left">
            <span className="work-controls-count">Index · 0{projects.length} Selected Works</span>
          </div>
          <ViewSwitcher active={view} onChange={handleViewChange} />
        </div>
      )}

      {/* Content area with smooth transition */}
      <div
        ref={contentRef}
        className={`work-content ${transitioning ? 'is-transitioning' : ''}`}
      >
        {view === 'fullscreen' && <FullscreenView />}
        {view === 'grid' && <GridView />}
        {view === 'list' && <ListView />}
      </div>

      {/* Approved footer for Grid and List views */}
      {!isFullscreen && (
        <footer className="work-footer">
          <span>APARNA S BINU</span>
          <span>Architecture · Spatial Design · Visual Storytelling</span>
          <span>© 2026</span>
        </footer>
      )}
    </main>
  )
}
