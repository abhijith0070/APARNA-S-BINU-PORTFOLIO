'use client'

import React, { useEffect, useRef, useState } from 'react'

type CursorType = 'default' | 'link' | 'view' | 'mail' | 'call' | 'open'

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Only run on fine-pointer (desktop/mouse) devices
    if (typeof window === 'undefined') return
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return

    setMounted(true)
    document.body.classList.add('has-custom-cursor')

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Pointer & Physics State
    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let ringVx = 0
    let ringVy = 0
    let isVisible = false
    let isMouseDown = false
    let currentType: CursorType = 'default'
    let magneticTarget: { x: number; y: number } | null = null
    let rafId: number

    // Spring physics configuration
    const stiffness = prefersReducedMotion ? 1 : 0.18
    const damping = prefersReducedMotion ? 1 : 0.72
    const maxMagneticPull = 16 // Pixels

    const updateCursorState = (type: CursorType) => {
      if (!ringRef.current || !dotRef.current) return

      let scale = 1.0

      switch (type) {
        case 'view':
          scale = 1.5
          break
        case 'link':
          scale = 1.4
          break
        case 'mail':
        case 'call':
        case 'open':
          scale = 1.45
          break
        default:
          scale = 1.0
          break
      }

      const isInteractive = type !== 'default'
      if (isInteractive) {
        ringRef.current.classList.add('is-hover')
        dotRef.current.classList.add('is-hover')
      } else {
        ringRef.current.classList.remove('is-hover')
        dotRef.current.classList.remove('is-hover')
      }

      const clickScale = isMouseDown ? 0.85 : 1.0
      ringRef.current.style.transform = `scale(${scale * clickScale})`
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!isVisible) {
        isVisible = true
        ringX = mouseX
        ringY = mouseY
        if (cursorRef.current) cursorRef.current.style.opacity = '1'
      }

      // Check hovered interactive element
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-cursor], a, button, [role="button"]'
      )

      if (target) {
        const customType = target.getAttribute('data-cursor') as CursorType | null
        const determinedType: CursorType =
          customType ||
          (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button'
            ? 'link'
            : 'default')

        if (determinedType !== currentType) {
          currentType = determinedType
          updateCursorState(currentType)
        }

        // Calculate subtle magnetic attraction toward target center
        if (!prefersReducedMotion) {
          const rect = target.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          let pullX = (centerX - mouseX) * 0.2
          let pullY = (centerY - mouseY) * 0.2

          const dist = Math.hypot(pullX, pullY)
          if (dist > maxMagneticPull && dist > 0) {
            pullX = (pullX / dist) * maxMagneticPull
            pullY = (pullY / dist) * maxMagneticPull
          }
          magneticTarget = { x: mouseX + pullX, y: mouseY + pullY }
        } else {
          magneticTarget = null
        }
      } else {
        if (currentType !== 'default') {
          currentType = 'default'
          updateCursorState('default')
        }
        magneticTarget = null
      }
    }

    const onMouseDown = () => {
      isMouseDown = true
      updateCursorState(currentType)
    }

    const onMouseUp = () => {
      isMouseDown = false
      updateCursorState(currentType)
    }

    const onMouseLeave = () => {
      isVisible = false
      magneticTarget = null
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
    }

    const onMouseEnter = () => {
      isVisible = true
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
    }

    // Animation Loop
    const loop = () => {
      if (isVisible && cursorRef.current) {
        const targetX = magneticTarget ? magneticTarget.x : mouseX
        const targetY = magneticTarget ? magneticTarget.y : mouseY

        if (prefersReducedMotion) {
          ringX = targetX
          ringY = targetY
        } else {
          const forceX = (targetX - ringX) * stiffness - ringVx * damping
          const forceY = (targetY - ringY) * stiffness - ringVy * damping
          ringVx += forceX
          ringVy += forceY
          ringX += ringVx
          ringY += ringVy
        }

        // Both dot and ring move together as one unit,
        // centered on the spring-interpolated position
        cursorRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown, { passive: true })
    window.addEventListener('mouseup', onMouseUp, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      ref={cursorRef}
      id="cursor-container"
      className="cc-cursor-container"
      aria-hidden="true"
    >
      {/* Outer Spring Ring */}
      <div ref={ringRef} className="cc-ring-circle" />
      {/* Inner Dot — centered inside ring via CSS */}
      <div ref={dotRef} className="cc-dot-circle" />
    </div>
  )
}
