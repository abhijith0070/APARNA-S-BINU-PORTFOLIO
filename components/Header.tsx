'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" onClick={closeMenu} data-cursor="link">
        APARNA S BINU
      </Link>
      <nav
        className={menuOpen ? 'main-nav is-open' : 'main-nav'}
        aria-label="Main navigation"
      >
        <Link
          href="/#work"
          className={pathname === '/work' ? 'is-active' : ''}
          aria-current={pathname === '/work' ? 'page' : undefined}
          onClick={closeMenu}
          data-cursor="link"
        >
          Work
        </Link>
        <Link
          href="/about"
          className={pathname === '/about' ? 'is-active' : ''}
          aria-current={pathname === '/about' ? 'page' : undefined}
          onClick={closeMenu}
          data-cursor="link"
        >
          About
        </Link>
        <Link
          href="/contact"
          className={pathname === '/contact' ? 'is-active' : ''}
          aria-current={pathname === '/contact' ? 'page' : undefined}
          onClick={closeMenu}
          data-cursor="link"
        >
          Contact
        </Link>
      </nav>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
        data-cursor="link"
      >
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
      </button>
    </header>
  )
}
