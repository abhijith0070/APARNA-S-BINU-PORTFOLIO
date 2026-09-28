'use client'

import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

/* ============================================================
   LOCATION CONFIGURATION
   ============================================================ */
const LOCATION = {
  latitude: 9.245800,
  longitude: 76.818428,
  label: 'KERALA, INDIA',
  mapUrl: 'https://maps.app.goo.gl/g2YgGMNVWXW6HXhz8?g_st=ac',
}

/* ============================================================
   MATHEMATICAL SPHERICAL COORDINATE HELPERS
   ============================================================ */

/**
 * Convert geographic latitude and longitude (in degrees) to a 3D position
 * on a sphere of given radius, matching Three.js SphereGeometry UV mapping.
 */
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

/**
 * Compute the Euler rotations (order XYZ) required so that a given (lat, lng)
 * faces directly toward the camera positioned on the +Z axis.
 */
function getTargetRotation(lat: number, lng: number): { x: number; y: number } {
  // Y rotation: brings the meridian to +Z (facing camera)
  const yRot = Math.PI / 2 - ((lng + 180) * Math.PI) / 180
  // X rotation: tilts the parallel to the equator (center of view)
  const xRot = (lat * Math.PI) / 180
  return { x: xRot, y: yRot }
}

/* ============================================================
   ATMOSPHERIC RIM SHADER
   Subtle pale-blue/warm glow on the limb for depth.
   ============================================================ */

const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
    // Subtle, elegant oceanic atmospheric rim
    gl_FragColor = vec4(0.42, 0.58, 0.78, intensity * 0.32);
  }
