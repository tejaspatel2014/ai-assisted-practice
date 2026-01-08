"use client";

import CanvasBoard, { Shape } from "@/components/CanvasBoard";
import ShapePalette, { ShapeType } from "@/components/ShapePalette";
import { useCallback, useState } from "react";

export default function DesignBoard() {
  const [selected, setSelected] = useState<ShapeType>("rectangle");
  const [shapes, setShapes] = useState<Shape[]>([]);

  const placeAt = useCallback(
    (x: number, y: number) => {
      const id =
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      const next: Shape = (() => {
        switch (selected) {
          case "rectangle":
            return {
              id,
              type: "rectangle",
              x: x - 40,
              y: y - 40,
              width: 80,
              height: 80,
            };
          case "circle":
            return { id, type: "circle", x, y, radius: 40 };
          case "triangle":
            return { id, type: "triangle", x, y, size: 80 };
          case "line":
            return { id, type: "line", x1: x - 50, y1: y, x2: x + 50, y2: y };
        }
      })();
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
      </main>
    </div>
  );
}
