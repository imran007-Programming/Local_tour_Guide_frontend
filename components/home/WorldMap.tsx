import { Fragment } from "react";
import { buildGlobePins, GLOBE_H, GLOBE_W } from "@/lib/worldMap";
import { GLOBE_PATH } from "@/lib/worldMapPath";

// Part of the globe the form card covers on desktop (in globe units), so no
// pin or label ends up hidden behind it.
const CARD_ZONE = { x: 605, y: 0, w: 595, h: 475 };

/**
 * The curved world map behind the trip planner, with labelled pins on cities
 * that have tours plus a few well-known destinations. Rendered on the server,
 * so the map outline ships as markup rather than JavaScript. Geometry is set
 * with inline styles so it never depends on freshly generated utility classes.
 */
export default function WorldMap({ cities }: { cities: string[] }) {
  const pins = buildGlobePins(cities, { avoid: CARD_ZONE });

  return (
    <div className="relative w-full" style={{ aspectRatio: `${GLOBE_W} / ${GLOBE_H}` }}>
      <svg
        viewBox={`0 0 ${GLOBE_W} ${GLOBE_H}`}
        aria-hidden
        className="absolute inset-0 h-full w-full text-slate-400 dark:text-zinc-500"
      >
        <defs>
          <linearGradient id="globe-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.45" />
            <stop offset="1" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
          {/* Fades the globe out towards the bottom edge, like a horizon */}
          <linearGradient id="globe-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="globe-mask">
            <rect width={GLOBE_W} height={GLOBE_H} fill="url(#globe-fade)" />
          </mask>
        </defs>
        <path
          d={GLOBE_PATH}
          fill="url(#globe-land)"
          stroke="url(#globe-land)"
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          mask="url(#globe-mask)"
        />
      </svg>

      {pins.map((pin, i) => {
        const bg = i % 2 === 0 ? "#020617" : "#3B82F6";
        return (
          <Fragment key={pin.name}>
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: `${pin.left}%`,
                top: `${pin.top}%`,
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: "#3B82F6",
                boxShadow: "0 0 0 4px rgba(59,130,246,0.25)",
                transform: "translate(-50%, -50%)",
              }}
            />
            {/* Labels only from lg up: below that the map is too small for them */}
            <span
              className="hidden whitespace-nowrap rounded-lg px-4 py-2 text-[15px] font-medium leading-none text-white shadow-lg lg:block"
              style={{
                position: "absolute",
                left: `${pin.labelLeft}%`,
                top: `${pin.labelTop}%`,
                background: bg,
                transform: pin.above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
              }}
            >
              <span style={{ display: "block", padding: "3px 0" }}>{pin.name}</span>
              <span
                style={{
                  position: "absolute",
                  left: `calc(50% + ${pin.tail}%)`,
                  [pin.above ? "bottom" : "top"]: -5,
                  width: 10,
                  height: 10,
                  background: bg,
                  transform: "translateX(-50%) rotate(45deg)",
                }}
              />
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}
