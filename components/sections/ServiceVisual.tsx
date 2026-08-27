"use client";

import { AnimatePresence, motion } from "motion/react";
import { services } from "@/data/services";
import { cx } from "@/lib/utils";

/**
 * Six drawn interface diagrams — one per service.
 * Hairline construction drawings, ink at low opacity, exactly one accent
 * element each. Deliberately not illustration, not a skeleton loader.
 */

const HAIR = "stroke-ink/20";
const MID = "stroke-ink/35";
const FILL_SOFT = "fill-ink/[0.07]";
const FILL_MID = "fill-ink/[0.22]";
const FILL_INK = "fill-ink/[0.62]";

function Canvas({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <figure className="relative w-full overflow-hidden rounded-md border border-[var(--line-paper)] bg-paper-soft">
      <svg
        viewBox="0 0 220 150"
        className="svc-diagram block w-full"
        aria-hidden="true"
      >
        {children}
      </svg>
      <figcaption className="t-label absolute bottom-4 right-5 text-muted-ink">
        {label}
      </figcaption>
    </figure>
  );
}

/* 01 — editorial page construction */
function DesignDiagram() {
  return (
    <g>
      <rect x="18" y="14" width="184" height="112" rx="2" className={`fill-none ${HAIR}`} />
      <path d="M18 30h184" className={HAIR} strokeWidth="1" />
      <circle cx="26" cy="22" r="1.6" className={FILL_MID} />
      <path d="M150 22h44" className={HAIR} strokeWidth="1" />
      {/* type column */}
      <rect x="28" y="42" width="74" height="7" rx="1" className={FILL_INK} />
      <rect x="28" y="53" width="52" height="7" rx="1" className={FILL_INK} />
      <path d="M28 72h68M28 79h58M28 86h64" className={MID} strokeWidth="1" />
      <rect x="28" y="98" width="38" height="12" rx="6" className="fill-accent" />
      {/* image plate */}
      <rect x="120" y="42" width="72" height="68" rx="2" className={`${FILL_SOFT} ${HAIR}`} />
      <path d="M120 110 156 66l36 44" className={`fill-none ${HAIR}`} strokeWidth="1" />
      <circle cx="176" cy="58" r="4" className={`fill-none ${MID}`} strokeWidth="1" />
      {/* margin guides */}
      <path d="M12 14v112M208 14v112" className="stroke-accent/30" strokeWidth="1" strokeDasharray="2 4" />
    </g>
  );
}

