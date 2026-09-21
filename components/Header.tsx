'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const closeMenu = () => setMenuOpen(false)

  // Automatically close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent background scrolling while mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" onClick={closeMenu} data-cursor="link">
        APARNA S BINU
      </Link>

      <nav
        id="main-navigation"
        className={menuOpen ? 'main-nav is-open' : 'main-nav'}
        aria-label="Main navigation"
      >
        <div className="mobile-nav-meta" aria-hidden="true">
          <span>Index</span>
          <span>01—03</span>
        </div>

        <Link
          href="/#work"
          className={pathname === '/#work' ? 'is-active' : ''}
          onClick={closeMenu}
          data-cursor="link"
        >
          <span className="nav-item-num" aria-hidden="true">01</span>
          <span className="nav-item-text">Work</span>
        </Link>
        <Link
          href="/about"
          className={pathname === '/about' ? 'is-active' : ''}
          aria-current={pathname === '/about' ? 'page' : undefined}
          onClick={closeMenu}
          data-cursor="link"
        >
          <span className="nav-item-num" aria-hidden="true">02</span>
          <span className="nav-item-text">About</span>
        </Link>
        <Link
          href="/contact"
          className={pathname === '/contact' ? 'is-active' : ''}
          aria-current={pathname === '/contact' ? 'page' : undefined}
          onClick={closeMenu}
          data-cursor="link"
        >
          <span className="nav-item-num" aria-hidden="true">03</span>
          <span className="nav-item-text">Contact</span>
        </Link>

        <div className="mobile-nav-footer" aria-hidden="true">
          <span>Architecture · Spatial Design</span>
          <span>Kerala, India</span>
        </div>
      </nav>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setMenuOpen(!menuOpen)}
        data-cursor="link"
      >
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
      </button>
    </header>
  )
}
