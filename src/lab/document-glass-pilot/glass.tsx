"use client";

import {
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────────
 * Liquid Glass lens engine.
 *
 * Real refraction on the web comes from running an SVG displacement filter as a
 * `backdrop-filter` — there, the filter's SourceGraphic is the content *behind*
 * the element, so `feDisplacementMap` physically bends the page through the
 * lens. We generate a per-lens displacement map (a rounded-rect profile that is
 * flat in the middle and bends hard at the rim) and feed it to the filter.
 *
 * Only Chromium exposes `backdrop-filter: url()`. On Safari / Firefox we fall
 * back to a plain frosted blur, which still reads as glass — just without the
 * bending.
 * ──────────────────────────────────────────────────────────────────────────── */

// ── environment ────────────────────────────────────────────────────────────

function subscribeScheme(cb: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
  return () => {
    mq.removeEventListener("change", cb);
    obs.disconnect();
  };
}

function readDark(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  if (root.classList.contains("dark")) return true;
  if (root.classList.contains("light")) return false;
  if (root.dataset.theme === "dark") return true;
  if (root.dataset.theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useGlassDark(): boolean {
  return useSyncExternalStore(subscribeScheme, readDark, () => false);
}

export function useHydrated(): boolean {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

/** Chromium is the only engine that runs url() filters as a backdrop-filter. */
export function refractionSupported(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const chromium = /\b(Chrome|Chromium|Edg|OPR)\//.test(ua);
  const safari = /^((?!chrome|android).)*safari/i.test(ua);
  return chromium && !safari;
}

// ── displacement map ─────────────────────────────────────────────────────────

interface LensMapOptions {
  w: number;
  h: number;
  radius: number;
  /** width of the bending band at the rim, in px */
  band: number;
  profile?: 'rim' | 'tapered';
  /** centre-to-rim bulge, 0 = flat centre */
  dome: number;
  /** 1 = bend outward (magnify), -1 = bend inward */
  splay: number;
  /** rendered map resolution (longest side) */
  resolution: number;
}

const mapCache = new Map<string, string>();
const MAP_CACHE_MAX = 80;

/**
 * Build a PNG data-URL where R/G encode normalised X/Y displacement
 * (128 = no shift). The filter's `scale` sets the real px magnitude, so the map
 * only carries the *shape* of the bend and can be cached across sizes.
 */
function buildLensMap(o: LensMapOptions): string | null {
  if (typeof document === "undefined") return null;

  const key = `${Math.round(o.w)}x${Math.round(o.h)}|r${Math.round(o.radius)}|b${Math.round(o.band)}|p${o.profile ?? 'rim'}|d${o.dome}|s${o.splay}`;
  const hit = mapCache.get(key);
  if (hit) return hit;

  if (o.w < 1 || o.h < 1) return null;
  const aspect = o.w / o.h;
  const mw = aspect >= 1 ? o.resolution : Math.round(o.resolution * aspect);
  const mh = aspect >= 1 ? Math.round(o.resolution / aspect) : o.resolution;
  // Degenerate (zero-pixel) maps would throw in createImageData; bail to fallback.
  if (mw < 1 || mh < 1) return null;

  const canvas = document.createElement("canvas");
  canvas.width = mw;
  canvas.height = mh;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const img = ctx.createImageData(mw, mh);
  const buf = img.data;

  const halfW = o.w / 2;
  const halfH = o.h / 2;
  const r = Math.min(o.radius, halfW, halfH);
  const band = Math.max(1, o.band);

  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      // pixel → lens-space coordinates (px), origin at centre
      const px = ((x + 0.5) / mw - 0.5) * o.w;
      const py = ((y + 0.5) / mh - 0.5) * o.h;

      // signed distance to the rounded-rect edge (negative inside)
      const qx = Math.abs(px) - (halfW - r);
      const qy = Math.abs(py) - (halfH - r);
      const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
      const inside = Math.min(Math.max(qx, qy), 0);
      const sdf = outside + inside - r;

      let nx = 0;
      let ny = 0;

      if (sdf < 0) {
        const depth = -sdf; // distance inward from the rim
        // outward unit normal (gradient of the SDF)
        const gx = qx > qy ? Math.sign(px) : 0;
        const gy = qy >= qx ? Math.sign(py) : 0;
        let dirX = gx;
        let dirY = gy;
        if (qx > 0 && qy > 0) {
          // rounded corner — point radially out of the corner arc
          const len = Math.hypot(qx, qy) || 1;
          dirX = (Math.sign(px) * qx) / len;
          dirY = (Math.sign(py) * qy) / len;
        }

        // rim ramp: 0 in the flat middle → 1 at the very edge
        const ramp = depth < band ? 1 - depth / band : 0;
        const rim = ramp * ramp * (3 - 2 * ramp); // smoothstep
        const mag = (o.profile === 'tapered' ? (depth < band ? Math.sin(Math.PI * depth / band) : 0) : rim) * o.splay;
        nx = dirX * mag;
        ny = dirY * mag;

        // dome: gentle whole-lens magnification toward the centre
        if (o.dome !== 0) {
          const u = px / halfW;
          const v = py / halfH;
          const fall = Math.max(0, 1 - (u * u + v * v));
          nx += u * fall * o.dome;
          ny += v * fall * o.dome;
        }
      }

      const i = (y * mw + x) * 4;
      buf[i] = clampByte(128 + nx * 127);
      buf[i + 1] = clampByte(128 + ny * 127);
      buf[i + 2] = 128;
      buf[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const url = canvas.toDataURL("image/png");
  mapCache.set(key, url);
  if (mapCache.size > MAP_CACHE_MAX) {
    const first = mapCache.keys().next().value;
    if (first) mapCache.delete(first);
  }
  return url;
}

function clampByte(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
}

function rimShadow(dark: boolean): string {
  return dark
    ? "inset 0 1px 1px rgba(255,255,255,0.5), inset 0 0 0 1px rgba(255,255,255,0.12), 0 16px 40px -14px rgba(0,0,0,0.6)"
    : "inset 0 1px 1px rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.4), 0 14px 38px -12px rgba(0,0,0,0.28)";
}

function sheen(dark: boolean): string {
  return dark
    ? "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 36%, transparent 64%, rgba(255,255,255,0.06) 100%)"
    : "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, transparent 38%, transparent 62%, rgba(255,255,255,0.14) 100%)";
}

// DocumentPreview-only lens. Pilot preserves the previous map; latest uses a tapered edge band.

export interface GlassLensProps extends ComponentProps<"div"> {
  width: number;
  height: number;
  radius?: number;
  strength?: number;
  blur?: number;
  brightness?: number;
  edgeBand?: number;
  edgeProfile?: 'rim' | 'tapered';
  dome?: number;
}

export function GlassLens({
  width,
  height,
  radius = 9999,
  strength = 0.55,
  blur = 2,
  brightness = 1.05,
  edgeBand,
  edgeProfile = 'rim',
  dome = 0.15,
  className,
  style,
  ...props
}: GlassLensProps) {
  const filterId = useId().replace(/[^a-z0-9]/gi, "");
  const dark = useGlassDark();
  const supported = useHydrated() && refractionSupported();
  const r = Math.min(radius, width / 2, height / 2);

  const map = supported
    ? buildLensMap({
        w: width,
        h: height,
        radius: r,
        band: edgeBand ?? Math.max(5, Math.min(width, height) * (0.18 + strength * 0.2)),
        profile: edgeProfile,
        dome,
        splay: 1,
        resolution: 200,
      })
    : null;

  const displace = 8 + strength * 60;
  const backdrop =
    supported && map
      ? `url(#${filterId}) blur(${blur}px) saturate(1.5)${brightness === 1 ? '' : ` brightness(${brightness})`}`
      : `blur(${Math.max(blur, 6)}px) saturate(1.5)`;

  const css: CSSProperties = {
    width,
    height,
    borderRadius: r,
    backdropFilter: backdrop,
    WebkitBackdropFilter: backdrop,
    boxShadow: rimShadow(dark),
    ...style,
  };

  return (
    <div className={cn("relative", className)} style={css} {...props}>
      {supported && map && (
        <svg aria-hidden className="pointer-events-none absolute size-0">
          <defs>
            <filter
              id={filterId}
              // Temporary DocumentPreview pilot: allow the displacement and
              // three blur sigmas to sample past the lens edge. Optical
              // constants, map, dimensions and the original engine stay intact.
              x={`${-(Math.ceil(displace / 2 + blur * 3) / width) * 100}%`}
              y={`${-(Math.ceil(displace / 2 + blur * 3) / height) * 100}%`}
              width={`${100 + (Math.ceil(displace / 2 + blur * 3) / width) * 200}%`}
              height={`${100 + (Math.ceil(displace / 2 + blur * 3) / height) * 200}%`}
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={map}
                result="map"
                x="0"
                y="0"
                width={width}
                height={height}
                preserveAspectRatio="none"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={displace}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[inherit]"
        style={{ background: sheen(dark) }}
      />
    </div>
  );
}