`

/* ============================================================
   ARCHITECTURAL LOCATION MARKER
   Attached to the Earth's surface at (9.245800, 76.818428),
   moves with the Earth rotation.
   Minimal terracotta point (#B85C43) + architectural ring.
   ============================================================ */

function LocationMarker({
  position,
  quaternion,
  prominent,
}: {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  prominent: boolean
}) {
  const pulseRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    // Subtle architectural breathing pulse when arrived
    if (pulseRef.current && prominent) {
      const t = state.clock.getElapsedTime() * 2
      const scale = 1 + (Math.sin(t) * 0.5 + 0.5) * 0.45
      pulseRef.current.scale.set(scale, scale, 1)
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial
      if (mat) {
        mat.opacity = (1 - (scale - 1) / 0.45) * 0.6
      }
    }
  })

  return (
    <group position={position} quaternion={quaternion}>
      {/* 1. Small solid terracotta center point (#B85C43) */}
      <mesh position={[0, 0, 0.003]}>
        <circleGeometry args={[0.02, 24]} />
        <meshBasicMaterial color="#B85C43" depthTest={true} />
      </mesh>

      {/* 2. Concentric architectural precision ring */}
      <mesh position={[0, 0, 0.002]}>
        <ringGeometry args={[0.03, 0.038, 32]} />
        <meshBasicMaterial
          color="#B85C43"
          transparent
          opacity={0.85}
          depthTest={true}
        />
      </mesh>

      {/* 3. Hairline architectural crosshair tick marks */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[0.09, 0.0024]} />
        <meshBasicMaterial
          color="#B85C43"
          transparent
          opacity={0.65}
          depthTest={true}
        />
      </mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.09, 0.0024]} />
        <meshBasicMaterial
          color="#B85C43"
          transparent
          opacity={0.65}
          depthTest={true}
        />
      </mesh>

      {/* 4. Prominent breathing pulse ring after arriving */}
      {prominent && (
        <mesh ref={pulseRef} position={[0, 0, 0.001]}>
          <ringGeometry args={[0.038, 0.046, 32]} />
          <meshBasicMaterial
            color="#B85C43"
            transparent
            opacity={0.5}
            depthTest={true}
          />
        </mesh>
      )}
    </group>
  )
}

/* ============================================================
   EARTH 3D OBJECT & ANIMATION CONTROLLER
   ============================================================ */

type AnimationPhase = 'idle' | 'rotating' | 'arrived'

function Earth({
  onAnimationPhase,
  reducedMotion,
}: {
  onAnimationPhase: (phase: AnimationPhase) => void
  reducedMotion: boolean
}) {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Track animation state in refs for zero React state updates in render loop
  const phaseRef = useRef<AnimationPhase>('idle')
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const animTime = useRef(0)
  const startRotationY = useRef(0)
  const finalRotationY = useRef(0)
  const clicked = useRef(false)

  // Mathematically computed target orientation for (9.245800, 76.818428)
  const targetRotation = useMemo(
    () => getTargetRotation(LOCATION.latitude, LOCATION.longitude),
    []
  )

  // 3D position of the marker on the sphere surface (radius = 1.010, just above clouds)
  const markerPos = useMemo(
    () => latLngToVector3(LOCATION.latitude, LOCATION.longitude, 1.010),
    []
  )

  // Surface normal quaternion aligning marker tangent to the sphere
  const markerQuat = useMemo(() => {
    const normal = markerPos.clone().normalize()
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
  }, [markerPos])

  // Load realistic 2K Earth & Cloud textures
  const [earthTexture, cloudsTexture] = useMemo(() => {
    if (typeof window === 'undefined') return [null, null]
    const loader = new THREE.TextureLoader()
    const earth = loader.load('/textures/earth.jpg')
    earth.colorSpace = THREE.SRGBColorSpace
    const clouds = loader.load('/textures/clouds.png')
    return [earth, clouds]
  }, [])

  // Click handler to trigger cinematic transition
  const handleClick = useCallback(() => {
    if (clicked.current) return
    clicked.current = true

    if (reducedMotion) {
      if (groupRef.current) {
        groupRef.current.rotation.x = targetRotation.x
        groupRef.current.rotation.y = targetRotation.y
      }
      camera.position.set(0, 0, 2.45)
      phaseRef.current = 'arrived'
      setPhase('arrived')
      onAnimationPhase('arrived')
      return
    }

    const currentY = groupRef.current ? groupRef.current.rotation.y : 0
    startRotationY.current = currentY

    // Shortest angular turn to target longitude
    let diff = (targetRotation.y - currentY) % (2 * Math.PI)
    if (diff < -Math.PI) diff += 2 * Math.PI
    if (diff > Math.PI) diff -= 2 * Math.PI
    finalRotationY.current = currentY + diff

    animTime.current = 0
    phaseRef.current = 'rotating'
    setPhase('rotating')
    onAnimationPhase('rotating')
  }, [reducedMotion, targetRotation, camera, onAnimationPhase])

  // Frame-by-frame animation: 100% frame-rate independent, zero React state re-renders
  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Cap delta to prevent tab-switch jumps
    const clampedDelta = Math.min(delta, 0.1)

    // 1. Idle state: fluid, frame-rate independent continuous rotation
    if (phaseRef.current === 'idle') {
      groupRef.current.rotation.y += clampedDelta * 0.05
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += clampedDelta * 0.065
      }
      return
    }

    // 2. Cinematic transition toward target (3.5s duration)
    if (phaseRef.current === 'rotating') {
      animTime.current += clampedDelta
      const t = animTime.current

      // Smooth cubic ease-out for natural deceleration
      const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

      // Orient Earth to target (0 to 2.4s)
      const rotP = easeOutCubic(Math.min(t / 2.4, 1))
      groupRef.current.rotation.y =
        startRotationY.current + (finalRotationY.current - startRotationY.current) * rotP
      groupRef.current.rotation.x = targetRotation.x * rotP

      // Smooth camera travel toward marker (0.8s to 3.2s)
      if (t > 0.8) {
        const zoomP = easeOutCubic(Math.min((t - 0.8) / 2.4, 1))
        const startZ = 4.0
        const endZ = 2.45
        camera.position.z = startZ + (endZ - startZ) * zoomP
      }

      // Clouds continue slow drift
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += clampedDelta * 0.02
      }

      // Settled state (3.2s) — single state update to reveal HTML label
      if (t >= 3.2) {
        phaseRef.current = 'arrived'
        setPhase('arrived')
        onAnimationPhase('arrived')
      }
    }

    // 3. Arrived state: subtle micro-rotation keeps the 3D scene organic and alive
    if (phaseRef.current === 'arrived') {
      groupRef.current.rotation.y += clampedDelta * 0.002
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += clampedDelta * 0.003
      }
    }
  })

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* 1. Realistic Earth sphere with muted, editorial finish */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.84}
          metalness={0.02}
          color="#f4f1ec" /* Soft warm multiplier to keep colors elegant and architectural */
        />
      </Sphere>

      {/* 2. Subtle drifting atmospheric cloud layer */}
      {cloudsTexture && (
        <Sphere ref={cloudsRef} args={[1.005, 64, 64]}>
          <meshStandardMaterial
            alphaMap={cloudsTexture}
            transparent={true}
            opacity={0.32}
            depthWrite={false}
          />
        </Sphere>
      )}

      {/* 3. Subtle pale-blue limb atmosphere rim */}
      <Sphere args={[1.012, 64, 64]}>
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      {/* 4. Location marker physically attached to the Earth's surface */}
      <LocationMarker
        position={markerPos}
        quaternion={markerQuat}
        prominent={phase === 'arrived'}
      />
    </group>
  )
}

/* ============================================================
   LIGHTING & SCENE
   Cinematic day/night shading with soft directional key light
   ============================================================ */

function Scene({
  onAnimationPhase,
  reducedMotion,
}: {
  onAnimationPhase: (phase: AnimationPhase) => void
  reducedMotion: boolean
}) {
  return (
    <>
      {/* Subtle ambient light preserves shadow-side detail without flattening */}
      <ambientLight intensity={0.42} color="#f0ece6" />

      {/* Soft directional sun light creates natural day/night spherical form */}
      <directionalLight position={[-3.2, 2.2, 3.2]} intensity={1.45} color="#fffcf7" />

      {/* Very subtle rim fill from opposing side */}
      <directionalLight position={[3.0, -1.5, -2.0]} intensity={0.25} color="#9ec5e8" />

      <Earth onAnimationPhase={onAnimationPhase} reducedMotion={reducedMotion} />
    </>
  )
}

/* ============================================================
   MAIN EXPORT: LocationGlobe
   ============================================================ */

export default function LocationGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // IntersectionObserver for visibility-based rendering
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Device pixel ratio cap for smooth performance
  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1
    return Math.min(window.devicePixelRatio, 1.5)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`location-globe-wrapper ${phase !== 'idle' ? 'is-arrived' : ''}`}
    >
      <div
        className={`location-globe-container ${hovered ? 'is-hovered' : ''} ${phase !== 'idle' ? 'is-animating' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-cursor="view"
        role="button"
        tabIndex={0}
        aria-label={`Interactive 3D globe showing location: ${LOCATION.label}. Click to explore.`}
      >
        {isVisible && (
          <Canvas
            dpr={dpr}
            camera={{ position: [0, 0, 4.0], fov: 32 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            style={{ background: 'transparent' }}
            frameloop={isVisible ? 'always' : 'demand'}
          >
            <Scene onAnimationPhase={setPhase} reducedMotion={reducedMotion} />
          </Canvas>
        )}

        {/* Subtle idle interaction hint */}
        {phase === 'idle' && (
          <div className="globe-hint">
            <span>CLICK TO EXPLORE</span>
          </div>
        )}
      </div>

      {/* Editorial location label & direct map link */}
      {phase === 'arrived' && (
        <div className="globe-location-label is-visible">
          <span className="globe-location-name">{LOCATION.label}</span>
          <span className="globe-location-coords">
            {Math.abs(LOCATION.latitude).toFixed(4)}° {LOCATION.latitude >= 0 ? 'N' : 'S'}
            {' · '}
            {Math.abs(LOCATION.longitude).toFixed(4)}° {LOCATION.longitude >= 0 ? 'E' : 'W'}
          </span>
          <a
            href={LOCATION.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="globe-open-location"
            onClick={(e) => e.stopPropagation()}
          >
            OPEN LOCATION ↗
          </a>
        </div>
      )}
    </div>
  )
}
