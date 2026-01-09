import DesignBoard from "@/components/DesignBoard";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("DesignBoard", () => {
  it("renders shape buttons and allows selection", () => {
    render(<DesignBoard />);
    const rectBtn = screen.getByRole("button", { name: /rectangle/i });
    const circleBtn = screen.getByRole("button", { name: /circle/i });
    expect(rectBtn).toBeInTheDocument();
    expect(circleBtn).toBeInTheDocument();

    // Initially rectangle is selected (aria-pressed=true)
    expect(rectBtn).toHaveAttribute("aria-pressed", "true");
    expect(circleBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(circleBtn);
    expect(circleBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("places a shape on canvas when clicking", () => {
    render(<DesignBoard />);
    const el = document.querySelector("canvas");
    expect(el).toBeTruthy();
    if (!el) return;

    const shapeCount = screen.getByTestId("shape-count");
    expect(shapeCount).toHaveTextContent("0");

    const rect = el.getBoundingClientRect();
    fireEvent.pointerDown(el, {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    });

    // Assert that a shape was added
    expect(shapeCount).toHaveTextContent("1");
  });
});
