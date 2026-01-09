"use client";

import CanvasBoard, { Shape } from "@/components/CanvasBoard";
import ShapePalette, { ShapeType } from "@/components/ShapePalette";
import { computePlacedShape } from "@/components/canvasUtils";
import { useCallback, useState } from "react";

export default function DesignBoard() {
  const [selected, setSelected] = useState<ShapeType>("rectangle");
  const [shapes, setShapes] = useState<Shape[]>([]);

  const placeAt = useCallback(
    (x: number, y: number, bounds: { width: number; height: number }) => {
      const id =
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      const next: Shape = computePlacedShape(selected, x, y, bounds, id);
      setShapes((prev) => [...prev, next]);
    },
    [selected]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr]">
      <aside>
        <div className="rounded border border-ui-grey-300 p-3">
          <h2 className="text-sm font-medium">Shapes</h2>
          <div className="mt-2">
            <ShapePalette selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </aside>
      <main>
        <CanvasBoard shapes={shapes} onPlace={placeAt} />
        <div data-testid="shape-count" className="sr-only">
          {shapes.length}
        </div>
      </main>
    </div>
  );
}
