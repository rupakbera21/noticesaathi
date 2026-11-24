// src/components/RegularGlassRenderer.ts
/**
 * RegularGlassRenderer — Client-side WebGL pipeline running the exact
 * Regular Glass shader from @ybouane/liquidglass for the NoticeSaathi cursor ring.
 *
 * Samples real DOM content underneath the cursor circle, uploads it as a WebGL
 * texture, runs dual-surface biconvex refraction and chromatic dispersion,
 * and clips the output strictly to the 32px cursor circle.
 */

import {
  VS_QUAD,
  FS_BLIT,
  VS_GLASS,
  FS_GLASS,
  SHADOW_PAD,
  REGULAR_GLASS_DEFAULTS,
  type RegularGlassConfig,
} from './regularGlassShader'

export class RegularGlassRenderer {
  private gl: WebGLRenderingContext | null = null
  private blitP: WebGLProgram | null = null
  private blitU: Record<string, WebGLUniformLocation | null> = {}
  private glassP: WebGLProgram | null = null
  private glassU: Record<string, WebGLUniformLocation | null> = {}
  private quadBuf: WebGLBuffer | null = null
  private panelBuf: WebGLBuffer | null = null
  private bgTex: WebGLTexture | null = null
  private fboTex: WebGLTexture | null = null
  private fbo: WebGLFramebuffer | null = null
  private width = 0
  private height = 0
  readonly canvas: HTMLCanvasElement

