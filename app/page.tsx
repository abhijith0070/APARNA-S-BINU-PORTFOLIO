'use client'

import { useState } from 'react'
import Header from '@/components/Header'

const projects = [
  {
    number: '01',
    title: 'Threshold House',
    category: 'Residential Architecture',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
    alt: 'Warm modern house framed by trees',
  },
  {
    number: '02',
    title: 'A Room for Light',
    category: 'Spatial Study',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
    alt: 'Quiet interior with a sculptural staircase',
  },
  {
    number: '03',
    title: 'Ground / Gathering',
    category: 'Urban + Spatial Design',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
    alt: 'Light-filled communal interior',
  },
  {
    number: '04',
    title: 'Material Notes',
    category: 'Interior Architecture',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    alt: 'Minimal interior with natural materials',
  },
]

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
                <a className="project-row" href="#contact" key={project.number} data-cursor="view" onMouseEnter={() => setActiveProject(project)} onFocus={() => setActiveProject(project)}>
                  <span className="project-number">{project.number}</span>
                  <span className="project-details"><strong>{project.title}</strong><small>{project.category}</small></span>
                  <span className="project-year">{project.year}</span>
                  <span className="project-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <div className="project-preview" aria-live="polite" data-cursor="view">
              <img src={activeProject.image} alt={activeProject.alt} />
              <p>{activeProject.title} <span>{activeProject.number}</span></p>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-rule" aria-labelledby="contact-title">
          <div className="section-marker"><span>03</span><span id="contact-title">Contact</span></div>
          <div className="contact-content">
            <p className="contact-kicker">For collaborations, internships<br />or conversations about space.</p>
            <a className="contact-link" href="mailto:hello@aparnasbinu.com" data-cursor="mail">Let&apos;s talk <span aria-hidden="true">↗</span></a>
            <div className="contact-meta"><span>Based in Kerala, India</span><span>Available for new conversations</span></div>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <span>APARNA S BINU</span><span>Architecture · Spatial Design · Visual Storytelling</span><span>© 2026</span>
      </footer>
    </main>
  )
}
