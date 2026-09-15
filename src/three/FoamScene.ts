import * as THREE from 'three'
import { loadFoamMaps, tuneMaps, type FoamMaps } from './foamMaterial'

export interface FoamSceneOptions {
  container: HTMLElement
  /** blok rangi (oq / qora grafit) */
  color?: string
  /** blok nisbatlari: en x qalinlik x bo'y (dunyo birligi) */
  dims?: [number, number, number]
  autoRotate?: boolean
  quality?: 'high' | 'low'
  onReady?: () => void
}

/** Chetlari yumaloqlangan quti geometriyasi (real kesilgan penaplast qirralari). */
function roundedBox(w: number, h: number, d: number, r: number, seg: number) {
  const geo = new THREE.BoxGeometry(w, h, d, seg, seg, seg)
  const pos = geo.attributes.position as THREE.BufferAttribute
  const hw = w / 2 - r
  const hh = h / 2 - r
  const hd = d / 2 - r
  const v = new THREE.Vector3()
  const c = new THREE.Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    c.set(
      THREE.MathUtils.clamp(v.x, -hw, hw),
      THREE.MathUtils.clamp(v.y, -hh, hh),
      THREE.MathUtils.clamp(v.z, -hd, hd),
    )
    const dir = v.clone().sub(c)
    const len = dir.length()
    if (len > 1e-6) {
      dir.multiplyScalar(r / len)
      v.copy(c).add(dir)
      pos.setXYZ(i, v.x, v.y, v.z)
    }
  }
  geo.computeVertexNormals()
  return geo
}

/** Yuzadagi granulalarni ko'rsatuvchi instansiyalangan sharchalar (siluetni real qiladi). */
function buildBeadLayer(
  w: number,
  h: number,
  d: number,
  count: number,
  color: THREE.Color,
  maps: FoamMaps,
) {
  const geo = new THREE.IcosahedronGeometry(1, 1)
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.82,
    metalness: 0,
    normalMap: maps.normal,
    normalScale: new THREE.Vector2(0.4, 0.4),
    flatShading: true,
  })
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  mesh.castShadow = true

  const dummy = new THREE.Object3D()
  const faces: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [
    // normal, tangent u, tangent v (yarim o'lchamlar bilan)
    [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, h / 2, 0), new THREE.Vector3(0, 0, d / 2)],
    [new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, h / 2, 0), new THREE.Vector3(0, 0, d / 2)],
    [new THREE.Vector3(0, 1, 0), new THREE.Vector3(w / 2, 0, 0), new THREE.Vector3(0, 0, d / 2)],
    [new THREE.Vector3(0, -1, 0), new THREE.Vector3(w / 2, 0, 0), new THREE.Vector3(0, 0, d / 2)],
    [new THREE.Vector3(0, 0, 1), new THREE.Vector3(w / 2, 0, 0), new THREE.Vector3(0, h / 2, 0)],
    [new THREE.Vector3(0, 0, -1), new THREE.Vector3(w / 2, 0, 0), new THREE.Vector3(0, h / 2, 0)],
  ]
  const half = new THREE.Vector3(w / 2, h / 2, d / 2)
  const areas = faces.map(([n]) => {
    if (n.x) return h * d
    if (n.y) return w * d
    return w * h
  })
  const total = areas.reduce((a, b) => a + b, 0)

  let i = 0
  for (let f = 0; f < faces.length && i < count; f++) {
    const [n, tu, tv] = faces[f]
    const share = Math.round((areas[f] / total) * count)
    for (let k = 0; k < share && i < count; k++, i++) {
      const u = Math.random() * 2 - 1
      const v = Math.random() * 2 - 1
      const p = new THREE.Vector3()
        .addScaledVector(tu, u)
        .addScaledVector(tv, v)
        .addScaledVector(n, 1)
      // yuzaga joylash: normal yo'nalishida yarim o'lchamga
      p.x += n.x * (half.x - 1)
      p.y += n.y * (half.y - 1)
      p.z += n.z * (half.z - 1)

      const s = 0.012 + Math.random() * 0.016
      dummy.position.copy(p).addScaledVector(n, -s * 0.35)
      dummy.scale.setScalar(s)
      dummy.rotation.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
  }
  mesh.count = i
  mesh.instanceMatrix.needsUpdate = true
  return mesh
}

