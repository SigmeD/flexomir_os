"use client";

import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
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
  /** 1 = bend outward (magnify), -1 = bend inward */
  splay: number;
  /** rendered map resolution (longest side) */
  resolution: number;
  profile?: 'rim' | 'tapered';
}

const mapCache = new Map<string, string>();
const MAP_CACHE_MAX = 80;

function mapKey(o: LensMapOptions): string {
  return `${o.w}x${o.h}|r${o.radius}|b${o.band}|d${o.dome}|s${o.splay}|q${o.resolution}|p${o.profile ?? 'rim'}`;
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
        mag *= o.splay;
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

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Shared SVG markup; map generation and each lens's geometry stay with its owner. */
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

// ── Glass ─────────────────────────────────────────────────────────────────────

export interface GlassProps {
  children?: ReactNode;
  /** Lens overlay. Elements marked `data-glass-lens` refract the content. */
  lens?: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Refraction strength 0–1. Drives displacement px + rim band. */
  strength?: number;
  /** Backdrop blur inside the lens, px. */
  blur?: number;
  /** Tint 0 (clear) – 1 (frosted). Defaults from strength. */
  tint?: number;
  /** Tint colour as "r,g,b". Defaults to theme. */
  tintColor?: string;
  /** Lens dome bulge, 0 = flat. */
  dome?: number;
  /** Corner radius for the implicit single-lens mode, px. */
  radius?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Glass refracts content placed in `children` through lens regions in `lens`.
 * If no `lens` is given, the whole rounded box becomes a single lens.
 */
export function Glass({
  children,
  lens,
  className,
  contentClassName,
  strength = 0.5,
  blur = 4,
  tint,
  tintColor,
  dome = 0,
  radius = 24,
  as: Tag = "div",
}: GlassProps) {
  const rootRef = useRef<HTMLElement>(null);
  const filterId = useId().replace(/[^a-z0-9]/gi, "");
  const dark = useGlassDark();
  const supported = useHydrated() && refractionSupported();

  const [map, setMap] = useState<string | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const t = tint ?? clamp01(strength * 0.45);
  const rgb = tintColor ?? (dark ? "70,72,78" : "255,255,255");
  const displace = 8 + strength * 60;

  // Generate / refresh the single-lens map on resize.
  useEffect(() => {
    if (!supported || lens) return;
    const el = rootRef.current;
    if (!el) return;
    const refresh = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 4 || h < 4) return;
      setBox({ w, h });
      const cs = getComputedStyle(el);
      const r = parseFloat(cs.borderTopLeftRadius) || radius;
      setMap(
        buildLensMap({
          w,
          h,
          radius: r,
          band: Math.max(6, Math.min(w, h) * (0.12 + strength * 0.16)),
          dome,
          splay: 1,
          resolution: 220,
        }),
      );
    };
    refresh();
    const ro = new ResizeObserver(refresh);
    ro.observe(el);
    return () => ro.disconnect();
  }, [supported, lens, strength, dome, radius]);

  const singleLens = !lens;
  const backdrop =
    singleLens && supported && map
      ? `url(#${filterId}) blur(${blur}px) saturate(1.6)`
      : `blur(${Math.max(blur, 8)}px) saturate(1.6)`;

  const El = Tag as React.ElementType;
  return (
    <El
      ref={rootRef}
      className={cn("relative isolate overflow-hidden", className)}
      style={{ borderRadius: radius }}
    >
      {singleLens && supported && map && (
        <LensDisplacementFilter id={filterId} map={map} width={box.w} height={box.h} scale={displace} />
      )}

      {/* content the lens refracts */}
      {children !== undefined && (
        <div className={cn("relative", contentClassName)}>{children}</div>
      )}

      {/* single-lens backdrop + tint + rim */}
      {singleLens && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: `rgba(${rgb},${Math.max(t * 0.4, 0.04)})` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ boxShadow: rimShadow(dark), background: sheen(dark) }}
          />
        </>
      )}

      {/* explicit lens layer */}
      {lens && (
        <div className="pointer-events-none absolute inset-0">{lens}</div>
      )}
    </El>
  );
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
  const key = supported ? mapKey({ w: width, h: height, radius: r, band, dome, splay: 1, resolution: 200, profile: edgeProfile }) : '';
  const [mapState, setMapState] = useState<{ key: string; url: string | null }>({ key: '', url: null });

  useLayoutEffect(() => {
    if (!supported) return;
    const url = buildLensMap({ w: width, h: height, radius: r, band, dome, splay: 1, resolution: 200, profile: edgeProfile });
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

// ── GlassSurface ────────────────────────────────────────────────────────────
//
// A frosted, tinted panel for floating UI (popover / dialog / tooltip / button)
// where there is nothing behind it for the engine to refract. Pure
// backdrop-filter, so it renders the same in every browser.

export interface GlassSurfaceHandle {
  setTintLift(delta: number): void;
}

export interface GlassSurfaceProps extends ComponentProps<"div"> {
  tint?: number;
  tintColor?: string;
  blur?: number;
  saturation?: number;
  radius?: number;
  specular?: boolean;
  handleRef?: RefObject<GlassSurfaceHandle | null>;
  /** Classes for the inner content wrapper — put layout (flex/grid) here. */
  contentClassName?: string;
}

export function GlassSurface({
  tint = 0.5,
  tintColor,
  blur = 14,
  saturation = 1.6,
  radius = 16,
  specular = true,
  handleRef,
  className,
  contentClassName,
  style,
  children,
  ...props
}: GlassSurfaceProps) {
  const dark = useGlassDark();
  const t = clamp01(tint);
  const rgb = tintColor ?? (dark ? "60,62,68" : "255,255,255");
  const tintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!handleRef) return;
    handleRef.current = {
      setTintLift(delta: number) {
        const el = tintRef.current;
        if (el)
          el.style.background = `rgba(${rgb},${Math.max(0.04, Math.min(0.55, t * 0.42 + delta))})`;
      },
    };
  }, [handleRef, rgb, t]);

  const blurPx = Math.max(3, blur * (0.4 + t * 0.6));
  const sat = 1 + (saturation - 1) * Math.max(t, 0.25);
  const backdrop = `blur(${blurPx}px) saturate(${sat})`;

  return (
    <div
      className={cn("relative", className)}
      style={{ borderRadius: radius, ...style }}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
      />
      <div
        aria-hidden
        ref={tintRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: `rgba(${rgb},${Math.max(0.04, t * 0.42)})` }}
      />
      {specular && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: sheen(dark) }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ boxShadow: rimShadow(dark) }}
          />
        </>
      )}
      <div className={cn("relative h-full w-full rounded-[inherit]", contentClassName)}>{children}</div>
    </div>
  );
}
