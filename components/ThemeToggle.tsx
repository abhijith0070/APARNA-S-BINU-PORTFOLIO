'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className={`theme-toggle-btn ${className}`}
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      data-cursor="link"
    >
      {theme === 'dark' ? (
        <Moon className="theme-toggle-icon" size={14} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Sun className="theme-toggle-icon" size={14} strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  )
}

