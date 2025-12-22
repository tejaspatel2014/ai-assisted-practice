import Hello from "@/components/Hello";
import { render, screen } from "@testing-library/react";

describe("Hello component", () => {
  it("renders Hello, World! text", () => {
    render(<Hello />);
    expect(screen.getByText("Hello, World!")).toBeInTheDocument();
  });
});
