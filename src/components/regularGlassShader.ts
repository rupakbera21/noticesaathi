// src/components/regularGlassShader.ts
/**
 * WebGL Regular Glass Shader for NoticeSaathi Interactive Cursor.
 * Matches @ybouane/liquidglass Regular Glass shader implementation and defaults:
 * - blurAmount: 0 (sharp background view through center)
 * - cornerRadius: 16 (matching 32px diameter circular hover ring)
 * - floating: false (cursor tracks pointer directly)
 * - biconvex dual-surface physical refraction (bevelMode: 0)
 * - chromatic aberration, fresnel reflection, specular highlights, and edge lighting
 */

export const VS_QUAD = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
\tv_uv = a_pos * 0.5 + 0.5;
\tgl_Position = vec4(a_pos, 0.0, 1.0);
}`

export const FS_BLIT = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_scale;
uniform vec2 u_offset;
varying vec2 v_uv;
void main() {
\tgl_FragColor = texture2D(u_tex, v_uv * u_scale + u_offset);
}`

export const VS_GLASS = `
attribute vec2 a_pos;
uniform vec2 u_center;   // panel centre in root-pixel coords (top-left origin)
uniform vec2 u_size;     // panel size in px
uniform vec2 u_res;      // root element size in px
uniform float u_pad;     // shadow padding in px
varying vec2 v_localPx;
varying vec2 v_screenUV;

void main() {
\tvec2 total = u_size + vec2(u_pad * 2.0);
\tv_localPx = a_pos * total;                       // px from panel centre
\tvec2 px = u_center + a_pos * total;              // screen px (DOM)
\tv_screenUV = vec2(px.x / u_res.x, 1.0 - px.y / u_res.y);
\tvec2 ndc = (px / u_res) * 2.0 - 1.0;
\tndc.y = -ndc.y;
\tgl_Position = vec4(ndc, 0.0, 1.0);
}`

