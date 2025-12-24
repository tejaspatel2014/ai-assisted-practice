import UsersPage from "@/app/users/page";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("Users page", () => {
  it("renders heading and the GitHub username form", () => {
    render(<UsersPage />);

    expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/github username/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows validation errors for invalid usernames", async () => {
    render(<UsersPage />);

    const input = screen.getByLabelText(/github username/i);
    const submit = screen.getByRole("button", { name: /submit/i });

    // Empty input should disable submit and show no error
    expect(submit).toBeDisabled();
    expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();

    // Invalid characters
    fireEvent.change(input, { target: { value: "bad!name" } });
    fireEvent.click(submit);
    await waitFor(() =>
      expect(
        screen.getByText(/only letters, numbers, and hyphens/i)
      ).toBeInTheDocument()
    );

    // Starts with hyphen
    fireEvent.change(input, { target: { value: "-start" } });
    fireEvent.click(submit);
    await waitFor(() =>
      expect(
        screen.getByText(/cannot start or end with hyphen/i)
      ).toBeInTheDocument()
    );

    // Consecutive hyphens
    fireEvent.change(input, { target: { value: "bad--name" } });
    fireEvent.click(submit);
    await waitFor(() =>
      expect(screen.getByText(/no consecutive hyphens/i)).toBeInTheDocument()
    );
  });
});
