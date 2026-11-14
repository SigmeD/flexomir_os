"use client";

import {
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useId,
  useLayoutEffect,
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
  /** centre-to-rim bulge, 0 = flat centre */
  dome: number;
  profile?: 'rim' | 'tapered';
}

const mapCache = new Map<string, string>();
const MAP_CACHE_MAX = 80;
const MAP_RESOLUTION = 200;

function mapKey(o: LensMapOptions): string {
  return `${o.w}x${o.h}|r${o.radius}|b${o.band}|d${o.dome}|p${o.profile ?? 'rim'}`;
}

/**
 * Build a PNG data-URL where R/G encode normalised X/Y displacement
 * (128 = no shift). The filter's `scale` sets the real px magnitude, so the map
 * only carries the *shape* of the bend and can be cached across sizes.
 */
function buildLensMap(o: LensMapOptions): string | null {
  if (typeof document === "undefined") return null;

  const key = mapKey(o);
  const hit = mapCache.get(key);
  if (hit) return hit;

  if (o.w < 1 || o.h < 1) return null;
  const aspect = o.w / o.h;
  const mw = aspect >= 1 ? MAP_RESOLUTION : Math.round(MAP_RESOLUTION * aspect);
  const mh = aspect >= 1 ? Math.round(MAP_RESOLUTION / aspect) : MAP_RESOLUTION;
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
  const tapered = o.profile === 'tapered';

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

        let mag = 0;
        if (depth < band) {
          const t = depth / band;
          if (tapered) mag = Math.sin(Math.PI * t);
          else {
            const ramp = 1 - t;
            mag = ramp * ramp * (3 - 2 * ramp);
          }
        }
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

/** Keep the SVG filter markup separate from lens sizing and map generation. */
function LensDisplacementFilter({
  id, map, width, height, scale, region,
}: {
  id: string;
  map: string;
  width: number;
  height: number;
  scale: number;
  region?: { x: string; y: string; width: string; height: string };
}) {
  return <svg aria-hidden className="pointer-events-none absolute size-0">
    <defs>
      <filter id={id} x={region?.x ?? "0"} y={region?.y ?? "0"}
        width={region?.width ?? "100%"} height={region?.height ?? "100%"}
        filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feImage href={map} result="map" x="0" y="0" width={width} height={height} preserveAspectRatio="none" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale={scale} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>;
}

// ── shared chrome ──────────────────────────────────────────────────────────

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

// ── GlassLens ─────────────────────────────────────────────────────────────────
//
// Standalone refraction shared by the approved material and the DEV document preview.

export interface GlassLensProps extends ComponentProps<"div"> {
  width: number;
  height: number;
  radius?: number;
  strength?: number;
  blur?: number;
  dome?: number;
  brightness?: number;
  edgeBand?: number;
  edgeProfile?: 'rim' | 'tapered';
  filterOutset?: boolean;
}

export function GlassLens({
  width,
  height,
  radius = 9999,
  strength = 0.55,
  blur = 2,
  dome = 0.15,
  brightness = 1.05,
  edgeBand,
  edgeProfile = 'rim',
  filterOutset = false,
  className,
  style,
  ...props
}: GlassLensProps) {
  const filterId = useId().replace(/[^a-z0-9]/gi, "");
  const dark = useGlassDark();
  const supported = useHydrated() && refractionSupported();
  const r = Math.min(radius, width / 2, height / 2);
  const band = edgeBand ?? Math.max(5, Math.min(width, height) * (0.18 + strength * 0.2));
  const key = supported ? mapKey({ w: width, h: height, radius: r, band, dome, profile: edgeProfile }) : '';
  const [mapState, setMapState] = useState<{ key: string; url: string | null }>({ key: '', url: null });

  useLayoutEffect(() => {
    if (!supported) return;
    const url = buildLensMap({ w: width, h: height, radius: r, band, dome, profile: edgeProfile });
    setMapState(previous => previous.key === key && previous.url === url ? previous : { key, url });
  }, [supported, key, width, height, r, band, dome, edgeProfile]);
  const map = mapState.key === key ? mapState.url : null;

  const displace = 8 + strength * 60;
  const margin = filterOutset ? Math.ceil(displace / 2 + blur * 3) : 0;
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
        <LensDisplacementFilter id={filterId} map={map} width={width} height={height} scale={displace}
          region={filterOutset ? {
            x: `${-margin / width * 100}%`, y: `${-margin / height * 100}%`,
            width: `${100 + margin / width * 200}%`, height: `${100 + margin / height * 200}%`,
          } : undefined} />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: sheen(dark) }}
      />
    </div>
  );
}
