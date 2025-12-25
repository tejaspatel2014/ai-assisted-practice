import FigmaLinkButton from "@/components/FigmaPrimitives/FigmaLinkButton";
import { fireEvent, render, screen } from "@testing-library/react";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("FigmaLinkButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders default sm with black underline and 14px text", () => {
    render(<FigmaLinkButton />);
    const el = screen.getByText("Shop Now");
    const cls = el.getAttribute("class") || "";
    expect(cls).toContain("border-b-[0.5px]");
    expect(cls).toContain("border-black");
    expect(cls).toContain("text-black");
    expect(cls).toContain("text-[14px]");
    // hover should remove underline when enabled
    expect(cls).toContain("enabled:hover:border-b-0");
    // pointer cursor on enabled button
    expect(cls).toContain("enabled:cursor-pointer");
  });

  it("renders xs size with 12px text", () => {
    render(<FigmaLinkButton size="xs" />);
    const el = screen.getByText("Shop Now");
    expect(el.className).toContain("text-[12px]");
  });

  it("renders disabled sm with gray text, underline and disabled attribute", () => {
    render(<FigmaLinkButton state="disabled" href="/demo" />);
    const el = screen.getByText("Shop Now");
    const cls = el.getAttribute("class") || "";
    expect(cls).toContain("border-b-[0.5px]");
    expect(cls).toContain("border-ui-grey-500");
    expect(cls).toContain("text-ui-grey-500");
    expect(el).toHaveAttribute("aria-disabled", "true");
    expect(el).toHaveAttribute("disabled");
  });

  it("renders hover sm with no underline and black text", () => {
    render(<FigmaLinkButton state="hover" />);
    const el = screen.getByText("Shop Now");
    const cls = el.getAttribute("class") || "";
    expect(cls).not.toContain("border-b-[0.5px]");
    expect(cls).not.toContain("border-black");
    expect(cls).toContain("text-black");
  });

  it("renders as button even when href is provided", () => {
    render(<FigmaLinkButton href="/shop" label="Go" />);
    const el = screen.getByText("Go");
    expect((el as HTMLElement).tagName.toLowerCase()).toBe("button");
    expect(el).not.toHaveAttribute("href");
  });

  it("navigates with router.push when clicked and href is internal", () => {
    render(<FigmaLinkButton href="/shop" label="Go" />);
    const el = screen.getByText("Go");
    fireEvent.click(el);
    expect(mockPush).toHaveBeenCalledWith("/shop");
  });

  it("opens external link in new tab with security params when target=_blank", () => {
    const openSpy = jest
      .spyOn(window, "open")
      .mockImplementation(() => null as any);
    render(
      <FigmaLinkButton href="https://example.com" target="_blank" label="Ext" />
    );
    const el = screen.getByText("Ext");
    fireEvent.click(el);
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer"
    );
    openSpy.mockRestore();
  });

  it("opens external link in same tab with security params when target not set", () => {
    const openSpy = jest
      .spyOn(window, "open")
      .mockImplementation(() => null as any);
    render(<FigmaLinkButton href="https://example.com" label="Ext2" />);
    const el = screen.getByText("Ext2");
    fireEvent.click(el);
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com",
      "_self",
      "noopener,noreferrer"
    );
    openSpy.mockRestore();
  });

  it("does not navigate when disabled", () => {
    const openSpy = jest
      .spyOn(window, "open")
      .mockImplementation(() => null as any);
    render(
      <FigmaLinkButton href="https://example.com" label="NoNav" disabled />
    );
    const el = screen.getByText("NoNav");
    fireEvent.click(el);
    expect(openSpy).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });
});
