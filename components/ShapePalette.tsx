"use client";

export type ShapeType = "rectangle" | "circle" | "triangle" | "line";

export function ShapePalette({
  selected,
  onSelect,
}: {
  selected: ShapeType;
  onSelect: (shape: ShapeType) => void;
}) {
  const shapes: ShapeType[] = ["rectangle", "circle", "triangle", "line"];

  return (
    <div className="flex flex-wrap gap-2">
      {shapes.map((shape) => {
        const isActive = selected === shape;
        return (
          <button
            key={shape}
            type="button"
            aria-pressed={isActive}
            className={
              "enabled:cursor-pointer rounded border px-3 py-2 text-sm transition " +
              (isActive
                ? "border-foreground bg-foreground text-background"
                : "border-ui-grey-400 hover:bg-ui-grey-100")
            }
            onClick={() => onSelect(shape)}>
            {shape[0].toUpperCase() + shape.slice(1)}
          </button>
        );
      })}
    </div>
  );
}

export default ShapePalette;
