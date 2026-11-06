'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { Project, ProjectGalleryItem } from '@/lib/projects'

interface LightboxItem {
  src: string
  alt: string
  title: string
  subtitle?: string
  caption?: string
  width?: number
  height?: number
}

interface ProjectGalleryProps {
  project: Project
  items: ProjectGalleryItem[]
}

export default function ProjectGallery({ project, items }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({})

  const handleImageError = (id: string) => {
    setFailedIds((prev) => ({ ...prev, [id]: true }))
  }

  // Filter out any image that fails to load so broken boxes are never displayed
  const validItems = useMemo(() => items.filter((it) => !failedIds[it.id]), [items, failedIds])

  // Construct complete array of active images for the architectural lightbox viewer
  const allImages: LightboxItem[] = useMemo(() => {
    const list: LightboxItem[] = [
      {
        src: project.image,
        alt: `${project.title} — Main Architectural Perspective Render`,
        title: 'Main Perspective Render',
        subtitle: 'Exterior Context & Arrival Composition',
        caption: `Final architectural exterior visualization for ${project.title}.`,
      },
      ...validItems.map((it) => ({
        src: it.src,
        alt: it.alt,
        title: it.title,
        subtitle: it.subtitle,
        caption: it.caption,
        width: it.width,
        height: it.height,
      })),
    ]
    return list
  }, [project, validItems])

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setIsZoomed(false)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setIsZoomed(false)
  }, [])

  const prevImage = useCallback(() => {
    setIsZoomed(false)
    setLightboxIndex((prev) => (prev <= 0 ? allImages.length - 1 : prev - 1))
  }, [allImages.length])

  const nextImage = useCallback(() => {
    setIsZoomed(false)
    setLightboxIndex((prev) => (prev >= allImages.length - 1 ? 0 : prev + 1))
  }, [allImages.length])

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, closeLightbox, prevImage, nextImage])

  // Find index in allImages for an item
  const getItemIndex = (src: string) => {
    const idx = allImages.findIndex((img) => img.src === src)
    return idx >= 0 ? idx : 0
  }

  const currentLightbox = allImages[lightboxIndex]

  // Shared Lightbox Modal
  const renderLightbox = () => {
    if (!lightboxOpen || !currentLightbox) return null
    return (
      <div
        className={`project-lightbox-overlay ${lightboxOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Architectural image inspection viewer"
      >
        {/* Top Control Bar */}
        <div className="project-lightbox-bar">
          <div className="project-lightbox-info">
            <span className="project-lightbox-counter">
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
            </span>
            <span className="project-lightbox-title">
              {currentLightbox.title}
            </span>
          </div>

          <div className="project-lightbox-controls">
            <button
              className="project-lightbox-btn"
              type="button"
              onClick={() => setIsZoomed((z) => !z)}
              title={isZoomed ? 'Reset zoom' : 'Zoom 100%'}
            >
              {isZoomed ? 'Reset Zoom' : 'Zoom (100%)'}
            </button>
            <button
              className="project-lightbox-close"
              type="button"
              onClick={closeLightbox}
              aria-label="Close image viewer"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Image Stage */}
        <div
          className="project-lightbox-stage"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox()
          }}
        >
          <button
            className="project-lightbox-nav project-lightbox-prev"
            type="button"
            onClick={prevImage}
            aria-label="Previous image"
          >
            &#8592;
          </button>

          <div
            className="project-lightbox-img-wrap"
            style={{
              transform: isZoomed ? 'scale(1.75)' : 'none',
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            }}
            onClick={() => setIsZoomed((z) => !z)}
          >
            <img
              src={currentLightbox.src}
              alt={currentLightbox.alt}
              className="project-lightbox-img"
            />
          </div>

          <button
            className="project-lightbox-nav project-lightbox-next"
            type="button"
            onClick={nextImage}
            aria-label="Next image"
          >
            &#8594;
          </button>
        </div>

        {/* Bottom Caption Bar */}
        {currentLightbox.caption && (
          <div className="project-lightbox-caption">
            {currentLightbox.caption}
          </div>
        )}
      </div>
    )
  }

  // ========================================================
  // SPECIALIZED PRESENTATION FOR COMMUNITY CENTRE
  // ========================================================
  if (project.slug === 'community-centre') {
    const masterPlan = validItems.find((it) => it.id === 'community-masterplan')
    const schoolViews = validItems.filter((it) => it.id.startsWith('community-school-'))
    const civicViews = validItems.filter((it) => it.id === 'community-plaza' || it.id === 'community-portal')
    const healthViews = validItems.filter((it) => it.id === 'community-health' || it.id === 'community-health-aerial')
    const hallView = validItems.find((it) => it.id === 'community-assembly-hall')

    return (
      <>
        <div className="project-gallery-root">
          {/* 01. CAMPUS MASTER PLAN & CONTEXTUAL STRATEGY */}
          {masterPlan && (
            <section className="gallery-section" aria-labelledby="section-comm-masterplan">
              <div className="gallery-section-header">
                <span className="gallery-section-num">01</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-comm-masterplan" className="gallery-section-title">
                    Master Plan &amp; Site Strategy
                  </h2>
                  <p className="gallery-section-subtitle">
                    Comprehensive master plan orchestrating educational clusters, civic assembly, healthcare pavilions, and permeable landscape buffers.
                  </p>
                </div>
              </div>

              <article className="gallery-full-card">
                <div
                  className="gallery-image-frame gallery-technical-frame"
                  style={{ aspectRatio: masterPlan.aspectRatio || '10084 / 5304' }}
                  onClick={() => openLightbox(getItemIndex(masterPlan.src))}
                  data-cursor="view"
                >
                  <img
                    src={masterPlan.src}
                    alt={masterPlan.alt}
                    loading="lazy"
                    onError={() => handleImageError(masterPlan.id)}
                  />
                  <div className="gallery-inspect-cue">
                    <span>Inspect Master Plan (10,000px)</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
                <div className="gallery-card-caption">
                  <div className="gallery-card-header">
                    <span className="gallery-card-num">01</span>
                    <strong className="gallery-card-title">{masterPlan.title}</strong>
                  </div>
                  {masterPlan.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{masterPlan.subtitle}</p>}
                  {masterPlan.caption && <p className="gallery-card-desc">{masterPlan.caption}</p>}
                </div>
              </article>
            </section>
          )}

          {/* 02. PRIMARY SCHOOL ARCHITECTURE & LEARNING PODS */}
          {schoolViews.length > 0 && (
            <section className="gallery-section" aria-labelledby="section-comm-school">
              <div className="gallery-section-header">
                <span className="gallery-section-num">02</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-comm-school" className="gallery-section-title">
                    Primary School Learning Pods &amp; Roofscape
                  </h2>
                  <p className="gallery-section-subtitle">
                    Geodesic timber classroom domes integrated with educational play courts, labyrinth gardens, and passive cooling buffers.
                  </p>
                </div>
              </div>

              <div className="gallery-pair-grid">
                {schoolViews.map((item, i) => (
                  <article key={item.id} className="gallery-card">
                    <div
                      className="gallery-image-frame"
                      style={{ aspectRatio: item.aspectRatio || '16 / 9' }}
                      onClick={() => openLightbox(getItemIndex(item.src))}
                      data-cursor="view"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                      <div className="gallery-inspect-cue">
                        <span>View</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                    </div>
                    <div className="gallery-card-caption">
                      <div className="gallery-card-header">
                        <span className="gallery-card-num">0{i + 2}</span>
                        <strong className="gallery-card-title">{item.title}</strong>
                      </div>
                      {item.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{item.subtitle}</p>}
                      {item.caption && <p className="gallery-card-desc">{item.caption}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 03. CIVIC ARRIVAL & CEREMONIAL THRESHOLD */}
          {civicViews.length > 0 && (
            <section className="gallery-section" aria-labelledby="section-comm-civic">
              <div className="gallery-section-header">
                <span className="gallery-section-num">03</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-comm-civic" className="gallery-section-title">
                    Civic Arrival &amp; Ceremonial Threshold
                  </h2>
                  <p className="gallery-section-subtitle">
                    Public concourse integrating stepped vehicular drop-offs, permeable paving, and curved rammed-earth entry gates.
                  </p>
                </div>
              </div>

              <div className="gallery-pair-grid">
                {civicViews.map((item, i) => (
                  <article key={item.id} className="gallery-card">
                    <div
                      className="gallery-image-frame"
                      style={{ aspectRatio: item.aspectRatio || '1.77' }}
                      onClick={() => openLightbox(getItemIndex(item.src))}
                      data-cursor="view"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                      <div className="gallery-inspect-cue">
                        <span>View</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                    </div>
                    <div className="gallery-card-caption">
                      <div className="gallery-card-header">
                        <span className="gallery-card-num">0{i + 4}</span>
                        <strong className="gallery-card-title">{item.title}</strong>
                      </div>
                      {item.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{item.subtitle}</p>}
                      {item.caption && <p className="gallery-card-desc">{item.caption}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 04. PRIMARY HEALTHCARE PAVILION */}
          {healthViews.length > 0 && (
            <section className="gallery-section" aria-labelledby="section-comm-health">
              <div className="gallery-section-header">
                <span className="gallery-section-num">04</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-comm-health" className="gallery-section-title">
                    Healthcare Clinic Pavilion &amp; Courts
                  </h2>
                  <p className="gallery-section-subtitle">
                    Autonomous medical pavilions oriented toward healing courtyards, natural ventilation currents, and discreet emergency ingress.
                  </p>
                </div>
              </div>

              <div className="gallery-pair-grid">
                {healthViews.map((item, i) => (
                  <article key={item.id} className="gallery-card">
                    <div
                      className="gallery-image-frame"
                      style={{ aspectRatio: item.aspectRatio || '1.77' }}
                      onClick={() => openLightbox(getItemIndex(item.src))}
                      data-cursor="view"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                      <div className="gallery-inspect-cue">
                        <span>View</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                    </div>
                    <div className="gallery-card-caption">
                      <div className="gallery-card-header">
                        <span className="gallery-card-num">0{i + 6}</span>
                        <strong className="gallery-card-title">{item.title}</strong>
                      </div>
                      {item.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{item.subtitle}</p>}
                      {item.caption && <p className="gallery-card-desc">{item.caption}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 05. CENTRAL ASSEMBLY HALL */}
          {hallView && (
            <section className="gallery-section" aria-labelledby="section-comm-hall">
              <div className="gallery-section-header">
                <span className="gallery-section-num">05</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-comm-hall" className="gallery-section-title">
                    Central Community Assembly Hall
                  </h2>
                  <p className="gallery-section-subtitle">
                    Large-span timber diagrid dome envelope creating an expansive civic forum for community gatherings and cultural events.
                  </p>
                </div>
              </div>

              <article className="gallery-full-card">
                <div
                  className="gallery-image-frame"
                  style={{ aspectRatio: hallView.aspectRatio || '1.77' }}
                  onClick={() => openLightbox(getItemIndex(hallView.src))}
                  data-cursor="view"
                >
                  <img
                    src={hallView.src}
                    alt={hallView.alt}
                    loading="lazy"
                    onError={() => handleImageError(hallView.id)}
                  />
                  <div className="gallery-inspect-cue">
                    <span>View</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
                <div className="gallery-card-caption">
                  <div className="gallery-card-header">
                    <span className="gallery-card-num">08</span>
                    <strong className="gallery-card-title">{hallView.title}</strong>
                  </div>
                  {hallView.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{hallView.subtitle}</p>}
                  {hallView.caption && <p className="gallery-card-desc">{hallView.caption}</p>}
                </div>
              </article>
            </section>
          )}
        </div>

        {renderLightbox()}
      </>
    )
  }

  // ========================================================
  // SPECIALIZED PRESENTATION FOR CAMPUS
  // ========================================================
  if (project.slug === 'campus') {
    const campusMasterplan = validItems.find((it) => it.id === 'campus-masterplan')
    const campusViews = validItems.filter((it) => it.id === 'campus-entrance' || it.id === 'campus-faculty')
    const campusPromenade = validItems.find((it) => it.id === 'campus-promenade')

    return (
      <>
        <div className="project-gallery-root">
          {/* 01. COASTAL MASTER PLAN & MARITIME ORIENTATION */}
          {campusMasterplan && (
            <section className="gallery-section" aria-labelledby="section-campus-masterplan">
              <div className="gallery-section-header">
                <span className="gallery-section-num">01</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-campus-masterplan" className="gallery-section-title">
                    Coastal Master Plan &amp; Maritime Orientation
                  </h2>
                  <p className="gallery-section-subtitle">
                    Comprehensive site master planning organizing academic faculties, sports fields, student residence halls, and coastal promenade along the Arabian Sea.
                  </p>
                </div>
              </div>

              <article className="gallery-full-card">
                <div
                  className="gallery-image-frame gallery-technical-frame"
                  style={{
                    aspectRatio: campusMasterplan.aspectRatio || '1054 / 1492',
                    maxHeight: '85vh',
                    margin: '0 auto',
                  }}
                  onClick={() => openLightbox(getItemIndex(campusMasterplan.src))}
                  data-cursor="view"
                >
                  <img
                    src={campusMasterplan.src}
                    alt={campusMasterplan.alt}
                    loading="lazy"
                    onError={() => handleImageError(campusMasterplan.id)}
                    style={{ objectFit: 'contain' }}
                  />
                  <div className="gallery-inspect-cue">
                    <span>Inspect Master Plan Drawing</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
                <div className="gallery-card-caption">
                  <div className="gallery-card-header">
                    <span className="gallery-card-num">01</span>
                    <strong className="gallery-card-title">{campusMasterplan.title}</strong>
                  </div>
                  {campusMasterplan.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{campusMasterplan.subtitle}</p>}
                  {campusMasterplan.caption && <p className="gallery-card-desc">{campusMasterplan.caption}</p>}
                </div>
              </article>
            </section>
          )}

          {/* 02. ACADEMIC COLONNADES & CEREMONIAL ARRIVAL */}
          {campusViews.length > 0 && (
            <section className="gallery-section" aria-labelledby="section-campus-views">
              <div className="gallery-section-header">
                <span className="gallery-section-num">02</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-campus-views" className="gallery-section-title">
                    Ceremonial Arrival &amp; Academic Colonnades
                  </h2>
                  <p className="gallery-section-subtitle">
                    Stepped pedestrian approaches and symmetrical faculty elevations with deep loggias and passive solar shading.
                  </p>
                </div>
              </div>

              <div className="gallery-pair-grid">
                {campusViews.map((item, i) => (
                  <article key={item.id} className="gallery-card">
                    <div
                      className="gallery-image-frame"
                      style={{ aspectRatio: item.aspectRatio || '1.8' }}
                      onClick={() => openLightbox(getItemIndex(item.src))}
                      data-cursor="view"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                      <div className="gallery-inspect-cue">
                        <span>View</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                    </div>
                    <div className="gallery-card-caption">
                      <div className="gallery-card-header">
                        <span className="gallery-card-num">0{i + 2}</span>
                        <strong className="gallery-card-title">{item.title}</strong>
                      </div>
                      {item.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{item.subtitle}</p>}
                      {item.caption && <p className="gallery-card-desc">{item.caption}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 03. PANORAMIC COASTAL PROMENADE & WAVE CANOPY */}
          {campusPromenade && (
            <section className="gallery-section" aria-labelledby="section-campus-promenade">
              <div className="gallery-section-header">
                <span className="gallery-section-num">03</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-campus-promenade" className="gallery-section-title">
                    Coastal Promenade &amp; Wave Canopy
                  </h2>
                  <p className="gallery-section-subtitle">
                    Dynamic undulating roof profile inspired by maritime swells, sheltering outdoor student esplanades and gathering spaces.
                  </p>
                </div>
              </div>

              <article className="gallery-full-card">
                <div
                  className="gallery-image-frame"
                  style={{ aspectRatio: campusPromenade.aspectRatio || '1483 / 357' }}
                  onClick={() => openLightbox(getItemIndex(campusPromenade.src))}
                  data-cursor="view"
                >
                  <img
                    src={campusPromenade.src}
                    alt={campusPromenade.alt}
                    loading="lazy"
                    onError={() => handleImageError(campusPromenade.id)}
                  />
                  <div className="gallery-inspect-cue">
                    <span>View</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
                <div className="gallery-card-caption">
                  <div className="gallery-card-header">
                    <span className="gallery-card-num">04</span>
                    <strong className="gallery-card-title">{campusPromenade.title}</strong>
                  </div>
                  {campusPromenade.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{campusPromenade.subtitle}</p>}
                  {campusPromenade.caption && <p className="gallery-card-desc">{campusPromenade.caption}</p>}
                </div>
              </article>
            </section>
          )}
        </div>

        {renderLightbox()}
      </>
    )
  }

  // ========================================================
  // SPECIALIZED PRESENTATION FOR CAFE
  // ========================================================
  if (project.slug === 'cafe') {
    const cafeItem = validItems[0] || {
      id: 'cafe-perspective',
      src: project.image,
      alt: 'Café architectural perspective visualization with warm interior glow and outdoor seating',
      title: 'Architectural Perspective',
      subtitle: 'Warm Evening Ambience & Street Interface',
      caption: 'Architectural visualization capturing the intimate dialogue between heritage brickwork, contemporary timber joinery, and warm twilight illumination.',
      aspectRatio: '2048 / 1152',
    }

    return (
      <>
        <div className="project-gallery-root">
          <section className="gallery-section" aria-labelledby="section-cafe-atmosphere">
            <div className="gallery-section-header">
              <span className="gallery-section-num">01</span>
              <div className="gallery-section-title-wrap">
                <h2 id="section-cafe-atmosphere" className="gallery-section-title">
                  Atmospheric Perspective &amp; Evening Interface
                </h2>
                <p className="gallery-section-subtitle">
                  Spatial sequence unfolding from a sheltered street threshold into a double-height dining hall defined by warm lighting and tactile materiality.
                </p>
              </div>
            </div>

            <article className="gallery-full-card">
              <div
                className="gallery-image-frame"
                style={{ aspectRatio: cafeItem.aspectRatio || '2048 / 1152' }}
                onClick={() => openLightbox(getItemIndex(cafeItem.src))}
                data-cursor="view"
              >
                <img
                  src={cafeItem.src}
                  alt={cafeItem.alt}
                  loading="lazy"
                  onError={() => handleImageError(cafeItem.id)}
                />
                <div className="gallery-inspect-cue">
                  <span>View</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </div>
              <div className="gallery-card-caption">
                <div className="gallery-card-header">
                  <span className="gallery-card-num">01</span>
                  <strong className="gallery-card-title">{cafeItem.title}</strong>
                </div>
                {cafeItem.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{cafeItem.subtitle}</p>}
                {cafeItem.caption && <p className="gallery-card-desc">{cafeItem.caption}</p>}
              </div>
            </article>
          </section>
        </div>

        {renderLightbox()}
      </>
    )
  }

  // ========================================================
  // SPECIALIZED PRESENTATION FOR RESIDENCE
  // ========================================================
  if (project.slug === 'residence') {
    const residenceInteriors = validItems.filter((it) => it.category === 'interior')
    const residencePlan = validItems.find((it) => it.category === 'plan')

    return (
      <>
        <div className="project-gallery-root">
          {/* 01. INTERIOR LIVING ENVIRONMENTS (Paired Layout) */}
          {residenceInteriors.length > 0 && (
            <section className="gallery-section" aria-labelledby="section-residence-interiors">
              <div className="gallery-section-header">
                <span className="gallery-section-num">01</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-residence-interiors" className="gallery-section-title">
                    Interior Living Environments
                  </h2>
                  <p className="gallery-section-subtitle">
                    Intimate living spaces negotiating natural light, tactile materiality, and sheltered verandah thresholds.
                  </p>
                </div>
              </div>

              <div
                className="gallery-pair-grid"
                style={residenceInteriors.length === 1 ? { gridTemplateColumns: '1fr' } : undefined}
              >
                {residenceInteriors.map((item, i) => (
                  <article key={item.id} className="gallery-card">
                    <div
                      className="gallery-image-frame"
                      style={{ aspectRatio: item.aspectRatio || '1.13' }}
                      onClick={() => openLightbox(getItemIndex(item.src))}
                      data-cursor="view"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                      <div className="gallery-inspect-cue">
                        <span>View</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                    </div>
                    <div className="gallery-card-caption">
                      <div className="gallery-card-header">
                        <span className="gallery-card-num">0{i + 1}</span>
                        <strong className="gallery-card-title">{item.title}</strong>
                      </div>
                      {item.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{item.subtitle}</p>}
                      {item.caption && <p className="gallery-card-desc">{item.caption}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 02. ARCHITECTURAL FLOOR PLAN (Full-Width Drawing at 9,200px) */}
          {residencePlan && (
            <section className="gallery-section" aria-labelledby="section-residence-plan">
              <div className="gallery-section-header">
                <span className="gallery-section-num">02</span>
                <div className="gallery-section-title-wrap">
                  <h2 id="section-residence-plan" className="gallery-section-title">
                    Architectural Floor Plan
                  </h2>
                  <p className="gallery-section-subtitle">
                    High-resolution architectural drawing (9,200px resolution) documenting room layout, verandah thresholds, internal courtyards, and garden circulation.
                  </p>
                </div>
              </div>

              <article className="gallery-full-card">
                <div
                  className="gallery-image-frame gallery-technical-frame"
                  style={{ aspectRatio: residencePlan.aspectRatio || '1.74' }}
                  onClick={() => openLightbox(getItemIndex(residencePlan.src))}
                  data-cursor="view"
                >
                  <img
                    src={residencePlan.src}
                    alt={residencePlan.alt}
                    loading="lazy"
                    onError={() => handleImageError(residencePlan.id)}
                  />
                  <div className="gallery-inspect-cue">
                    <span>Inspect Plan (9,200px)</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
                <div className="gallery-card-caption">
                  <div className="gallery-card-header">
                    <span className="gallery-card-num">0{residenceInteriors.length + 1}</span>
                    <strong className="gallery-card-title">{residencePlan.title}</strong>
                  </div>
                  {residencePlan.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{residencePlan.subtitle}</p>}
                  {residencePlan.caption && <p className="gallery-card-desc">{residencePlan.caption}</p>}
                </div>
              </article>
            </section>
          )}
        </div>

        {renderLightbox()}
      </>
    )
  }

  // ========================================================
  // DEFAULT ARCHITECTURAL GALLERY (Hospital & Others)
  // ========================================================
  const conceptItems = validItems.filter((it) => it.category === 'concept' || it.category === 'zoning')
  const masterPlanItem = validItems.find((it) => it.category === 'masterplan')
  const planItems = validItems.filter((it) => it.category === 'plan')
  const interiorItems = validItems.filter((it) => it.category === 'interior')
  const presentationItem = validItems.find((it) => it.category === 'presentation')

  return (
    <>
      <div className="project-gallery-root">
        {/* 01. CONCEPT & ZONING DEVELOPMENT (Paired 2-Col Layout) */}
        {conceptItems.length > 0 && (
          <section className="gallery-section" aria-labelledby="section-concept-title">
            <div className="gallery-section-header">
              <span className="gallery-section-num">01</span>
              <div className="gallery-section-title-wrap">
                <h2 id="section-concept-title" className="gallery-section-title">
                  Design Concept &amp; Programmatic Zoning
                </h2>
                <p className="gallery-section-subtitle">
                  Initial morphological studies exploring courtyard punctures, climate response, and spatial segregation.
                </p>
              </div>
            </div>

            <div className="gallery-pair-grid">
              {conceptItems.map((item, i) => (
                <article key={item.id} className="gallery-card">
                  <div
                    className="gallery-image-frame"
                    style={{ aspectRatio: item.aspectRatio || '1.42' }}
                    onClick={() => openLightbox(getItemIndex(item.src))}
                    data-cursor="view"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      onError={() => handleImageError(item.id)}
                    />
                    <div className="gallery-inspect-cue">
                      <span>View</span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </div>
                  <div className="gallery-card-caption">
                    <div className="gallery-card-header">
                      <span className="gallery-card-num">0{i + 1}</span>
                      <strong className="gallery-card-title">{item.title}</strong>
                    </div>
                    {item.caption && <p className="gallery-card-desc">{item.caption}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 02. MASTER PLAN & SITE INTEGRATION (Full-Width Panoramic) */}
        {masterPlanItem && (
          <section className="gallery-section" aria-labelledby="section-masterplan-title">
            <div className="gallery-section-header">
              <span className="gallery-section-num">02</span>
              <div className="gallery-section-title-wrap">
                <h2 id="section-masterplan-title" className="gallery-section-title">
                  Master Plan &amp; Site Strategy
                </h2>
                <p className="gallery-section-subtitle">
                  Site planning detailing emergency drop-off, service circulation, healing gardens, and surrounding road network.
                </p>
              </div>
            </div>

            <article className="gallery-full-card">
              <div
                className="gallery-image-frame"
                style={{ aspectRatio: masterPlanItem.aspectRatio || '2.15' }}
                onClick={() => openLightbox(getItemIndex(masterPlanItem.src))}
                data-cursor="view"
              >
                <img
                  src={masterPlanItem.src}
                  alt={masterPlanItem.alt}
                  loading="lazy"
                  onError={() => handleImageError(masterPlanItem.id)}
                />
                <div className="gallery-inspect-cue">
                  <span>View</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </div>
              <div className="gallery-card-caption">
                <div className="gallery-card-header">
                  <span className="gallery-card-num">03</span>
                  <strong className="gallery-card-title">{masterPlanItem.title}</strong>
                </div>
                {masterPlanItem.caption && (
                  <p className="gallery-card-desc">{masterPlanItem.caption}</p>
                )}
              </div>
            </article>
          </section>
        )}

        {/* 03. ARCHITECTURAL FLOOR PLANS (GF, FF, SF, TF Grid) */}
        {planItems.length > 0 && (
          <section className="gallery-section" aria-labelledby="section-plans-title">
            <div className="gallery-section-header">
              <span className="gallery-section-num">03</span>
              <div className="gallery-section-title-wrap">
                <h2 id="section-plans-title" className="gallery-section-title">
                  Architectural Floor Plans
                </h2>
                <p className="gallery-section-subtitle">
                  Comprehensive vertical programmatic planning from ground triage through clinical suites to upper administration.
                </p>
              </div>
            </div>

            <div className="gallery-pair-grid">
              {planItems.map((item, i) => (
                <article key={item.id} className="gallery-card">
                  <div
                    className="gallery-image-frame"
                    style={{ aspectRatio: item.aspectRatio || '1.42' }}
                    onClick={() => openLightbox(getItemIndex(item.src))}
                    data-cursor="view"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      onError={() => handleImageError(item.id)}
                    />
                    <div className="gallery-inspect-cue">
                      <span>Inspect Drawing</span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </div>
                  <div className="gallery-card-caption">
                    <div className="gallery-card-header">
                      <span className="gallery-card-num">0{i + 4}</span>
                      <strong className="gallery-card-title">{item.title}</strong>
                    </div>
                    {item.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{item.subtitle}</p>}
                    {item.caption && <p className="gallery-card-desc">{item.caption}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 04. INTERIOR VISUALIZATIONS (Paired 2-Col Layout) */}
        {interiorItems.length > 0 && (
          <section className="gallery-section" aria-labelledby="section-interiors-title">
            <div className="gallery-section-header">
              <span className="gallery-section-num">04</span>
              <div className="gallery-section-title-wrap">
                <h2 id="section-interiors-title" className="gallery-section-title">
                  Interior Healing Environments
                </h2>
                <p className="gallery-section-subtitle">
                  Atmospheric perspectives emphasizing biophilic connection, diffuse daylight, and calming patient spaces.
                </p>
              </div>
            </div>

            <div
              className="gallery-pair-grid"
              style={interiorItems.length === 1 ? { gridTemplateColumns: '1fr' } : undefined}
            >
              {interiorItems.map((item, i) => (
                <article key={item.id} className="gallery-card">
                  <div
                    className="gallery-image-frame"
                    style={{ aspectRatio: item.aspectRatio || '1.75' }}
                    onClick={() => openLightbox(getItemIndex(item.src))}
                    data-cursor="view"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      onError={() => handleImageError(item.id)}
                    />
                    <div className="gallery-inspect-cue">
                      <span>View</span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </div>
                  <div className="gallery-card-caption">
                    <div className="gallery-card-header">
                      <span className="gallery-card-num">0{i + 8}</span>
                      <strong className="gallery-card-title">{item.title}</strong>
                    </div>
                    {item.subtitle && <p className="gallery-card-desc" style={{ color: 'var(--ink)' }}>{item.subtitle}</p>}
                    {item.caption && <p className="gallery-card-desc">{item.caption}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 05. REGISTRATION & PRESENTATION (Full-Width Presentation) */}
        {presentationItem && (
          <section className="gallery-section" aria-labelledby="section-presentation-title">
            <div className="gallery-section-header">
              <span className="gallery-section-num">05</span>
              <div className="gallery-section-title-wrap">
                <h2 id="section-presentation-title" className="gallery-section-title">
                  Registration &amp; Project Presentation
                </h2>
                <p className="gallery-section-subtitle">
                  Welcoming threshold portal and registration concourse mediating between public access and patient intake.
                </p>
              </div>
            </div>

            <article className="gallery-full-card">
              <div
                className="gallery-image-frame"
                style={{ aspectRatio: presentationItem.aspectRatio || '1.81' }}
                onClick={() => openLightbox(getItemIndex(presentationItem.src))}
                data-cursor="view"
              >
                <img
                  src={presentationItem.src}
                  alt={presentationItem.alt}
                  loading="lazy"
                  onError={() => handleImageError(presentationItem.id)}
                />
                <div className="gallery-inspect-cue">
                  <span>View</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </div>
              <div className="gallery-card-caption">
                <div className="gallery-card-header">
                  <span className="gallery-card-num">10</span>
                  <strong className="gallery-card-title">{presentationItem.title}</strong>
                </div>
                {presentationItem.caption && (
                  <p className="gallery-card-desc">{presentationItem.caption}</p>
                )}
              </div>
            </article>
          </section>
        )}
      </div>

      {renderLightbox()}
    </>
  )
}
