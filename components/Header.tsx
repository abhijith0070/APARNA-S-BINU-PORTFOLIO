'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function Header({
  theme = 'light',
  className = '',
}: {
  theme?: 'light' | 'dark' | 'auto'
  className?: string
} = {}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [timeData, setTimeData] = useState<{ time: string; date: string } | null>(null)
  const pathname = usePathname()
  const { theme: currentTheme, toggleTheme } = useTheme()
  const closeMenu = () => setMenuOpen(false)

  // Live Digital Clock updating every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      const weekday = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
      const day = String(now.getDate()).padStart(2, '0')
      const month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()

      setTimeData({
        time: `${hh}:${mm}:${ss}`,
        date: `${weekday}, ${day} ${month}`,
      })
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

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
    <header className={`site-header theme-${theme} ${className}`}>
      {/* Left: Brand Name + Live Digital Clock */}
      <div className="header-brand-group">
        <Link className="wordmark" href="/" onClick={closeMenu} data-cursor="link">
          APARNA S BINU
        </Link>
        <span className="header-clock-divider" aria-hidden="true" />
        <div
          className="header-clock"
          aria-label="Current local time"
          suppressHydrationWarning
        >
          {timeData ? (
            <>
              <span className="header-clock-time">{timeData.time}</span>
              <span className="header-clock-sep" aria-hidden="true">·</span>
              <span className="header-clock-date">{timeData.date}</span>
            </>
          ) : (
            <span style={{ opacity: 0 }}>00:00:00 · FRI, 00 MON</span>
          )}
        </div>
      </div>

      {/* Right: Navigation Links + Theme Toggle + Mobile Toggle */}
      <div className="header-right-group">
        <nav
          id="main-navigation"
          className={menuOpen ? 'main-nav is-open' : 'main-nav'}
          aria-label="Main navigation"
        >
          <div className="mobile-nav-meta" aria-hidden="true">
            <span>Index</span>
            <span>01—05</span>
          </div>

          <Link
            href="/"
            className={pathname === '/' ? 'is-active' : ''}
            aria-current={pathname === '/' ? 'page' : undefined}
            onClick={(e) => {
              closeMenu()
              if (pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            data-cursor="link"
          >
            <span className="nav-item-num" aria-hidden="true">01</span>
            <span className="nav-item-text">Home</span>
          </Link>
          <Link
            href="/work"
            className={pathname === '/work' || pathname?.startsWith('/work/') ? 'is-active' : ''}
            aria-current={pathname === '/work' || pathname?.startsWith('/work/') ? 'page' : undefined}
            onClick={closeMenu}
            data-cursor="link"
          >
            <span className="nav-item-num" aria-hidden="true">02</span>
            <span className="nav-item-text">Work</span>
          </Link>
          <Link
            href="/archive"
            className={pathname === '/archive' ? 'is-active' : ''}
            aria-current={pathname === '/archive' ? 'page' : undefined}
            onClick={closeMenu}
            data-cursor="link"
          >
            <span className="nav-item-num" aria-hidden="true">03</span>
            <span className="nav-item-text">Archive</span>
          </Link>
          <Link
            href="/about"
            className={pathname === '/about' ? 'is-active' : ''}
            aria-current={pathname === '/about' ? 'page' : undefined}
            onClick={closeMenu}
            data-cursor="link"
          >
            <span className="nav-item-num" aria-hidden="true">04</span>
            <span className="nav-item-text">About</span>
          </Link>
          <Link
            href="/contact"
            className={pathname === '/contact' ? 'is-active' : ''}
            aria-current={pathname === '/contact' ? 'page' : undefined}
            onClick={closeMenu}
            data-cursor="link"
          >
            <span className="nav-item-num" aria-hidden="true">05</span>
            <span className="nav-item-text">Contact</span>
          </Link>

          <div className="mobile-nav-footer" aria-hidden="true">
            <span>Architecture · Spatial Design</span>
            <span>Kerala, India</span>
          </div>
        </nav>

        {/* Minimal Sun / Moon Theme Toggle */}
        <button
          className="theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          aria-label={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          data-cursor="link"
        >
          {currentTheme === 'dark' ? (
            <Moon className="theme-toggle-icon" size={14} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Sun className="theme-toggle-icon" size={14} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>

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
      </div>
    </header>
  )
}
