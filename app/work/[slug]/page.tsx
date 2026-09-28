import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects } from '@/lib/projects'
import type { Metadata } from 'next'

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

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      color: 'var(--ink)',
    }}>
      {/* Minimal header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '72px',
        padding: '0 5vw',
        borderBottom: '1px solid var(--line)',
      }}>
        <Link href="/" style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textDecoration: 'none',
          color: 'var(--ink)',
        }}>
          APARNA S BINU
        </Link>
        <Link href="/work" style={{
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          textDecoration: 'none',
          color: 'var(--muted)',
        }}>
          ← Back to Work
        </Link>
      </header>

      {/* Project hero */}
      <div style={{
        width: 'min(1320px, 90vw)',
        margin: '0 auto',
        padding: '80px 0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '16px',
          marginBottom: '16px',
        }}>
          <span style={{
            fontFamily: "'CalistoMT', Georgia, serif",
            fontSize: '13px',
            color: 'var(--terracotta)',
            letterSpacing: '0.06em',
          }}>
            {project.number}
          </span>
          <span style={{
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'var(--muted)',
          }}>
            {project.category}
          </span>
        </div>

        <h1 style={{
          fontFamily: "'CalistoMT', Georgia, serif",
          fontSize: 'clamp(40px, 7vw, 88px)',
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: '0 0 40px',
        }}>
          {project.title}
        </h1>

        {/* Hero image */}
        <div style={{
          width: '100%',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          background: '#f0efe9',
        }}>
          <img
            src={project.image}
            alt={project.title}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'saturate(0.88)',
            }}
          />
        </div>

        {/* Project metadata */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '32px',
          padding: '48px 0',
          borderBottom: '1px solid var(--line)',
        }}>
          <div>
            <div style={{
              fontSize: '9px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: 'var(--muted)',
              marginBottom: '6px',
            }}>Year</div>
            <div style={{ fontSize: '14px' }}>{project.year}</div>
          </div>
          <div>
            <div style={{
              fontSize: '9px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: 'var(--muted)',
              marginBottom: '6px',
            }}>Location</div>
            <div style={{ fontSize: '14px' }}>{project.location}</div>
          </div>
          <div>
            <div style={{
              fontSize: '9px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: 'var(--muted)',
              marginBottom: '6px',
            }}>Disciplines</div>
            <div style={{ fontSize: '14px' }}>{project.disciplines.join(', ')}</div>
          </div>
        </div>

        {/* Description */}
        <p style={{
          maxWidth: '640px',
          fontSize: '16px',
          lineHeight: 1.7,
          color: 'var(--ink)',
          padding: '48px 0',
        }}>
          {project.description}
        </p>

        {/* Placeholder for full project content */}
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
