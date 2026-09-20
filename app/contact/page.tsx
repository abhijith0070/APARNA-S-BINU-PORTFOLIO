'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import './contact.css'

/* ─── Inline SVG brand icons (Lucide doesn't include brand logos) ─── */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

/* ─── Contact data ─── */

const directContacts = [
  {
    num: '01',
    type: 'Phone',
    value: '+91 8075368575',
    href: 'tel:+918075368575',
    cursor: 'call',
    icon: <Phone size={16} />,
  },
  {
    num: '02',
    type: 'Email',
    value: 'aiswarya4318@gmail.com',
    href: 'mailto:aiswarya4318@gmail.com',
    cursor: 'mail',
    icon: <Mail size={16} />,
  },
]

const socialLinks = [
  {
    num: '03',
    name: 'Instagram',
    handle: '@aparna.s.binu',
    href: '#',
    available: false,
    cursor: 'open',
    icon: InstagramIcon,
  },
  {
    num: '04',
    name: 'Facebook',
    handle: 'Aparna S Binu',
    href: '#',
    available: false,
    cursor: 'open',
    icon: FacebookIcon,
  },
  {
    num: '05',
    name: 'LinkedIn',
    handle: 'aparna-s-binu',
    href: '#',
    available: false,
    cursor: 'open',
    icon: LinkedinIcon,
  },
]

export default function ContactPage() {
  /* Scroll-reveal observer */
  useEffect(() => {
    const targets = document.querySelectorAll('.ct-reveal')
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

      <div className="page-shell ct-page">
        {/* ════════════════════════════════════════════
            HERO — Typographic Opening
            ════════════════════════════════════════════ */}
        <section className="ct-hero ct-reveal" aria-labelledby="ct-hero-title">
          <div className="ct-hero-left">
            <p className="ct-eyebrow">Contact / Collaboration</p>
            <h1 id="ct-hero-title" className="ct-headline">
              Let&apos;s
              <br />
              <em>talk.</em>
            </h1>
          </div>
          <div className="ct-hero-right">
            <p className="ct-hero-description">
              For collaborations, studio internships, project inquiries, or conversations about spatial design and architecture.
            </p>
            <p className="ct-hero-location">
              <MapPin size={12} aria-hidden="true" />
              <span>Based in Kerala, India — Open to conversations worldwide</span>
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            DIRECT CONTACT — Architectural Index
            ════════════════════════════════════════════ */}
        <section className="ct-index-section ct-reveal ct-reveal-d1" aria-label="Direct contact information">
          {directContacts.map((item) => (
            <a
              key={item.num}
              className="ct-row"
              href={item.href}
              data-cursor={item.cursor}
              aria-label={`${item.type}: ${item.value}`}
            >
              <span className="ct-row-num">{item.num}</span>
              <span className="ct-row-type">{item.type}</span>
              <span className="ct-row-value">{item.value}</span>
              <span className="ct-row-arrow" aria-hidden="true">
                <ArrowUpRight size={18} />
              </span>
            </a>
          ))}
        </section>

        {/* ════════════════════════════════════════════
            SOCIAL — Three-Column Editorial Grid
            ════════════════════════════════════════════ */}
        <section className="ct-social-section ct-reveal ct-reveal-d2" aria-label="Social profiles">
          <div className="ct-social-grid">
            {socialLinks.map((social) => {
              const IconComponent = social.icon
              return (
                <a
                  key={social.num}
                  className="ct-social-card"
                  href={social.available ? social.href : undefined}
                  target={social.available ? '_blank' : undefined}
                  rel={social.available ? 'noopener noreferrer' : undefined}
                  data-cursor={social.cursor}
                  aria-label={social.available ? `Visit ${social.name} profile` : `${social.name} — coming soon`}
                  onClick={social.available ? undefined : (e) => e.preventDefault()}
                  style={social.available ? undefined : { opacity: 0.7 }}
                >
                  <div className="ct-social-card-top">
                    <IconComponent className="ct-social-icon" />
                    <span className="ct-social-num">{social.num}</span>
                  </div>
                  <span className="ct-social-name">{social.name}</span>
                  <span className="ct-social-handle">
                    {social.available ? social.handle : 'Coming soon'}
                  </span>
                  {social.available && (
                    <ArrowUpRight size={16} className="ct-social-arrow" aria-hidden="true" />
                  )}
                </a>
              )
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            VISUAL ANCHOR — Architectural Composition
            ════════════════════════════════════════════ */}
        <section className="ct-visual-section ct-reveal ct-reveal-d3" aria-label="About Aparna">
          <div className="ct-visual-composition">
            <div className="ct-visual-text">
              <p className="ct-visual-large-num" aria-hidden="true">05</p>
              <p className="ct-visual-quote">
                Every conversation is a <em>threshold</em> —<br />
                a doorway into something new.
              </p>
              <p className="ct-visual-subtext">
                Currently pursuing B.Arch at DC School of Architecture and Design, Vagamon.
                Available for internships, academic collaborations, and independent design projects.
              </p>
            </div>
            <div className="ct-visual-meta">
              <div className="ct-meta-block">
                <span className="ct-meta-label">Discipline</span>
                <span className="ct-meta-value">Architecture &amp; Spatial Design</span>
              </div>
              <div className="ct-meta-block">
                <span className="ct-meta-label">Year</span>
                <span className="ct-meta-value">Fourth Year (04—26)</span>
              </div>
              <div className="ct-meta-block">
                <span className="ct-meta-label">Availability</span>
                <span className="ct-meta-value">Open for conversations</span>
              </div>
              <div className="ct-meta-terracotta-accent" aria-hidden="true" />
            </div>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <span>APARNA S BINU</span>
        <span>Architecture · Spatial Design · Visual Storytelling</span>
        <span>© 2026</span>
      </footer>
    </main>
  )
}
