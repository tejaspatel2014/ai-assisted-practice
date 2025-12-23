"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

const schema = z
  .string()
  .trim()
  .min(1, "Username is required")
  .max(39, "Max length is 39")
  .regex(/^[a-zA-Z0-9-]+$/, "Only letters, numbers, and hyphens")
  .refine((v) => !v.startsWith("-") && !v.endsWith("-"), {
    message: "Cannot start or end with hyphen",
  })
  .refine((v) => !v.includes("--"), { message: "No consecutive hyphens" });

const formSchema = z.object({ username: schema });

type FormData = z.infer<typeof formSchema>;

export default function GitHubUserForm({
  onSubmit,
}: {
  onSubmit?: (data: FormData) => void;
}) {
  const [queryUsername, setQueryUsername] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  type GitHubUser = {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    bio: string | null;
    twitter_username: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
  };

  const fetcher = async (url: string): Promise<GitHubUser> => {
    const res = await fetch(url);
    if (!res.ok) {
      let message = "Request failed";
      try {
        const body = await res.json();
        message = body?.error || body?.message || message;
      } catch {
        // fallback to status code
        message = res.status === 404 ? "User not found" : message;
      }
      throw new Error(message);
    }
    return res.json();
  };

  const { data, error, isLoading } = useSWR<GitHubUser>(
    queryUsername
      ? `/api/github/user?username=${encodeURIComponent(queryUsername)}`
      : null,
    fetcher
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <form
        onSubmit={handleSubmit((form) => {
          onSubmit?.(form);
          setQueryUsername(form.username);
          // SWR will fetch automatically when the key changes
        })}
        className="space-y-4 max-w-md">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            GitHub Username
          </label>
          <input
            id="username"
            {...register("username")}
            aria-invalid={!!errors.username || undefined}
            className="mt-1 w-full rounded border p-2"
            placeholder="octocat"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-foreground px-4 py-2 text-background hover:bg-[#383838] dark:hover:bg-[#ccc]">
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </form>

      {queryUsername && (
        <div className="space-y-3">
          {isLoading && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>
          )}
          {error && (
            <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error.message}
            </div>
          )}
          {data && (
            <div className="rounded border p-4">
              <div className="flex items-center gap-4">
                <Image
                  src={
                    (data.avatar_url && data.avatar_url.trim()) ||
                    "/avatar-placeholder.svg"
                  }
                  alt={data.login}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {data.name ?? data.login}
                  </h2>
                  <a
                    href={data.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                    @{data.login}
                  </a>
                  {data.bio && (
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {data.bio}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                <Stat label="Followers" value={data.followers} />
                <Stat label="Following" value={data.following} />
                <Stat label="Public Repos" value={data.public_repos} />
                <Stat label="Public Gists" value={data.public_gists} />
              </div>
              <div className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
                {data.location && <p>📍 {data.location}</p>}
                {data.blog && (
                  <p>
                    🔗{" "}
                    <a href={data.blog} className="hover:underline">
                      {data.blog}
                    </a>
                  </p>
                )}
                {data.twitter_username && (
                  <p>
                    🐦{" "}
                    <a
                      href={`https://twitter.com/${data.twitter_username}`}
                      className="hover:underline">
                      @{data.twitter_username}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded bg-zinc-50 p-3 text-center dark:bg-zinc-900">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-zinc-600 dark:text-zinc-400">{label}</div>
    </div>
  );
}
