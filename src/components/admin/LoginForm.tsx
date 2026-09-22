"use client";

import { Loader2, LogIn } from "lucide-react";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="field"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-ink w-full disabled:opacity-70">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Log in
      </button>
    </form>
  );
}