  constructor() {
    this.canvas = document.createElement('canvas')
    if (process.env.NODE_ENV === 'test' || typeof window === 'undefined') {
      throw new Error('WebGL not supported in test environment')
    }
    let gl: WebGLRenderingContext | null = null
    try {
      gl = this.canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
        preserveDrawingBuffer: true,
      })
    } catch {
      gl = null
    }
    if (!gl) {
      throw new Error('WebGL not supported')
    }
    this.gl = gl
    this.initPrograms()
    this.initBuffers()
  }

  private compile(src: string, type: number): WebGLShader | null {
    if (!this.gl) return null
    const s = this.gl.createShader(type)
    if (!s) return null
    this.gl.shaderSource(s, src)
    this.gl.compileShader(s)
    if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS)) {
      return null
    }
    return s
  }

  private link(vsSrc: string, fsSrc: string): WebGLProgram | null {
    if (!this.gl) return null
    const p = this.gl.createProgram()
    if (!p) return null
    const vs = this.compile(vsSrc, this.gl.VERTEX_SHADER)
    const fs = this.compile(fsSrc, this.gl.FRAGMENT_SHADER)
    if (!vs || !fs) return null
    this.gl.attachShader(p, vs)
    this.gl.attachShader(p, fs)
    this.gl.linkProgram(p)
    return p
  }

  private uloc(
    prog: WebGLProgram | null,
    names: string[]
  ): Record<string, WebGLUniformLocation | null> {
    const u: Record<string, WebGLUniformLocation | null> = {}
    if (!this.gl || !prog) return u
    for (const n of names) {
      u[n] = this.gl.getUniformLocation(prog, n)
    }
    return u
  }

  private initPrograms(): void {
    this.blitP = this.link(VS_QUAD, FS_BLIT)
    this.blitU = this.uloc(this.blitP, ['u_tex', 'u_scale', 'u_offset'])
    this.glassP = this.link(VS_GLASS, FS_GLASS)
    this.glassU = this.uloc(this.glassP, [
      'u_bgTex',
      'u_blurTex',
      'u_center',
      'u_size',
      'u_radius',
      'u_res',
      'u_pad',
      'u_refract',
      'u_chroma',
      'u_edgeHL',
      'u_spec',
      'u_fresnel',
      'u_distort',
      'u_alpha',
      'u_sat',
      'u_tint',
      'u_zRadius',
      'u_brightness',
      'u_shadowAlpha',
      'u_shadowSpread',
      'u_shadowOffY',
      'u_bevelMode',
    ])
  }

  private initBuffers(): void {
    if (!this.gl) return
    this.quadBuf = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuf)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      this.gl.STATIC_DRAW
    )

    this.panelBuf = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.panelBuf)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]),
      this.gl.STATIC_DRAW
    )
  }

  private prepareFBO(w: number, h: number): void {
    if (!this.gl) return
    if (this.width === w && this.height === h && this.fbo) return
    this.width = w
    this.height = h
    this.canvas.width = w
    this.canvas.height = h

    if (this.fbo) this.gl.deleteFramebuffer(this.fbo)
    if (this.fboTex) this.gl.deleteTexture(this.fboTex)

    this.fboTex = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.fboTex)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      w,
      h,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null
    )
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)

    this.fbo = this.gl.createFramebuffer()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo)
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      this.fboTex,
      0
    )
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  private uploadTexture(sourceCanvas: HTMLCanvasElement | HTMLImageElement | ImageBitmap): void {
    if (!this.gl) return
    if (!this.bgTex) this.bgTex = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.bgTex)
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      sourceCanvas
    )
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false)
  }

  private setGeometryUniforms(
    renderW: number,
    renderH: number,
    width: number,
    height: number,
    dpr: number,
    config: RegularGlassConfig
  ): void {
    const gl = this.gl
    if (!gl) return
    const pad = Math.round(SHADOW_PAD * dpr)
    gl.uniform2f(this.glassU['u_res'] ?? null, renderW, renderH)
    gl.uniform2f(this.glassU['u_center'] ?? null, renderW * 0.5, renderH * 0.5)
    gl.uniform2f(this.glassU['u_size'] ?? null, width * dpr, height * dpr)
    gl.uniform1f(this.glassU['u_radius'] ?? null, config.cornerRadius * dpr)
    gl.uniform1f(this.glassU['u_pad'] ?? null, pad)
    gl.uniform1f(this.glassU['u_zRadius'] ?? null, config.zRadius * dpr)
    gl.uniform1f(this.glassU['u_bevelMode'] ?? null, config.bevelMode)
  }

  private setRefractionUniforms(config: RegularGlassConfig): void {
    const gl = this.gl
    if (!gl) return
    gl.uniform1f(this.glassU['u_refract'] ?? null, config.refraction)
    gl.uniform1f(this.glassU['u_chroma'] ?? null, config.chromAberration)
    gl.uniform1f(this.glassU['u_edgeHL'] ?? null, config.edgeHighlight)
    gl.uniform1f(this.glassU['u_spec'] ?? null, config.specular)
    gl.uniform1f(this.glassU['u_fresnel'] ?? null, config.fresnel)
    gl.uniform1f(this.glassU['u_distort'] ?? null, config.distortion)
  }

  private setColorUniforms(config: RegularGlassConfig): void {
    const gl = this.gl
    if (!gl) return
    gl.uniform1f(this.glassU['u_alpha'] ?? null, config.opacity)
    gl.uniform1f(this.glassU['u_sat'] ?? null, config.saturation)
    gl.uniform1f(this.glassU['u_tint'] ?? null, config.tintStrength)
    gl.uniform1f(this.glassU['u_brightness'] ?? null, config.brightness)
    gl.uniform1f(this.glassU['u_shadowAlpha'] ?? null, config.shadowOpacity)
  }

  public renderGlass(
    sourceCanvas: HTMLCanvasElement | HTMLImageElement | ImageBitmap,
    width: number,
    height: number,
    dpr: number,
    config: RegularGlassConfig = REGULAR_GLASS_DEFAULTS
  ): void {
    if (!this.gl || !this.glassP) return
    const renderW = Math.round((width + SHADOW_PAD * 2) * dpr)
    const renderH = Math.round((height + SHADOW_PAD * 2) * dpr)
    this.prepareFBO(renderW, renderH)
    this.uploadTexture(sourceCanvas)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, renderW, renderH)
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    this.gl.useProgram(this.glassP)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.bgTex)
    this.gl.uniform1i(this.glassU['u_bgTex'] ?? null, 0)
    this.gl.activeTexture(this.gl.TEXTURE1)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.bgTex)
    this.gl.uniform1i(this.glassU['u_blurTex'] ?? null, 1)

    this.setGeometryUniforms(renderW, renderH, width, height, dpr, config)
    this.setRefractionUniforms(config)
    this.setColorUniforms(config)

    const loc = this.gl.getAttribLocation(this.glassP, 'a_pos')
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.panelBuf)
    this.gl.enableVertexAttribArray(loc)
    this.gl.vertexAttribPointer(loc, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
    this.gl.disable(this.gl.BLEND)
  }

  public destroy(): void {
    if (!this.gl) return
    if (this.fbo) this.gl.deleteFramebuffer(this.fbo)
    if (this.fboTex) this.gl.deleteTexture(this.fboTex)
    if (this.bgTex) this.gl.deleteTexture(this.bgTex)
    if (this.quadBuf) this.gl.deleteBuffer(this.quadBuf)
    if (this.panelBuf) this.gl.deleteBuffer(this.panelBuf)
    if (this.blitP) this.gl.deleteProgram(this.blitP)
    if (this.glassP) this.gl.deleteProgram(this.glassP)
    this.canvas.remove()
  }
}
