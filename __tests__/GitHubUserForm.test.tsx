import GitHubUserForm from "@/components/GitHubUserForm";
import { fireEvent, render, screen } from "@testing-library/react";

describe("GitHubUserForm", () => {
  it("submit button is disabled by default", () => {
    render(<GitHubUserForm />);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it("submit button is disabled when input is empty", () => {
    render(<GitHubUserForm />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it("submit button is enabled when input is valid", () => {
    render(<GitHubUserForm />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "peter-parmar" } });
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeEnabled();
  });
});
