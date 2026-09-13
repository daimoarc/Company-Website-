import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

const ORB_COLORS = ['#00c8e8', '#1e5bbd', '#00e5c3']

function randomOrbs(count) {
  const orbs = []
  for (let i = 0; i < count; i++) {
    orbs.push({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
      ],
      radius: 0.15 + Math.random() * 0.55,
      color: ORB_COLORS[i % ORB_COLORS.length],
      speed: 0.5 + Math.random() * 0.8,
    })
  }
  return orbs
}

function Orb({ position, radius, color, speed, animate }) {
  const mesh = (
    <mesh position={position}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        roughness={0.25}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
  if (!animate) return mesh
  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={1.1}>
      {mesh}
    </Float>
  )
}

function OrbField({ orbs, animate, pointerRef, enableParallax }) {
  const group = useRef()
  useFrame(() => {
    if (!group.current || !enableParallax) return
    const { x, y } = pointerRef.current
    group.current.rotation.y += (x * 0.15 - group.current.rotation.y) * 0.03
    group.current.rotation.x += (y * 0.1 - group.current.rotation.x) * 0.03
  })
  return (
    <group ref={group}>
      {orbs.map((orb) => (
        <Orb key={orb.id} {...orb} animate={animate} />
      ))}
    </group>
  )
}

export default function Scene3D() {
  const orbs = useMemo(() => randomOrbs(36), [])
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(true)
  const pointer = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        frameloop={visible ? 'always' : 'never'}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#00c8e8" />
        <OrbField
          orbs={orbs}
          animate={!reducedMotion}
          pointerRef={pointer}
          enableParallax={!reducedMotion}
        />
      </Canvas>
    </div>
  )
}