/** Studiya muhiti — realistik yumshoq aks etishlar uchun. */
function studioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const scene = new THREE.Scene()

  const addPanel = (
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    intensity: number,
    color = 0xffffff,
  ) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) }),
    )
    m.position.set(x, y, z)
    m.lookAt(0, 0, 0)
    scene.add(m)
  }

  scene.background = new THREE.Color(0x0b0d12)
  addPanel(-3, 3.2, 3, 7, 5, 3.6) // asosiy softbox
  addPanel(4, 1.4, -2.4, 5, 4, 1.1, 0xbcd8ff) // ko'k rim
  addPanel(0, -3.6, 0.6, 8, 6, 0.4) // pastdan yumshoq to'ldirish
  addPanel(-1, 0.6, -5, 6, 4, 0.7, 0xdfe9ff)

  const env = pmrem.fromScene(scene, 0.04).texture
  pmrem.dispose()
  scene.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.geometry) m.geometry.dispose()
  })
  return env
}

export class FoamScene {
  readonly renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private group = new THREE.Group()
  private container: HTMLElement
  private raf = 0
  private disposed = false
  private ro: ResizeObserver
  private reduced: boolean

  // orbit state
  private targetAz = -0.52
  private targetEl = 0.28
  private az = -0.52
  private el = 0.28
  private targetDist: number
  private dist: number
  private minDist: number
  private maxDist: number
  private dragging = false
  private lastX = 0
  private lastY = 0
  private pointers = new Map<number, { x: number; y: number }>()
  private pinchStart = 0
  private pinchDist = 0
  private idle = 0

  autoRotate: boolean
  private dims: [number, number, number]
  private onReadyCb?: () => void

  constructor(opts: FoamSceneOptions) {
    this.container = opts.container
    this.dims = opts.dims ?? [2.2, 0.62, 1.4]
    this.autoRotate = opts.autoRotate ?? true
    this.onReadyCb = opts.onReady
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const quality = opts.quality ?? 'high'
    const dpr = Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.5)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.08
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.shadowMap.enabled = quality === 'high'
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.renderer.domElement.style.display = 'block'
    this.renderer.domElement.style.touchAction = 'pan-y'
    this.renderer.domElement.style.cursor = 'grab'
    this.container.appendChild(this.renderer.domElement)

    const aspect = this.container.clientWidth / Math.max(this.container.clientHeight, 1)
    this.camera = new THREE.PerspectiveCamera(34, aspect, 0.05, 100)

    const baseDist = 5.4
    this.dist = this.targetDist = baseDist
    this.minDist = 1.35
    this.maxDist = 9

    this.scene.add(this.group)
    this.setupLights(quality)
    this.build(opts.color ?? '#f4f5f7', quality)

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(this.container)

