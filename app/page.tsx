'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Header from '@/components/Header'
import { projects } from '@/lib/projects'

const LocationGlobe = dynamic(() => import('@/components/LocationGlobe'), {
  ssr: false,
  loading: () => <div className="location-globe-container" aria-hidden="true" />,
})

export default function Page() {
  const [activeProject, setActiveProject] = useState(projects[0])

  return (
    <main>
      <Header />

      <div id="top" className="page-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Architecture student / 04—26</p>
            <h1 id="hero-title">A study of<br /><em>space</em> and<br />story.</h1>
            <p className="hero-intro">Exploring the quiet relationships between people, place and the spaces they inhabit.</p>
            <a className="scroll-cue" href="#about" data-cursor="link"><span>Scroll to explore</span><span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-image-wrap">
            <div className="hero-block" aria-hidden="true" />
            <img className="hero-image" src="/portfolio 1.jpg" alt="Sculptural concrete architecture in warm evening light" />
            <p className="image-caption">01 / The built world<br />as an invitation.</p>
          </div>
        </section>

        <section id="about" className="about section-rule" aria-labelledby="about-title">
          <div className="section-marker"><span>01</span><span id="about-title">About</span></div>
          <div className="about-content">
            <p className="statement">I am a fourth-year architecture student drawn to spatial design, visual storytelling and the moments where the two meet.</p>
            <div className="about-notes">
              <p>My process moves through research, observation and experimentation — with a growing fluency in BIM, visualization and digital modelling.</p>
              <p>Outside the studio, videography, classical dance, music, cinema and travel continue to shape how I see and design space.</p>
            </div>
          </div>
        </section>

        <section id="work" className="work section-rule" aria-labelledby="work-title">
          <div className="section-marker"><span>02</span><span id="work-title">Selected work</span></div>
          <div className="work-layout">
            <div className="project-list">
              {projects.map((project) => (
                <Link
                  className="project-row"
                  href={`/work/${project.slug}`}
                  key={project.id}
                  data-cursor="view"
                  onMouseEnter={() => setActiveProject(project)}
                  onFocus={() => setActiveProject(project)}
                  aria-label={`${project.number} ${project.title} — ${project.category} (${project.year})`}
                >
                  {/* Mobile-only architectural project card image */}
                  <div className="project-card-image-wrap">
                    <img
                      className="project-card-image"
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                    />
                  </div>

                  <span className="project-number">{project.number}</span>
                  <div className="project-details">
                    <strong>
                      <span>{project.title}</span>
                      <span className="project-mobile-arrow" aria-hidden="true">↗</span>
                    </strong>
                    <small>{project.category}</small>
                  </div>
                  <span className="project-year">{project.year}</span>
                  <span className="project-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}

              {/* Minimal directional CTA to dedicated /work page */}
              <div className="work-archive-cta">
                <Link href="/work" className="work-archive-link" data-cursor="link">
                  <span>View all work</span>
                  <span className="work-archive-arrow" aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            {/* Desktop sticky preview with clickable link */}
            <div className="project-preview" aria-live="polite">
              <Link
                className="project-preview-link"
                href={`/work/${activeProject.slug}`}
                data-cursor="view"
                aria-label={`View ${activeProject.title}`}
              >
                <img src={activeProject.image} alt={activeProject.title} />
                <p>
                  <span>{activeProject.title}</span>
                  <span>{activeProject.number} ↗</span>
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-rule" aria-labelledby="contact-title">
          <div className="section-marker"><span>03</span><span id="contact-title">Contact</span></div>
          <div className="contact-layout">
            <div className="contact-globe-area">
              <LocationGlobe />
            </div>
            <div className="contact-content">
              <p className="contact-kicker">For collaborations, internships<br />or conversations about space.</p>
              <a className="contact-link" href="mailto:hello@aparnasbinu.com" data-cursor="mail">Let&apos;s talk <span aria-hidden="true">↗</span></a>
              <div className="contact-meta"><span>Based in Kerala, India</span><span>Available for new conversations</span></div>
            </div>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <span>APARNA S BINU</span><span>Architecture · Spatial Design · Visual Storytelling</span><span>© 2026</span>
      </footer>
    </main>
  )
}
