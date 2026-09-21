'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import './about.css'

export default function AboutPage() {
  /* Scroll-reveal: observe .cv-reveal elements and add .is-visible */
  useEffect(() => {
    const targets = document.querySelectorAll('.cv-reveal')
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <Header />

      <div className="page-shell cv-page-container">
        <div className="cv-grid-layout">
          {/* ================================================
              LEFT COLUMN
              About, Education, Experiences, Workshops, Achievements
              ================================================ */}
          <div className="cv-col-primary">
            {/* ABOUT / INTRODUCTION */}
            <section className="cv-intro-block cv-reveal" aria-labelledby="cv-name">
              <p className="eyebrow">About</p>
              <div className="cv-intro-header">
                <div className="cv-intro-text-wrap">
                  <h1 id="cv-name" className="cv-name">
                    Aparna
                    <br />
                    <em>S Binu</em>
                  </h1>
                  <p className="cv-intro-statement">
                    A fourth-year architecture student drawn to spatial design and visual storytelling — and to the quiet relationships between people and the spaces they inhabit.
                  </p>
                </div>

                {/* Supporting profile image */}
                <div className="cv-portrait-wrap" aria-label="Aparna S Binu portrait">
                  <div className="cv-portrait-frame">
                    {/* Portrait: Replace /placeholder-user.jpg with Aparna's portrait when provided */}
                    <img
                      className="cv-portrait-img"
                      src="/img.jpg"
                      alt="Aparna S Binu"
                    />
                  </div>
                  <p className="cv-portrait-caption"></p>
                </div>
              </div>
            </section>

            {/* 01 — EDUCATION */}
            <section className="cv-section cv-reveal" aria-labelledby="cv-edu-title">
              <div className="cv-section-marker">
                <span className="cv-marker-num">01</span>
                <h2 id="cv-edu-title" className="cv-marker-title">Education</h2>
              </div>
              <div className="cv-timeline-list">
                <div className="cv-timeline-item">
                  <span className="cv-item-date">2023–2028</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">BACHELOR OF ARCHITECTURE</h3>
                    <p className="cv-item-subtitle">DC School of Architecture and Design</p>
                    <p className="cv-item-location">Vagamon</p>
                  </div>
                </div>

                <div className="cv-timeline-item">
                  <span className="cv-item-date">2025–2026</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">NOVATR — BIM Professional Course for Architects</h3>
                  </div>
                </div>

                <div className="cv-timeline-item">
                  <span className="cv-item-date">2021–2023</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">ALPHA GENIUS INTEGRATED SCHOOL</h3>
                    <p className="cv-item-location">Alappuzha</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 02 — EXPERIENCES */}
            <section className="cv-section cv-reveal" aria-labelledby="cv-exp-title">
              <div className="cv-section-marker">
                <span className="cv-marker-num">02</span>
                <h2 id="cv-exp-title" className="cv-marker-title">Experiences</h2>
              </div>
              <div className="cv-timeline-list">
                <div className="cv-timeline-item">
                  <span className="cv-item-date">2024–2026</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">Attended NASA India Trophies</h3>
                    <p className="cv-item-location">(GRIHA, ANDC, WAT, MSL)</p>
                  </div>
                </div>

                <div className="cv-timeline-item">
                  <span className="cv-item-date">2023–2024</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">Volunteered Kerala Literature Festival at Calicut</h3>
                  </div>
                </div>

                <div className="cv-timeline-item">
                  <span className="cv-item-date">2025–2026</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">Volunteered 72hrs Events Team</h3>
                    <p className="cv-item-location">Conducted at DCSAAD</p>
                  </div>
                </div>

                <div className="cv-timeline-item">
                  <span className="cv-item-date">2026</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">Assisted Ar. Shan Samuel for a Beach House Design at Calicut</h3>
                  </div>
                </div>

                <div className="cv-timeline-item">
                  <span className="cv-item-date">2025–PRESENT</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">Content Creator</h3>
                  </div>
                </div>
              </div>
            </section>

            {/* 03 — WORKSHOPS */}
            <section className="cv-section cv-reveal" aria-labelledby="cv-workshops-title">
              <div className="cv-section-marker">
                <span className="cv-marker-num">03</span>
                <h2 id="cv-workshops-title" className="cv-marker-title">Workshops</h2>
              </div>
              <div className="cv-timeline-list">
                <div className="cv-timeline-item">
                  <span className="cv-item-date">2026</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">NASA India Insider Workshop</h3>
                    <p className="cv-item-location">at Monsoon Collective, Kochi</p>
                  </div>
                </div>

                <div className="cv-timeline-item">
                  <span className="cv-item-date">2023</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">Rammed Earth and Clay Modelling Workshop</h3>
                    <p className="cv-item-location">at Urcovisa, Trivandrum</p>
                  </div>
                </div>

                <div className="cv-timeline-item">
                  <span className="cv-item-date">2023</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">Clay Modelling Workshop</h3>
                    <p className="cv-item-location">at DCSAAD</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 04 — ACHIEVEMENTS */}
            <section className="cv-section cv-reveal" aria-labelledby="cv-achieve-title">
              <div className="cv-section-marker">
                <span className="cv-marker-num">04</span>
                <h2 id="cv-achieve-title" className="cv-marker-title">Achievements</h2>
              </div>
              <div className="cv-timeline-list">
                <div className="cv-timeline-item">
                  <span className="cv-item-date">2025–2026</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">68th NASA India YouTube Committee</h3>
                    <p className="cv-item-location">Coordinator</p>
                  </div>
                </div>

                <div className="cv-timeline-item">
                  <span className="cv-item-date">2025–2026</span>
                  <div className="cv-item-body">
                    <h3 className="cv-item-title">First Prize at 30hr Creativcon</h3>
                    <p className="cv-item-location">Conducted by Kalasalingam University</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================================================
              RIGHT COLUMN
              Software Skills, Soft Skills, Languages, Reference, Contact
              ================================================ */}
          <div className="cv-col-secondary">
            {/* 05 — SOFTWARE SKILLS */}
            <section className="cv-section cv-reveal" aria-labelledby="cv-software-title">
              <div className="cv-section-marker">
                <span className="cv-marker-num">05</span>
                <h2 id="cv-software-title" className="cv-marker-title">Software Skills</h2>
              </div>
              <div className="cv-software-grid">
                <div className="cv-software-item">
                  <span className="cv-software-num">01</span>
                  <span className="cv-software-name">Revit</span>
                </div>
                <div className="cv-software-item">
                  <span className="cv-software-num">02</span>
                  <span className="cv-software-name">SketchUp</span>
                </div>
                <div className="cv-software-item">
                  <span className="cv-software-num">03</span>
                  <span className="cv-software-name">Photoshop</span>
                </div>
                <div className="cv-software-item">
                  <span className="cv-software-num">04</span>
                  <span className="cv-software-name">InDesign</span>
                </div>
                <div className="cv-software-item">
                  <span className="cv-software-num">05</span>
                  <span className="cv-software-name">D5</span>
                </div>
                <div className="cv-software-item">
                  <span className="cv-software-num">06</span>
                  <span className="cv-software-name">Enscape</span>
                </div>
                <div className="cv-software-item">
                  <span className="cv-software-num">07</span>
                  <span className="cv-software-name">CAD</span>
                </div>
                <div className="cv-software-item">
                  <span className="cv-software-num">08</span>
                  <span className="cv-software-name">Canva</span>
                </div>
                <div className="cv-software-item">
                  <span className="cv-software-num">09</span>
                  <span className="cv-software-name">DaVinci Resolve</span>
                </div>
              </div>
            </section>

            {/* 06 — SOFT SKILLS */}
            <section className="cv-section cv-reveal" aria-labelledby="cv-soft-title">
              <div className="cv-section-marker">
                <span className="cv-marker-num">06</span>
                <h2 id="cv-soft-title" className="cv-marker-title">Soft Skills</h2>
              </div>
              <div className="cv-softskills-list">
                <div className="cv-softskill-row">
                  <div className="cv-softskill-meta">
                    <span className="cv-softskill-label">Communication</span>
                    <span className="cv-softskill-val">90%</span>
                  </div>
                  <div className="cv-softskill-track" role="progressbar" aria-valuenow={90} aria-valuemin={0} aria-valuemax={100} aria-label="Communication proficiency">
                    <div className="cv-softskill-fill" style={{ width: '90%' }} />
                  </div>
                </div>

                <div className="cv-softskill-row">
                  <div className="cv-softskill-meta">
                    <span className="cv-softskill-label">Teamwork</span>
                    <span className="cv-softskill-val">85%</span>
                  </div>
                  <div className="cv-softskill-track" role="progressbar" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100} aria-label="Teamwork proficiency">
                    <div className="cv-softskill-fill" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="cv-softskill-row">
                  <div className="cv-softskill-meta">
                    <span className="cv-softskill-label">Problem Solving</span>
                    <span className="cv-softskill-val">80%</span>
                  </div>
                  <div className="cv-softskill-track" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} aria-label="Problem Solving proficiency">
                    <div className="cv-softskill-fill" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="cv-softskill-row">
                  <div className="cv-softskill-meta">
                    <span className="cv-softskill-label">Time Management</span>
                    <span className="cv-softskill-val">85%</span>
                  </div>
                  <div className="cv-softskill-track" role="progressbar" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100} aria-label="Time Management proficiency">
                    <div className="cv-softskill-fill" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="cv-softskill-row">
                  <div className="cv-softskill-meta">
                    <span className="cv-softskill-label">Creativity</span>
                    <span className="cv-softskill-val">90%</span>
                  </div>
                  <div className="cv-softskill-track" role="progressbar" aria-valuenow={90} aria-valuemin={0} aria-valuemax={100} aria-label="Creativity proficiency">
                    <div className="cv-softskill-fill" style={{ width: '90%' }} />
                  </div>
                </div>

                <div className="cv-softskill-row">
                  <div className="cv-softskill-meta">
                    <span className="cv-softskill-label">Adaptability</span>
                    <span className="cv-softskill-val">80%</span>
                  </div>
                  <div className="cv-softskill-track" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} aria-label="Adaptability proficiency">
                    <div className="cv-softskill-fill" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            </section>

            {/* 07 — LANGUAGE PROFICIENCY */}
            <section className="cv-section cv-reveal" aria-labelledby="cv-lang-title">
              <div className="cv-section-marker">
                <span className="cv-marker-num">07</span>
                <h2 id="cv-lang-title" className="cv-marker-title">Language Proficiency</h2>
              </div>
              <div className="cv-languages-list">
                <div className="cv-language-row">
                  <span className="cv-language-name">English</span>
                  <span className="cv-language-level">Fluent</span>
                </div>
                <div className="cv-language-row">
                  <span className="cv-language-name">Malayalam</span>
                  <span className="cv-language-level">Fluent</span>
                </div>
                <div className="cv-language-row">
                  <span className="cv-language-name">Hindi</span>
                  <span className="cv-language-level">Fluent</span>
                </div>
                <div className="cv-language-row">
                  <span className="cv-language-name">Tamil</span>
                  <span className="cv-language-level">Conversational</span>
                </div>
              </div>
            </section>



            {/* CONTACT & CV */}
            <div className="cv-contact-block cv-reveal" aria-label="Contact and CV Download">
              <p className="cv-contact-header">Contact</p>
              <div className="cv-contact-details">
                <span className="cv-contact-name">Aparna S Binu</span>
                <a className="cv-contact-link" href="tel:8075368575" data-cursor="call">
                  PH: 8075368575
                </a>
                <a className="cv-contact-link" href="mailto:aiswarya4318@gmail.com" data-cursor="mail">
                  aiswarya4318@gmail.com
                </a>
                <a className="cv-contact-link" href="https://www.instagram.com/vivid_.voyzah?stkn=bHA4czYyb2dkMzEx" target="_blank" rel="noopener noreferrer" data-cursor="open">
                  Instagram ↗
                </a>
                <a className="cv-contact-link" href="https://www.youtube.com/@Vividvoyzah" target="_blank" rel="noopener noreferrer" data-cursor="open">
                  YouTube ↗
                </a>
                <a className="cv-contact-link" href="https://www.linkedin.com/in/aparna-s-binu-03450b2b9" target="_blank" rel="noopener noreferrer" data-cursor="open">
                  LinkedIn ↗
                </a>
              </div>
              <div className="cv-download-action">
                <a className="cv-download-btn" href="#" onClick={(e) => e.preventDefault()} data-cursor="view">
                  View / Download CV <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <span>APARNA S BINU</span>
        <span>Architecture · Spatial Design · Visual Storytelling</span>
        <span>© 2026</span>
      </footer>
    </main>
  )
}
