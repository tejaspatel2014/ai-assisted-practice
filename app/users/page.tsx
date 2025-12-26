import GitHubUserForm from "@/components/GitHubUserForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Submit a GitHub username",
};

export default function UsersPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Enter a GitHub username. Validation ensures a valid format.
      </p>
      <div className="mt-6">
        <GitHubUserForm />
      </div>
    </main>
  );
}