    this.bindEvents()
    this.loop()
  }

  private setupLights(quality: 'high' | 'low') {
    this.scene.environment = studioEnvironment(this.renderer)
    this.scene.environmentIntensity = 0.85

    const key = new THREE.DirectionalLight(0xffffff, 2.5)
    key.position.set(-3.4, 4.6, 3.6)
    if (quality === 'high') {
      key.castShadow = true
      key.shadow.mapSize.set(1024, 1024)
      key.shadow.camera.near = 0.5
      key.shadow.camera.far = 18
      const s = 4
      key.shadow.camera.left = -s
      key.shadow.camera.right = s
      key.shadow.camera.top = s
      key.shadow.camera.bottom = -s
      key.shadow.bias = -0.0012
      key.shadow.normalBias = 0.02
      key.shadow.radius = 4
    }
    this.scene.add(key)

    const rim = new THREE.DirectionalLight(0x9ccaff, 1.7)
    rim.position.set(4.2, 1.2, -3.4)
    this.scene.add(rim)

    const fill = new THREE.DirectionalLight(0xffffff, 0.5)
    fill.position.set(2.2, -2.4, 2.6)
    this.scene.add(fill)

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.22))
  }

  private async build(color: string, quality: 'high' | 'low') {
    const [w, h, d] = this.dims
    const maps = await loadFoamMaps().catch(() => null)
    if (this.disposed) return

    const seg = quality === 'high' ? 34 : 18
    const geo = roundedBox(w, h, d, 0.028, seg)

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.94,
      metalness: 0,
      sheen: 0.28,
      sheenRoughness: 0.9,
      sheenColor: new THREE.Color(0xffffff),
      clearcoat: 0.06,
      clearcoatRoughness: 0.9,
      envMapIntensity: 0.6,
    })

    if (maps) {
      const repeat = new THREE.Vector2(5.2, 5.2)
      tuneMaps(maps, repeat, this.renderer.capabilities.getMaxAnisotropy())
      mat.map = maps.color
      mat.normalMap = maps.normal
      mat.normalScale = new THREE.Vector2(1.5, 1.5)
      mat.roughnessMap = maps.roughness
      mat.bumpMap = maps.color
      mat.bumpScale = 0.012
      // Qora penaplast uchun teksturani qoraytirish
      mat.color = new THREE.Color(color)
      mat.needsUpdate = true
    }

    const block = new THREE.Mesh(geo, mat)
    block.castShadow = true
    block.receiveShadow = true
    this.group.add(block)

    if (maps && quality === 'high') {
      const beads = buildBeadLayer(w, h, d, 2600, new THREE.Color(color), maps)
      this.group.add(beads)
    }

    // Kontakt soyasi
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.ShadowMaterial({ opacity: 0.4 }),
    )
    shadowPlane.rotation.x = -Math.PI / 2
    shadowPlane.position.y = -h / 2 - 0.42
    shadowPlane.receiveShadow = true
    this.scene.add(shadowPlane)

    this.onReadyCb?.()
  }

  private bindEvents() {
    const el = this.renderer.domElement

    const down = (e: PointerEvent) => {
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (this.pointers.size === 1) {
        this.dragging = true
        this.lastX = e.clientX
        this.lastY = e.clientY
        el.style.cursor = 'grabbing'
        el.setPointerCapture(e.pointerId)
      } else if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()]
        this.pinchStart = Math.hypot(a.x - b.x, a.y - b.y)
        this.pinchDist = this.targetDist
      }
      this.idle = 0
    }

    const move = (e: PointerEvent) => {
      if (!this.pointers.has(e.pointerId)) return
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()]
        const dNow = Math.hypot(a.x - b.x, a.y - b.y)
        if (this.pinchStart > 0) {
          this.targetDist = THREE.MathUtils.clamp(
            this.pinchDist * (this.pinchStart / Math.max(dNow, 1)),
            this.minDist,
            this.maxDist,
          )
        }
        return
      }

      if (!this.dragging) return
      const dx = e.clientX - this.lastX
      const dy = e.clientY - this.lastY
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.targetAz -= dx * 0.0072
      this.targetEl = THREE.MathUtils.clamp(this.targetEl - dy * 0.0062, -1.15, 1.25)
      this.idle = 0
    }

    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId)
      if (this.pointers.size < 2) this.pinchStart = 0
      if (this.pointers.size === 0) {
        this.dragging = false
        el.style.cursor = 'grab'
      }
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('pointerleave', up)

    el.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        e.preventDefault()
        this.targetDist = THREE.MathUtils.clamp(
          this.targetDist * (1 + Math.sign(e.deltaY) * 0.1),
          this.minDist,
          this.maxDist,
        )
        this.idle = 0
      },
      { passive: false },
    )

    this.cleanupFns.push(() => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('pointerleave', up)
    })
  }

  private cleanupFns: (() => void)[] = []

  zoom(factor: number) {
    this.targetDist = THREE.MathUtils.clamp(this.targetDist * factor, this.minDist, this.maxDist)
    this.idle = 0
  }

  reset() {
    this.targetAz = -0.52
    this.targetEl = 0.28
    this.targetDist = 5.4
    this.idle = 0
  }

  get zoomPercent() {
    return Math.round(
      ((this.maxDist - this.dist) / (this.maxDist - this.minDist)) * 100,
    )
  }

  private resize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    // Kichik ekranlarda kadrga sig'ishi uchun
    this.camera.fov = w < 640 ? 42 : 34
    this.camera.updateProjectionMatrix()
  }

  private loop = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)

    if (this.autoRotate && !this.dragging && !this.reduced) {
      this.idle += 1
      if (this.idle > 90) this.targetAz -= 0.0022
    }

    // yumshoq damping
    this.az += (this.targetAz - this.az) * 0.085
    this.el += (this.targetEl - this.el) * 0.085
    this.dist += (this.targetDist - this.dist) * 0.09

    const ce = Math.cos(this.el)
    this.camera.position.set(
      Math.sin(this.az) * ce * this.dist,
      Math.sin(this.el) * this.dist,
      Math.cos(this.az) * ce * this.dist,
    )
    this.camera.lookAt(0, 0, 0)

    // yengil suzish effekti
    if (!this.reduced) {
      const t = performance.now() * 0.00042
      this.group.position.y = Math.sin(t) * 0.035
      this.group.rotation.z = Math.sin(t * 0.72) * 0.012
    }

    this.renderer.render(this.scene, this.camera)
  }

  setColor(color: string) {
    this.group.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.material) {
        const mat = m.material as THREE.MeshStandardMaterial
        if (mat.color) mat.color.set(color)
      }
    })
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.cleanupFns.forEach((f) => f())
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.geometry) m.geometry.dispose()
      const mat = m.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
      else mat?.dispose()
    })
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