/* 02 — markup structure */
function DevelopmentDiagram() {
  const rows = [
    { d: 0, w: 60 }, { d: 1, w: 46 }, { d: 2, w: 34 }, { d: 2, w: 40 },
    { d: 1, w: 52 }, { d: 2, w: 30, accent: true }, { d: 3, w: 26, accent: true },
    { d: 2, w: 36 }, { d: 1, w: 44 }, { d: 0, w: 56 },
  ];
  return (
    <g>
      <path d="M22 14v112" className={HAIR} strokeWidth="1" />
      {rows.map((r, i) => {
        const y = 21 + i * 11;
        const x = 30 + r.d * 12;
        return (
          <g key={i}>
            <path d={`M22 ${y}h${x - 24}`} className={HAIR} strokeWidth="1" />
            <rect
              x={x}
              y={y - 2.5}
              width={r.w}
              height="5"
              rx="1"
              className={r.accent ? "fill-accent" : r.d === 0 ? FILL_INK : FILL_MID}
            />
            <text
              x="12"
              y={y + 2.5}
              className="fill-ink/25"
              style={{ font: "500 6px var(--font-mono)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* 03 — user flow */
function UxDiagram() {
  return (
    <g>
      <g className={`fill-none ${HAIR}`} strokeWidth="1">
        <path d="M64 40h22M64 106h22M126 40v26M126 66h22M126 106V80" />
      </g>
      <g fill="none" strokeWidth="1.1">
        <rect x="22" y="18" width="42" height="44" rx="2" className={MID} />
        <rect x="86" y="18" width="40" height="44" rx="2" className={HAIR} />
        <rect x="86" y="84" width="40" height="44" rx="2" className={HAIR} />
        <rect x="22" y="84" width="42" height="44" rx="2" className={MID} />
        <rect x="148" y="52" width="54" height="46" rx="2" className="stroke-accent" fill="rgba(62,82,255,0.07)" />
      </g>
      <g className={FILL_MID}>
        <rect x="29" y="26" width="22" height="3" rx="1.5" />
        <rect x="29" y="33" width="14" height="3" rx="1.5" />
        <rect x="29" y="92" width="22" height="3" rx="1.5" />
        <rect x="29" y="99" width="16" height="3" rx="1.5" />
        <rect x="93" y="26" width="18" height="3" rx="1.5" />
        <rect x="93" y="92" width="18" height="3" rx="1.5" />
      </g>
      <g className="fill-accent">
        <rect x="157" y="62" width="26" height="3.5" rx="1.75" />
        <rect x="157" y="70" width="17" height="3.5" rx="1.75" />
        <rect x="157" y="82" width="20" height="7" rx="3.5" />
        <circle cx="126" cy="66" r="2.6" />
      </g>
    </g>
  );
}

/* 04 — commerce */
function CommerceDiagram() {
  return (
    <g>
      {/* checkout progress */}
      <path d="M18 18h60" className="stroke-accent" strokeWidth="2" strokeLinecap="round" />
      <path d="M82 18h60" className="stroke-accent/45" strokeWidth="2" strokeLinecap="round" />
      <path d="M146 18h56" className={HAIR} strokeWidth="2" strokeLinecap="round" />
      {/* products */}
      {[0, 1, 2].map((i) => {
        const x = 18 + i * 63;
        const on = i === 1;
        return (
          <g key={i}>
            <rect
              x={x}
              y="32"
              width="58"
              height="60"
              rx="2"
              fill="none"
              className={on ? "stroke-accent" : HAIR}
              strokeWidth="1.1"
            />
            <rect x={x} y="32" width="58" height="36" className={on ? "fill-accent/10" : FILL_SOFT} />
            <circle cx={x + 29} cy="50" r="9" className={`fill-none ${on ? "stroke-accent/50" : HAIR}`} strokeWidth="1" />
            <rect x={x + 8} y="76" width="34" height="3.5" rx="1.75" className={FILL_MID} />
            <rect x={x + 8} y="84" width="18" height="3.5" rx="1.75" className={on ? "fill-accent" : FILL_MID} />
          </g>
        );
      })}
      {/* cart bar */}
      <rect x="18" y="102" width="184" height="24" rx="2" className={FILL_SOFT} />
      <rect x="28" y="111" width="52" height="5" rx="2.5" className={FILL_MID} />
      <rect x="146" y="107" width="46" height="14" rx="7" className={FILL_INK} />
    </g>
  );
}

/* 05 — application */
function AppDiagram() {
  const bars = [30, 52, 22, 66, 40, 58, 34, 46];
  return (
    <g>
      {/* sidebar */}
      <rect
        x="18"
        y="14"
        width="34"
        height="112"
        rx="2"
        fill="none"
        className={HAIR}
        strokeWidth="1"
      />
      <rect x="24" y="22" width="22" height="4" rx="2" className="fill-accent" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="24" y={34 + i * 10} width="22" height="4" rx="2" className={FILL_MID} />
      ))}
      {/* stat cards */}
      {[0, 1, 2].map((i) => {
        const x = 60 + i * 48;
        return (
          <g key={i}>
            <rect x={x} y="14" width="42" height="30" rx="2" fill="none" className={HAIR} strokeWidth="1" />
            <rect x={x + 7} y="21" width="20" height="3" rx="1.5" className={FILL_MID} />
            <rect x={x + 7} y="29" width="14" height="7" rx="1" className={i === 0 ? "fill-accent" : FILL_INK} />
          </g>
        );
      })}
      {/* chart */}
      <rect x="60" y="52" width="142" height="74" rx="2" fill="none" className={HAIR} strokeWidth="1" />
      <path d="M60 112h142" className={HAIR} strokeWidth="1" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={70 + i * 16}
          y={112 - h}
          width="9"
          height={h}
          rx="1"
          className={i === 3 ? "fill-accent" : FILL_MID}
        />
      ))}
    </g>
  );
}

/* 06 — motion */
function CreativeDiagram() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={22 + i * 13}
          y={16 + i * 7}
          width="104"
          height="58"
          rx="2"
          fill="none"
          className={i === 2 ? "stroke-accent" : HAIR}
          strokeWidth="1.1"
          strokeDasharray={i === 2 ? undefined : "3 3"}
        />
      ))}
      <rect x="48" y="30" width="104" height="58" rx="2" className="fill-accent/8" />
      {/* easing curve */}
      <path d="M22 126h180" className={HAIR} strokeWidth="1" />
      <path d="M22 126V96" className={HAIR} strokeWidth="1" />
      <path d="M22 126C74 126 84 100 200 98" fill="none" className="stroke-accent" strokeWidth="1.4" />
      <circle cx="200" cy="98" r="2.8" className="fill-accent" />
      <circle cx="22" cy="126" r="2" className={FILL_MID} />
      <path d="M22 98h30M74 126v-6" className="stroke-accent/30" strokeWidth="1" strokeDasharray="2 3" />
    </g>
  );
}

const DIAGRAMS = [
  DesignDiagram,
  DevelopmentDiagram,
  UxDiagram,
  CommerceDiagram,
  AppDiagram,
  CreativeDiagram,
];

export function ServiceVisual({
  index,
  compact = false,
}: {
  index: number;
  compact?: boolean;
}) {
  const Diagram = DIAGRAMS[index] ?? DIAGRAMS[0];
  const service = services[index] ?? services[0];

  return (
    <div className={cx("relative", compact ? "max-w-[26rem]" : "")}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0.4 }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          exit={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
          transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
        >
          <Canvas label={service.title}>
            <Diagram />
          </Canvas>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
