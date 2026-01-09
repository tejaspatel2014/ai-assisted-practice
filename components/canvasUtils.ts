import type { Shape } from "@/components/CanvasBoard";

export type ShapeType = "rectangle" | "circle" | "triangle" | "line";
export type CanvasBounds = { width: number; height: number };

// Shape dimensions constants
export const SHAPE_DIMENSIONS = {
  RECTANGLE_WIDTH: 80,
  RECTANGLE_HEIGHT: 80,
  CIRCLE_RADIUS: 40,
  TRIANGLE_SIZE: 80,
  LINE_HALF_LENGTH: 50,
} as const;

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (min > max) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Compute a placed shape, clamped to stay fully within the canvas bounds.
 * Returns a Shape positioned such that its visual footprint does not exceed bounds.
 * For canvases smaller than shape dimensions, shapes are centered.
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
      const width = SHAPE_DIMENSIONS.RECTANGLE_WIDTH;
      const height = SHAPE_DIMENSIONS.RECTANGLE_HEIGHT;
      const cx = x - width / 2;
      const cy = y - height / 2;

      // Handle case where canvas is smaller than shape
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const minX = bounds.width >= width ? 0 : centerX - width / 2;
      const maxX =
        bounds.width >= width ? bounds.width - width : centerX - width / 2;
      const minY = bounds.height >= height ? 0 : centerY - height / 2;
      const maxY =
        bounds.height >= height ? bounds.height - height : centerY - height / 2;

      const clampedX = clamp(cx, minX, maxX);
      const clampedY = clamp(cy, minY, maxY);
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
      const radius = SHAPE_DIMENSIONS.CIRCLE_RADIUS;
      const diameter = radius * 2;

      // Handle case where canvas is smaller than shape
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const minX = bounds.width >= diameter ? radius : centerX;
      const maxX = bounds.width >= diameter ? bounds.width - radius : centerX;
      const minY = bounds.height >= diameter ? radius : centerY;
      const maxY = bounds.height >= diameter ? bounds.height - radius : centerY;

      const clampedX = clamp(x, minX, maxX);
      const clampedY = clamp(y, minY, maxY);
      return {
        id,
        type: "circle",
        x: Math.round(clampedX),
        y: Math.round(clampedY),
        radius,
      };
    }
    case "triangle": {
      const size = SHAPE_DIMENSIONS.TRIANGLE_SIZE;
      const half = size / 2;

      // Handle case where canvas is smaller than shape
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const minX = bounds.width >= size ? half : centerX;
      const maxX = bounds.width >= size ? bounds.width - half : centerX;
      const minY = bounds.height >= size ? half : centerY;
      const maxY = bounds.height >= size ? bounds.height - half : centerY;

      const clampedX = clamp(x, minX, maxX);
      const clampedY = clamp(y, minY, maxY);
      return {
        id,
        type: "triangle",
        x: Math.round(clampedX),
        y: Math.round(clampedY),
        size,
      };
    }
    case "line": {
      const halfLen = SHAPE_DIMENSIONS.LINE_HALF_LENGTH;
      const lineLength = halfLen * 2;

      // Ensure the line can always be fully contained within the canvas width.
      // If the canvas is narrower than the desired line length (2 * halfLen),
      // shorten the effective half-length accordingly so min <= max in clamp().
      const maxHalfLen = Math.max(0, bounds.width / 2);
      const effectiveHalfLen = Math.min(halfLen, maxHalfLen);
      const clampedCx = clamp(
        x,
        effectiveHalfLen,
        bounds.width - effectiveHalfLen
      );
      const clampedY = clamp(y, 0, bounds.height);
      return {
        id,
        type: "line",
        x1: Math.round(clampedCx - effectiveHalfLen),
        y1: Math.round(clampedY),
        x2: Math.round(clampedCx + effectiveHalfLen),
        y2: Math.round(clampedY),
      };
    }
  }
}
