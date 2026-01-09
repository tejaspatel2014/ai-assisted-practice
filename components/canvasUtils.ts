import type { Shape, ShapeType } from "@/components/CanvasBoard";

export type CanvasBounds = { width: number; height: number };

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (min > max) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Compute a placed shape, clamped to stay fully within the canvas bounds.
 * Returns a Shape positioned such that its visual footprint does not exceed bounds.
 */
export function computePlacedShape(
  selected: ShapeType,
  x: number,
  y: number,
  bounds: CanvasBounds,
  id: string
): Shape {
  switch (selected) {
    case "rectangle": {
      const width = 80;
      const height = 80;
      const cx = x - width / 2;
      const cy = y - height / 2;
      const clampedX = clamp(cx, 0, bounds.width - width);
      const clampedY = clamp(cy, 0, bounds.height - height);
      return {
        id,
        type: "rectangle",
        x: Math.round(clampedX),
        y: Math.round(clampedY),
        width,
        height,
      };
    }
    case "circle": {
      const radius = 40;
      const clampedX = clamp(x, radius, bounds.width - radius);
      const clampedY = clamp(y, radius, bounds.height - radius);
      return {
        id,
        type: "circle",
        x: Math.round(clampedX),
        y: Math.round(clampedY),
        radius,
      };
    }
    case "triangle": {
      const size = 80;
      const half = size / 2;
      const clampedX = clamp(x, half, bounds.width - half);
      const clampedY = clamp(y, half, bounds.height - half);
      return {
        id,
        type: "triangle",
        x: Math.round(clampedX),
        y: Math.round(clampedY),
        size,
      };
    }
    case "line": {
      const halfLen = 50;
      const clampedCx = clamp(x, halfLen, bounds.width - halfLen);
      const clampedY = clamp(y, 0, bounds.height);
      return {
        id,
        type: "line",
        x1: Math.round(clampedCx - halfLen),
        y1: Math.round(clampedY),
        x2: Math.round(clampedCx + halfLen),
        y2: Math.round(clampedY),
      };
    }
  }
}
