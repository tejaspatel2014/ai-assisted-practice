import {
  clamp,
  computePlacedShape,
  SHAPE_DIMENSIONS,
  type CanvasBounds,
  type ShapeType,
} from "@/components/canvasUtils";

describe("canvasUtils", () => {
  describe("clamp", () => {
    it("returns value when within range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it("clamps to min when value is below range", () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-100, 10, 20)).toBe(10);
    });

    it("clamps to max when value is above range", () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(100, 10, 20)).toBe(20);
    });

    it("handles NaN by returning min", () => {
      expect(clamp(NaN, 0, 10)).toBe(0);
      expect(clamp(NaN, 5, 15)).toBe(5);
    });

    it("handles min > max by returning min", () => {
      expect(clamp(5, 10, 0)).toBe(10);
      expect(clamp(100, 50, 20)).toBe(50);
    });

    it("handles negative ranges", () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });
  });

  describe("computePlacedShape", () => {
    const normalBounds: CanvasBounds = { width: 800, height: 600 };
    const shapes: ShapeType[] = ["rectangle", "circle", "triangle", "line"];

    describe("rectangle", () => {
      it("places rectangle at center when clicked in middle", () => {
        const shape = computePlacedShape(
          "rectangle",
          400,
          300,
          normalBounds,
          "test-1"
        );

        expect(shape.type).toBe("rectangle");
        expect(shape.id).toBe("test-1");
        if (shape.type === "rectangle") {
          expect(shape.width).toBe(SHAPE_DIMENSIONS.RECTANGLE_WIDTH);
          expect(shape.height).toBe(SHAPE_DIMENSIONS.RECTANGLE_HEIGHT);
          // Center should be at click point
          const centerX = shape.x + shape.width / 2;
          const centerY = shape.y + shape.height / 2;
          expect(centerX).toBe(400);
          expect(centerY).toBe(300);
        }
      });

      it("clamps rectangle to left edge", () => {
        const shape = computePlacedShape(
          "rectangle",
          10,
          300,
          normalBounds,
          "test-2"
        );

        if (shape.type === "rectangle") {
          expect(shape.x).toBe(0);
        }
      });

      it("clamps rectangle to right edge", () => {
        const shape = computePlacedShape(
          "rectangle",
          790,
          300,
          normalBounds,
          "test-3"
        );

        if (shape.type === "rectangle") {
          expect(shape.x).toBe(
            normalBounds.width - SHAPE_DIMENSIONS.RECTANGLE_WIDTH
          );
        }
      });

      it("centers rectangle when canvas is smaller than shape", () => {
        const smallBounds: CanvasBounds = { width: 50, height: 50 };
        const shape = computePlacedShape(
          "rectangle",
          25,
          25,
          smallBounds,
          "test-4"
        );

        if (shape.type === "rectangle") {
          const expectedX = smallBounds.width / 2 - shape.width / 2;
          const expectedY = smallBounds.height / 2 - shape.height / 2;
          expect(shape.x).toBe(Math.round(expectedX));
          expect(shape.y).toBe(Math.round(expectedY));
        }
      });
    });

    describe("circle", () => {
      it("places circle at center when clicked in middle", () => {
        const shape = computePlacedShape(
          "circle",
          400,
          300,
          normalBounds,
          "test-5"
        );

        expect(shape.type).toBe("circle");
        if (shape.type === "circle") {
          expect(shape.radius).toBe(SHAPE_DIMENSIONS.CIRCLE_RADIUS);
          expect(shape.x).toBe(400);
          expect(shape.y).toBe(300);
        }
      });

      it("clamps circle to left edge", () => {
        const shape = computePlacedShape(
          "circle",
          10,
          300,
          normalBounds,
          "test-6"
        );

        if (shape.type === "circle") {
          expect(shape.x).toBe(SHAPE_DIMENSIONS.CIRCLE_RADIUS);
        }
      });

      it("clamps circle to right edge", () => {
        const shape = computePlacedShape(
          "circle",
          790,
          300,
          normalBounds,
          "test-7"
        );

        if (shape.type === "circle") {
          expect(shape.x).toBe(
            normalBounds.width - SHAPE_DIMENSIONS.CIRCLE_RADIUS
          );
        }
      });

      it("centers circle when canvas is smaller than diameter", () => {
        const smallBounds: CanvasBounds = { width: 50, height: 50 };
        const shape = computePlacedShape(
          "circle",
          10,
          10,
          smallBounds,
          "test-8"
        );

        if (shape.type === "circle") {
          expect(shape.x).toBe(Math.round(smallBounds.width / 2));
          expect(shape.y).toBe(Math.round(smallBounds.height / 2));
        }
      });
    });

    describe("triangle", () => {
      it("places triangle at center when clicked in middle", () => {
        const shape = computePlacedShape(
          "triangle",
          400,
          300,
          normalBounds,
          "test-9"
        );

        expect(shape.type).toBe("triangle");
        if (shape.type === "triangle") {
          expect(shape.size).toBe(SHAPE_DIMENSIONS.TRIANGLE_SIZE);
          expect(shape.x).toBe(400);
          expect(shape.y).toBe(300);
        }
      });

      it("clamps triangle to left edge", () => {
        const shape = computePlacedShape(
          "triangle",
          10,
          300,
          normalBounds,
          "test-10"
        );

        if (shape.type === "triangle") {
          expect(shape.x).toBe(SHAPE_DIMENSIONS.TRIANGLE_SIZE / 2);
        }
      });

      it("clamps triangle to right edge", () => {
        const shape = computePlacedShape(
          "triangle",
          790,
          300,
          normalBounds,
          "test-11"
        );

        if (shape.type === "triangle") {
          expect(shape.x).toBe(
            normalBounds.width - SHAPE_DIMENSIONS.TRIANGLE_SIZE / 2
          );
        }
      });

      it("centers triangle when canvas is smaller than size", () => {
        const smallBounds: CanvasBounds = { width: 50, height: 50 };
        const shape = computePlacedShape(
          "triangle",
          10,
          10,
          smallBounds,
          "test-12"
        );

        if (shape.type === "triangle") {
          expect(shape.x).toBe(Math.round(smallBounds.width / 2));
          expect(shape.y).toBe(Math.round(smallBounds.height / 2));
        }
      });
    });

    describe("line", () => {
      it("places line at center when clicked in middle", () => {
        const shape = computePlacedShape(
          "line",
          400,
          300,
          normalBounds,
          "test-13"
        );

        expect(shape.type).toBe("line");
        if (shape.type === "line") {
          const centerX = (shape.x1 + shape.x2) / 2;
          expect(centerX).toBe(400);
          expect(shape.y1).toBe(300);
          expect(shape.y2).toBe(300);
          expect(shape.x2 - shape.x1).toBe(
            SHAPE_DIMENSIONS.LINE_HALF_LENGTH * 2
          );
        }
      });

      it("clamps line to left edge", () => {
        const shape = computePlacedShape(
          "line",
          10,
          300,
          normalBounds,
          "test-14"
        );

        if (shape.type === "line") {
          expect(shape.x1).toBe(0);
          expect(shape.x2).toBe(SHAPE_DIMENSIONS.LINE_HALF_LENGTH * 2);
        }
      });

      it("clamps line to right edge", () => {
        const shape = computePlacedShape(
          "line",
          790,
          300,
          normalBounds,
          "test-15"
        );

        if (shape.type === "line") {
          expect(shape.x2).toBe(normalBounds.width);
          expect(shape.x1).toBe(
            normalBounds.width - SHAPE_DIMENSIONS.LINE_HALF_LENGTH * 2
          );
        }
      });

      it("shortens line when canvas is narrower than line length", () => {
        const narrowBounds: CanvasBounds = { width: 60, height: 400 };
        const shape = computePlacedShape(
          "line",
          30,
          200,
          narrowBounds,
          "test-16"
        );

        if (shape.type === "line") {
          // Line should be shortened to fit canvas width
          expect(shape.x1).toBeGreaterThanOrEqual(0);
          expect(shape.x2).toBeLessThanOrEqual(narrowBounds.width);
          expect(shape.x2 - shape.x1).toBeLessThanOrEqual(narrowBounds.width);
        }
      });

      it("handles extremely narrow canvas", () => {
        const tinyBounds: CanvasBounds = { width: 10, height: 400 };
        const shape = computePlacedShape("line", 5, 200, tinyBounds, "test-17");

        if (shape.type === "line") {
          expect(shape.x1).toBeGreaterThanOrEqual(0);
          expect(shape.x2).toBeLessThanOrEqual(tinyBounds.width);
        }
      });
    });

    describe("edge cases", () => {
      it("handles zero-sized canvas gracefully", () => {
        const zeroBounds: CanvasBounds = { width: 0, height: 0 };

        for (const shapeType of shapes) {
          const shape = computePlacedShape(
            shapeType,
            0,
            0,
            zeroBounds,
            `zero-${shapeType}`
          );
          expect(shape.id).toBe(`zero-${shapeType}`);
          expect(shape.type).toBe(shapeType);
        }
      });

      it("rounds coordinates to integers", () => {
        const shape = computePlacedShape(
          "rectangle",
          100.7,
          200.3,
          normalBounds,
          "test-18"
        );

        if (shape.type === "rectangle") {
          expect(Number.isInteger(shape.x)).toBe(true);
          expect(Number.isInteger(shape.y)).toBe(true);
        }
      });

      it("handles negative click coordinates", () => {
        const shape = computePlacedShape(
          "circle",
          -10,
          -10,
          normalBounds,
          "test-19"
        );

        expect(shape.id).toBe("test-19");
        if (shape.type === "circle") {
          expect(shape.x).toBeGreaterThanOrEqual(shape.radius);
          expect(shape.y).toBeGreaterThanOrEqual(shape.radius);
        }
      });

      it("handles click coordinates beyond canvas", () => {
        const shape = computePlacedShape(
          "rectangle",
          1000,
          1000,
          normalBounds,
          "test-20"
        );

        if (shape.type === "rectangle") {
          expect(shape.x).toBeLessThanOrEqual(normalBounds.width - shape.width);
          expect(shape.y).toBeLessThanOrEqual(
            normalBounds.height - shape.height
          );
        }
      });
    });

    describe("all shape types", () => {
      it("generates unique IDs for each shape", () => {
        const ids = ["id-1", "id-2", "id-3", "id-4"];
        const results = shapes.map((type, i) =>
          computePlacedShape(type, 100, 100, normalBounds, ids[i])
        );

        results.forEach((shape, i) => {
          expect(shape.id).toBe(ids[i]);
        });
      });

      it("preserves shape type", () => {
        shapes.forEach((type) => {
          const shape = computePlacedShape(
            type,
            100,
            100,
            normalBounds,
            "test"
          );
          expect(shape.type).toBe(type);
        });
      });
    });
  });
});
