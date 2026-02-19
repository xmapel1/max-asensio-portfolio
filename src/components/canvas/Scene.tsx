import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'

function Scene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    mount.appendChild(renderer.domElement)

    // Scene + Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.z = 5

    // Noise
    const noise3D = createNoise3D()

    // Line settings
    const LINES = 60
    const POINTS_PER_LINE = 100
    const SPREAD = 8

    const lineMeshes: THREE.Line[] = []

    for (let i = 0; i < LINES; i++) {
      const points: THREE.Vector3[] = []

      for (let j = 0; j < POINTS_PER_LINE; j++) {
        points.push(new THREE.Vector3(0, 0, 0))
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
      })

      const line = new THREE.Line(geometry, material)
      scene.add(line)
      lineMeshes.push(line)
    }

    // Animate
    let animId: number
    let t = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.0008

      lineMeshes.forEach((line, i) => {
        const positions = line.geometry.attributes.position
        const offsetX = (i / LINES - 0.5) * SPREAD
        const offsetY = (i / LINES - 0.5) * SPREAD * 0.5

        for (let j = 0; j < POINTS_PER_LINE; j++) {
          const x = offsetX + noise3D(i * 0.3, j * 0.05, t) * 2
          const y = offsetY + noise3D(i * 0.3 + 10, j * 0.05 + 10, t) * 2
          const z = noise3D(i * 0.3 + 20, j * 0.05 + 20, t) * 0.5

          positions.setXYZ(j, x, y, z)
        }

        positions.needsUpdate = true
      })

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default Scene
