"use client";

import React, { useEffect, useMemo, useRef } from "react";

export type ShapeType = "rectangle" | "circle" | "triangle" | "line";

export type Shape =
  | {
      id: string;
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | { id: string; type: "circle"; x: number; y: number; radius: number }
  | { id: string; type: "triangle"; x: number; y: number; size: number }
  | {
      id: string;
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };

export function CanvasBoard({
  shapes,
  onPlace,
  className,
}: {
  shapes: Shape[];
  onPlace: (
    x: number,
    y: number,
    bounds: { width: number; height: number }
  ) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const color = useMemo(() => {
    const cs = globalThis.document
      ? getComputedStyle(document.documentElement)
      : undefined;
    const fg = cs?.getPropertyValue("--color-foreground").trim();
    return fg && fg.length > 0 ? fg : "#383838";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = globalThis.window?.devicePixelRatio || 1;
    // Ensure the canvas is crisp on high-DPI screens
    const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
    const bitmapW = Math.max(1, Math.floor(cssW * dpr));
    const bitmapH = Math.max(1, Math.floor(cssH * dpr));
    if (canvas.width !== bitmapW || canvas.height !== bitmapH) {
      canvas.width = bitmapW;
      canvas.height = bitmapH;
    }

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      // JSDOM does not implement canvas. Skip drawing in tests.
      return;
    }
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    // Draw all shapes
    for (const s of shapes) {
      switch (s.type) {
        case "rectangle": {
          ctx.strokeRect(s.x, s.y, s.width, s.height);
          break;
        }
        case "circle": {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
        case "triangle": {
          const half = s.size / 2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - half); // top
          ctx.lineTo(s.x - half, s.y + half); // bottom-left
          ctx.lineTo(s.x + half, s.y + half); // bottom-right
          ctx.closePath();
          ctx.stroke();
          break;
        }
        case "line": {
          ctx.beginPath();
          ctx.moveTo(s.x1, s.y1);
          ctx.lineTo(s.x2, s.y2);
          ctx.stroke();
          break;
        }
      }
    }

    ctx.restore();
  }, [shapes, color]);

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const bounds = {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
    onPlace(Math.round(x), Math.round(y), bounds);
  }

  return (
    <div
      className={
        "relative rounded border border-ui-grey-300 bg-background " +
        (className || "")
      }>
      <canvas
        ref={canvasRef}
        className="block h-[480px] w-full"
        onPointerDown={handlePointerDown}
      />
    </div>
  );
}

export default CanvasBoard;