export const FS_GLASS = `
precision highp float;

uniform sampler2D u_bgTex;
uniform sampler2D u_blurTex;
uniform vec2 u_size;           // panel px
uniform float u_radius;        // corner radius px
uniform vec2 u_res;

uniform float u_refract;
uniform float u_chroma;
uniform float u_edgeHL;
uniform float u_spec;
uniform float u_fresnel;
uniform float u_distort;
uniform float u_alpha;
uniform float u_sat;
uniform float u_tint;
uniform float u_zRadius;
uniform float u_brightness;
uniform float u_shadowAlpha;
uniform float u_shadowSpread;
uniform float u_shadowOffY;
uniform float u_bevelMode;

varying vec2 v_localPx;
varying vec2 v_screenUV;

float rrSDF(vec2 p, vec2 b, float r) {
\tvec2 q = abs(p) - b + vec2(r);
\treturn min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - r;
}

float bevelHeight(float d, float zR) {
\tif (d <= 0.0) return 0.0;
\tif (d >= zR) return zR;
\treturn sqrt(d * (2.0 * zR - d));
}

float hash(vec2 p) {
\treturn fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
\tvec2 half_ = u_size * 0.5;
\tfloat r = min(u_radius, min(half_.x, half_.y));
\tfloat sdf = rrSDF(v_localPx, half_, r);

\tif (sdf > 0.0) {
\t\tfloat sdfShadow = rrSDF(v_localPx - vec2(0.0, u_shadowOffY), half_, r);
\t\tfloat d = max(sdfShadow - 1.0, 0.0);
\t\tfloat spread = max(u_shadowSpread, 1.0);
\t\tfloat falloff = 1.0 / (spread * spread);
\t\tfloat outerShadow = exp(-d * d * falloff) * 0.65;
\t\tfloat contactShadow = exp(-d * 0.08 / max(spread * 0.04, 0.01)) * 0.35;
\t\tfloat shadow = (outerShadow + contactShadow) * u_shadowAlpha;
\t\tgl_FragColor = vec4(0.0, 0.0, 0.0, shadow);
\t\treturn;
\t}

\tfloat mask = 1.0 - smoothstep(-1.5, 0.5, sdf);

\tfloat maxD = min(half_.x, half_.y);
\tfloat inside = -sdf;
\tfloat edge = smoothstep(maxD * 0.35, 0.0, inside);

\tfloat zR = u_zRadius;
\tfloat e = 2.0;
\tfloat dC = inside;
\tfloat dR = -rrSDF(v_localPx + vec2(e, 0.0), half_, r);
\tfloat dL = -rrSDF(v_localPx - vec2(e, 0.0), half_, r);
\tfloat dU = -rrSDF(v_localPx + vec2(0.0, e), half_, r);
\tfloat dD = -rrSDF(v_localPx - vec2(0.0, e), half_, r);
\tfloat hC = bevelHeight(dC, zR);
\tfloat hR = bevelHeight(dR, zR);
\tfloat hL = bevelHeight(dL, zR);
\tfloat hU = bevelHeight(dU, zR);
\tfloat hD = bevelHeight(dD, zR);
\tvec2 hGrad = vec2(hR - hL, hU - hD) / (2.0 * e);
\tvec3 N = normalize(vec3(-hGrad, 1.0));

\tfloat depth = smoothstep(0.0, zR, inside);

\tvec2 pxToUV = vec2(1.0, -1.0) / u_res;
\tfloat ior = 1.5;
\tfloat refrPow = 1.0 - 1.0 / ior;
\tfloat thickness = hC * 2.0;
\tfloat thickNorm = thickness / max(zR * 2.0, 1.0);
\tvec2 refrPx;
\tif (u_bevelMode < 0.5) {
\t\tvec2 exitRefr = hGrad * refrPow;
\t\tvec2 entryRefr = hGrad * refrPow;
\t\tvec2 throughRefr = entryRefr * thickNorm * 0.5;
\t\trefrPx = (exitRefr + entryRefr + throughRefr) * u_refract * 30.0;
\t\tvec2 centerDir = -v_localPx / max(half_, vec2(1.0));
\t\trefrPx += centerDir * u_refract * 4.0 * depth;
\t} else {
\t\trefrPx = -v_localPx * u_refract * depth * 0.35;
\t}
\tvec2 refr = refrPx * pxToUV;

\tvec2 ns = v_localPx * 0.08;
\tvec2 absPxToUV = vec2(1.0) / u_res;
\tvec2 micro = (vec2(hash(ns), hash(ns + vec2(37.0))) - 0.5) * u_distort * 4.0 * absPxToUV;

\tfloat caS = u_chroma * 18.0 * (edge * 0.7 + 0.3) * 2.0;
\tvec2 caD = N.xy * caS * pxToUV;
\tvec2 base = v_screenUV + refr + micro;

\tvec3 sharp = vec3(
\t\ttexture2D(u_bgTex,  base + caD).r,
\t\ttexture2D(u_bgTex,  base).g,
\t\ttexture2D(u_bgTex,  base - caD).b
\t);
\tvec3 blur = vec3(
\t\ttexture2D(u_blurTex, base + caD).r,
\t\ttexture2D(u_blurTex, base).g,
\t\ttexture2D(u_blurTex, base - caD).b
\t);
\tfloat edgeMix = (1.0 - edge * 0.15);
\tvec3 col = mix(sharp, blur, edgeMix);

\tcol *= 1.0 + u_brightness;

\tfloat lum = dot(col, vec3(0.299, 0.587, 0.114));
\tcol = mix(vec3(lum), col, 1.0 + u_sat);

\tcol = mix(col, col * vec3(0.92, 0.95, 1.05), u_tint);
\tcol *= 1.0 + 0.06 * depth;

\tfloat fres = pow(1.0 - abs(N.z), 4.0) * u_fresnel;

\tvec3 V = vec3(0.0, 0.0, 1.0);
\tvec3 L1 = normalize(vec3(0.4, 0.7, 1.0));
\tvec3 H1 = normalize(L1 + V);
\tfloat sp1 = pow(max(dot(N, H1), 0.0), 90.0);
\tvec3 L2 = normalize(vec3(-0.3, -0.5, 1.0));
\tvec3 H2 = normalize(L2 + V);
\tfloat sp2 = pow(max(dot(N, H2), 0.0), 50.0) * 0.3;
\tvec3 L3 = normalize(vec3(0.1, 0.3, 1.0));
\tfloat spB = pow(max(dot(N, L3), 0.0), 6.0) * 0.1;
\tvec3 L4 = normalize(vec3(0.0, 0.9, 0.4));
\tvec3 H4 = normalize(L4 + V);
\tfloat sp4 = pow(max(dot(N, H4), 0.0), 120.0) * 0.6;
\tfloat totalSpec = (sp1 + sp2 + spB + sp4) * u_spec;

\tfloat borderWidth = 1.5;
\tfloat innerStroke = smoothstep(-borderWidth - 1.0, -borderWidth, sdf)
\t                  * (1.0 - smoothstep(-1.0, 0.0, sdf));
\tfloat topBias = 0.5 + 0.5 * (-v_localPx.y / half_.y);
\tinnerStroke *= (0.4 + 0.6 * topBias);

\tfloat rim = edge * u_edgeHL * 0.22;
\tfloat innerGlow = smoothstep(5.0, 0.0, -sdf) * u_edgeHL * 0.15;

\tfloat envRefl = (N.y * 0.5 + 0.5) * fres * 0.08;

\tvec3 fin = col;
\tfin += vec3(totalSpec);
\tfin += vec3(rim + innerGlow);
\tfin += vec3(innerStroke * u_edgeHL * 0.55);
\tfin += vec3(envRefl);
\tfin = mix(fin, vec3(1.0), fres * 0.2);

\tgl_FragColor = vec4(fin, mask * u_alpha);
}`

export const SHADOW_PAD = 20

export interface RegularGlassConfig {
  blurAmount: number
  refraction: number
  chromAberration: number
  edgeHighlight: number
  specular: number
  fresnel: number
  distortion: number
  cornerRadius: number
  zRadius: number
  opacity: number
  saturation: number
  tintStrength: number
  brightness: number
  shadowOpacity: number
  shadowSpread: number
  shadowOffsetY: number
  floating: boolean
  button: boolean
  bevelMode: number
}

export const REGULAR_GLASS_DEFAULTS: RegularGlassConfig = {
  blurAmount: 0.0, // Matches Regular Glass demo (#glass-fp1): sharp background view through center
  refraction: 0.69,
  chromAberration: 0.05,
  edgeHighlight: 0.18, // Inner stroke & rim gleam
  specular: 0.45, // Top-left curved white reflection highlight matching liquid glass reference
  fresnel: 1.0,
  distortion: 0.0,
  cornerRadius: 16, // Matches cursor circle radius (32px diameter / 2)
  zRadius: 16, // Proportional bevel for 32px circle
  opacity: 1.0,
  saturation: 0.0,
  tintStrength: 0.15, // Subtle optical violet tint near lower-right
  brightness: 0.02,
  shadowOpacity: 0.0, // Cursor outer ring handles outline & shadow
  shadowSpread: 10,
  shadowOffsetY: 1,
  floating: false, // Tracks pointer directly
  button: false,
  bevelMode: 0, // Biconvex pill refraction
}
