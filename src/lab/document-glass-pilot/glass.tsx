"use client";

import { type ComponentProps, useId } from "react";
import { cn } from "@/lib/utils";

// DEV DocumentPreview lens only. Environment and fallback detection come from
// the shared glass module; the map below contains the two candidate profiles.

interface LensMapOptions {
  w: number;
  h: number;
  radius: number;
  band: number;
  profile: 'rim' | 'tapered';
}

const mapCache = new Map<string, string>();
const MAP_CACHE_MAX = 80;
const MAP_RESOLUTION = 200;

/**
 * Build a PNG data-URL where R/G encode normalised X/Y displacement
 * (128 = no shift). The filter's `scale` sets the real px magnitude, so the map
 * only carries the *shape* of the bend and can be cached across sizes.
 */
function buildLensMap(o: LensMapOptions): string | null {
  if (typeof document === "undefined") return null;

  const key = `${Math.round(o.w)}x${Math.round(o.h)}|r${Math.round(o.radius)}|b${Math.round(o.band)}|p${o.profile}`;
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

        // Only the visible edge bends; calculate the selected profile once.
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

interface GlassLensProps extends Omit<ComponentProps<"div">, "children"> {
  width: number;
  height: number;
  version: 'pilot' | 'latest';
  refract: boolean;
}

export function GlassLens({
  width,
  height,
  version,
  refract,
  className,
  style,
  ...props
}: GlassLensProps) {
  const filterId = useId().replace(/[^a-z0-9]/gi, "");
  const radius = Math.min(22, width / 2, height / 2);
  const latest = version === 'latest';
  const blur = .5;
  const displace = 8 + .022 * 60;
  const margin = Math.ceil(displace / 2 + blur * 3);

  const map = refract
    ? buildLensMap({
        w: width,
        h: height,
        radius,
        band: latest ? 24 : Math.max(5, Math.min(width, height) * (0.18 + .022 * 0.2)),
        profile: latest ? 'tapered' : 'rim',
      })
    : null;

  const backdrop = map
    ? `url(#${filterId}) blur(${blur}px) saturate(1.5)${latest ? '' : ' brightness(1.05)'}`
    : 'blur(6px) saturate(1.5)';

  return (
    <div className={cn("relative", className)} style={{ width, height, borderRadius: radius, backdropFilter: backdrop, WebkitBackdropFilter: backdrop, ...style }} {...props}>
      {map && (
        <svg aria-hidden className="pointer-events-none absolute size-0">
          <defs>
            <filter
              id={filterId}
              // Temporary DocumentPreview pilot: allow the displacement and
              // three blur sigmas to sample past the lens edge. Optical
              // constants, map, dimensions and the original engine stay intact.
              x={`${-margin / width * 100}%`}
              y={`${-margin / height * 100}%`}
              width={`${100 + margin / width * 200}%`}
              height={`${100 + margin / height * 200}%`}
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
      <div aria-hidden className="absolute inset-0 rounded-[inherit]" />
    </div>
  );
}
