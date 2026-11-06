import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects } from '@/lib/projects'
import type { Metadata } from 'next'
import ProjectGallery from '@/components/ProjectGallery'
import ThemeToggle from '@/components/ThemeToggle'
import './project.css'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — Aparna S Binu`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  const hasGallery = Boolean(project.gallery && project.gallery.length > 0)

  return (
    <main className="project-page-shell">
      {/* Minimal header */}
      <header className="project-header">
        <Link href="/" className="project-brand" data-cursor="link">
          APARNA S BINU
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <ThemeToggle />
          <Link href="/work" className="project-back-link" data-cursor="link">
            ← Back to Work
          </Link>
        </div>
      </header>

      {/* Project container */}
      <div className="project-container">
        {/* Eyebrow & Number */}
        <div className="project-meta-eyebrow">
          <span className="project-num-badge">
            {project.number}
          </span>
          <span className="project-cat-badge">
            {project.category}
          </span>
        </div>

        {/* Project Title */}
        <h1 className="project-main-title">
          {project.title}
        </h1>

        {/* Main Cover / Hero Image */}
        <div
          className="project-hero-cover-wrap"
          style={{
            aspectRatio: project.imageAspectRatio || '16 / 9',
          }}
          data-cursor="view"
        >
          <img
            src={project.image}
            alt={project.title}
            className="project-hero-cover-img"
            style={{
              objectPosition: project.imagePosition || 'center',
            }}
          />
          {hasGallery && (
            <div className="project-hero-cover-tag">
              <span>01</span>
              <span>Exterior Render</span>
            </div>
          )}
        </div>

        {/* Project metadata */}
        <div className="project-meta-grid">
          <div>
            <div className="project-meta-col-label">Academic Period</div>
            <div className="project-meta-col-val">{project.semester}</div>
          </div>
          <div>
            <div className="project-meta-col-label">Location</div>
            <div className="project-meta-col-val">{project.location}</div>
          </div>
          <div>
            <div className="project-meta-col-label">Disciplines</div>
            <div className="project-meta-col-val">{project.disciplines.join(', ')}</div>
          </div>
        </div>

        {/* Project Narrative Description */}
        <div className="project-narrative-wrap">
          <p className="project-narrative-text">
            {project.description}
          </p>
        </div>

        {/* Architectural Image Gallery or placeholder */}
        {hasGallery && project.gallery ? (
          <ProjectGallery project={project} items={project.gallery} />
        ) : (
          <div style={{
            padding: '60px 0',
            textAlign: 'center' as const,
            color: 'var(--muted)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            borderTop: '1px solid var(--line)',
          }}>
            Full project documentation coming soon
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '26px 5vw',
        borderTop: '1px solid var(--line)',
        color: 'var(--muted)',
        fontSize: '10px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
      }}>
        <span style={{ color: 'var(--ink)', fontWeight: 700, letterSpacing: '0.16em' }}>
          APARNA S BINU
        </span>
        <span>Architecture · Spatial Design · Visual Storytelling</span>
        <span>© 2026</span>
      </footer>
    </main>
  )
}
