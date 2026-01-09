import ShapePalette, { ShapeType } from "@/components/ShapePalette";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ShapePalette", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe("Rendering", () => {
    it("renders all shape buttons", () => {
      render(<ShapePalette selected="rectangle" onSelect={mockOnSelect} />);

      expect(
        screen.getByRole("button", { name: /rectangle/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /circle/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /triangle/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /line/i })).toBeInTheDocument();
    });

    it("renders buttons with capitalized labels", () => {
      render(<ShapePalette selected="rectangle" onSelect={mockOnSelect} />);

      expect(screen.getByText("Rectangle")).toBeInTheDocument();
      expect(screen.getByText("Circle")).toBeInTheDocument();
      expect(screen.getByText("Triangle")).toBeInTheDocument();
      expect(screen.getByText("Line")).toBeInTheDocument();
    });
  });

  describe("Selection State", () => {
    it("marks the selected button as pressed", () => {
      render(<ShapePalette selected="circle" onSelect={mockOnSelect} />);

      const circleButton = screen.getByRole("button", { name: /circle/i });
      expect(circleButton).toHaveAttribute("aria-pressed", "true");
    });

    it("marks non-selected buttons as not pressed", () => {
      render(<ShapePalette selected="circle" onSelect={mockOnSelect} />);

      const rectangleButton = screen.getByRole("button", {
        name: /rectangle/i,
      });
      const triangleButton = screen.getByRole("button", { name: /triangle/i });
      const lineButton = screen.getByRole("button", { name: /line/i });

      expect(rectangleButton).toHaveAttribute("aria-pressed", "false");
      expect(triangleButton).toHaveAttribute("aria-pressed", "false");
      expect(lineButton).toHaveAttribute("aria-pressed", "false");
    });

    it("applies active styling to the selected button", () => {
      render(<ShapePalette selected="rectangle" onSelect={mockOnSelect} />);

      const rectangleButton = screen.getByRole("button", {
        name: /rectangle/i,
      });
      expect(rectangleButton).toHaveClass(
        "border-foreground",
        "bg-foreground",
        "text-background"
      );
    });

    it("applies inactive styling to non-selected buttons", () => {
      render(<ShapePalette selected="rectangle" onSelect={mockOnSelect} />);

      const circleButton = screen.getByRole("button", { name: /circle/i });
      expect(circleButton).toHaveClass(
        "border-ui-grey-400",
        "hover:bg-ui-grey-100"
      );
    });

    it("updates selection when a different shape is selected", () => {
      const { rerender } = render(
        <ShapePalette selected="rectangle" onSelect={mockOnSelect} />
      );

      let rectangleButton = screen.getByRole("button", { name: /rectangle/i });
      let circleButton = screen.getByRole("button", { name: /circle/i });

      expect(rectangleButton).toHaveAttribute("aria-pressed", "true");
      expect(circleButton).toHaveAttribute("aria-pressed", "false");

      // Simulate parent component updating the selected prop
      rerender(<ShapePalette selected="circle" onSelect={mockOnSelect} />);

      rectangleButton = screen.getByRole("button", { name: /rectangle/i });
      circleButton = screen.getByRole("button", { name: /circle/i });

      expect(rectangleButton).toHaveAttribute("aria-pressed", "false");
      expect(circleButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("User Interactions", () => {
    it("calls onSelect with the correct shape when a button is clicked", () => {
      render(<ShapePalette selected="rectangle" onSelect={mockOnSelect} />);

      const circleButton = screen.getByRole("button", { name: /circle/i });
      fireEvent.click(circleButton);

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith("circle");
    });

    it("calls onSelect when clicking an already selected button", () => {
      render(<ShapePalette selected="rectangle" onSelect={mockOnSelect} />);

      const rectangleButton = screen.getByRole("button", {
        name: /rectangle/i,
      });
      fireEvent.click(rectangleButton);

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith("rectangle");
    });

    it("calls onSelect for each shape type", () => {
      render(<ShapePalette selected="rectangle" onSelect={mockOnSelect} />);

      const shapes: Array<{ name: RegExp; value: ShapeType }> = [
        { name: /rectangle/i, value: "rectangle" },
        { name: /circle/i, value: "circle" },
        { name: /triangle/i, value: "triangle" },
        { name: /line/i, value: "line" },
      ];

      for (const shape of shapes) {
        const button = screen.getByRole("button", { name: shape.name });
        fireEvent.click(button);
        expect(mockOnSelect).toHaveBeenCalledWith(shape.value);
      }

      expect(mockOnSelect).toHaveBeenCalledTimes(4);
    });

    it("handles rapid clicking on different buttons", () => {
      render(<ShapePalette selected="rectangle" onSelect={mockOnSelect} />);

      const circleButton = screen.getByRole("button", { name: /circle/i });
      const triangleButton = screen.getByRole("button", { name: /triangle/i });
      const lineButton = screen.getByRole("button", { name: /line/i });

      fireEvent.click(circleButton);
      fireEvent.click(triangleButton);
      fireEvent.click(lineButton);

      expect(mockOnSelect).toHaveBeenCalledTimes(3);
      expect(mockOnSelect).toHaveBeenNthCalledWith(1, "circle");
      expect(mockOnSelect).toHaveBeenNthCalledWith(2, "triangle");
      expect(mockOnSelect).toHaveBeenNthCalledWith(3, "line");
    });
  });

  describe("Accessibility", () => {
    it("sets button type to prevent form submission", () => {
      render(<ShapePalette selected="rectangle" onSelect={mockOnSelect} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it("uses aria-pressed to indicate toggle state", () => {
      render(<ShapePalette selected="triangle" onSelect={mockOnSelect} />);

      const triangleButton = screen.getByRole("button", { name: /triangle/i });
      expect(triangleButton).toHaveAttribute("aria-pressed", "true");

      const rectangleButton = screen.getByRole("button", {
        name: /rectangle/i,
      });
      expect(rectangleButton).toHaveAttribute("aria-pressed", "false");
    });
  });
});
