import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

// Kept out of the center text column (roughly x: -3.5..3.5) and pushed back in z
// so they read as ambient depth in the corners, not shapes crossing the headline.
const SHAPES = [
  { geo: 'icosahedron', args: [0.85, 0], position: [-5.6, 2.2, -4], rotSpeed: [0.04, 0.06, 0], color: '#1e5bbd' },
  { geo: 'torus', args: [0.6, 0.18, 8, 32], position: [5.8, -2.4, -5], rotSpeed: [0.05, -0.03, 0], color: '#00c8e8' },
  { geo: 'octahedron', args: [0.5, 0], position: [5.2, 2.6, -6], rotSpeed: [-0.04, 0.05, 0], color: '#00e5c3' },
  { geo: 'icosahedron', args: [0.4, 0], position: [-5.2, -2.6, -4.5], rotSpeed: [0.06, 0.04, 0], color: '#1e5bbd' },
]

function WireShape({ geo, args, position, rotSpeed, color, enableParallax, pointerRef }) {
  const ref = useRef()
  useFrame(() => {
    const m = ref.current
    if (!m) return
    m.rotation.x += rotSpeed[0] * 0.01
    m.rotation.y += rotSpeed[1] * 0.01
    if (enableParallax) {
      const { x, y } = pointerRef.current
      m.position.x = position[0] + x * 0.2
      m.position.y = position[1] + y * 0.15
    }
  })
  return (
    <mesh ref={ref} position={position}>
      {geo === 'icosahedron' && <icosahedronGeometry args={args} />}
      {geo === 'torus' && <torusGeometry args={args} />}
      {geo === 'octahedron' && <octahedronGeometry args={args} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.18} />
    </mesh>
  )
}

function Scene({ reducedMotion, pointer }) {
  return (
    <>
      <fog attach="fog" args={['#eef3fb', 4, 11]} />
      {SHAPES.map((s, i) => (
        <WireShape key={i} {...s} enableParallax={!reducedMotion} pointerRef={pointer} />
      ))}
    </>
  )
}

export default function WireframeScene() {
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
        <Scene reducedMotion={reducedMotion} pointer={pointer} />
      </Canvas>
    </div>
  )
}
