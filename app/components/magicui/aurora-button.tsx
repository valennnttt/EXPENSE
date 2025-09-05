"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  colors?: string[];
  speed?: number; // 1 default; makin besar makin cepat
};

export function AuroraButton({
  children,
  className = "",
  colors = ["#0ea5e9", "#2563eb", "#7c3aed", "#ec4899"],
  speed = 1,
  ...props
}: Props) {
  const style = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
      colors[0]
    })`,
    animationDuration: `${8 / speed}s`,
  } as React.CSSProperties;

  return (
    <button
      {...props}
      className={[
        // full width & responsive height
        "relative isolate inline-flex w-full items-center justify-center",
        "rounded-2xl px-4 py-3 min-h-[48px]",
        // teks & a11y
        "font-medium text-white text-center",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        // visual
        "overflow-hidden shadow",
        className,
      ].join(" ")}
    >
      {/* layer aurora — ikut border radius */}
      <span
        className="absolute inset-0 rounded-[inherit] animate-aurora bg-[length:200%_200%]"
        style={style}
        aria-hidden="true"
      />
      {/* overlay agar kontras teks tetap bagus */}
      <span
        className="absolute inset-0 rounded-[inherit] bg-black/25"
        aria-hidden="true"
      />
      {/* label */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
