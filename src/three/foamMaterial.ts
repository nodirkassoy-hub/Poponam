import * as THREE from 'three'

/**
 * Haqiqiy EPS granula tekstura (foam-texture.jpg) dan normal map hosil qiladi.
 * Bu granulalarning real relyefini beradi — yaqinlashtirilganda har bir shar ko'rinadi.
 */
function buildNormalMap(image: HTMLImageElement, strength = 3.2): THREE.CanvasTexture {
  const size = 1024
  const src = document.createElement('canvas')
  src.width = size
  src.height = size
  const sctx = src.getContext('2d', { willReadFrequently: true })!
  sctx.drawImage(image, 0, 0, size, size)
  const data = sctx.getImageData(0, 0, size, size).data

  // Luminance height field
  const h = new Float32Array(size * size)
  for (let i = 0; i < size * size; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    h[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  }

  const out = document.createElement('canvas')
  out.width = size
  out.height = size
  const octx = out.getContext('2d')!
  const img = octx.createImageData(size, size)

  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)]

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Sobel
      const tl = at(x - 1, y - 1)
      const t = at(x, y - 1)
      const tr = at(x + 1, y - 1)
      const l = at(x - 1, y)
      const r = at(x + 1, y)
      const bl = at(x - 1, y + 1)
      const b = at(x, y + 1)
      const br = at(x + 1, y + 1)

      const dx = tl + 2 * l + bl - (tr + 2 * r + br)
      const dy = tl + 2 * t + tr - (bl + 2 * b + br)
      const dz = 1 / strength

      const len = Math.hypot(dx, dy, dz) || 1
      const i = (y * size + x) * 4
      img.data[i] = ((dx / len) * 0.5 + 0.5) * 255
      img.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255
      img.data[i + 2] = ((dz / len) * 0.5 + 0.5) * 255
      img.data[i + 3] = 255
    }
  }

  octx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(out)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

/** Kesim yuzalari uchun biroz dag'alroq rough map. */
function buildRoughnessMap(image: HTMLImageElement): THREE.CanvasTexture {
  const size = 512
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(image, 0, 0, size, size)
  const d = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < d.data.length; i += 4) {
    const lum = (0.299 * d.data[i] + 0.587 * d.data[i + 1] + 0.114 * d.data[i + 2]) / 255
    // Granula cho'qqisi biroz silliqroq, oraliq soyalar dag'alroq
    const v = Math.round((0.72 + (1 - lum) * 0.28) * 255)
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v
  }
  ctx.putImageData(d, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

export interface FoamMaps {
  color: THREE.Texture
  normal: THREE.Texture
  roughness: THREE.Texture
}

let cache: Promise<FoamMaps> | null = null

export function loadFoamMaps(url = '/images/foam-texture.jpg'): Promise<FoamMaps> {
  if (cache) return cache
  cache = new Promise<FoamMaps>((resolve, reject) => {
    const loader = new THREE.ImageLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(
      url,
      (image) => {
        const color = new THREE.Texture(image)
        color.wrapS = color.wrapT = THREE.RepeatWrapping
        color.colorSpace = THREE.SRGBColorSpace
        color.needsUpdate = true

        resolve({
          color,
          normal: buildNormalMap(image),
          roughness: buildRoughnessMap(image),
        })
      },
      undefined,
      reject,
    )
  })
  return cache
}

/** Anizotrop sozlash va takrorlanish */
export function tuneMaps(maps: FoamMaps, repeat: THREE.Vector2, anisotropy: number) {
  ;[maps.color, maps.normal, maps.roughness].forEach((t) => {
    t.repeat.copy(repeat)
    t.anisotropy = anisotropy
    t.needsUpdate = true
  })
}
