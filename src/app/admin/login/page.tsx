import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { site } from "@/data/site";
import { adminConfigProblem, isAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Log in" };

const SETUP: Record<string, string> = {
  "missing-password": "ADMIN_PASSWORD is not set.",
  "missing-secret": "ADMIN_SESSION_SECRET is not set.",
  "weak-secret": "ADMIN_SESSION_SECRET must be at least 32 characters.",
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const problem = adminConfigProblem();

  return (
    <main className="grid min-h-screen place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-2xl text-ink-900">
          {site.nameLine1} <span className="text-gold-600">{site.nameLine2}</span>
        </p>
        <p className="mt-1 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-ink-400">
          Listings admin
        </p>

        <div className="mt-8 rounded-2xl border border-ink-900/10 bg-white p-7 shadow-[0_30px_70px_-45px_rgba(5,8,11,0.45)]">
          {problem ? (
            <div>
              <p className="font-semibold text-ink-900">The admin panel isn&rsquo;t set up yet</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{SETUP[problem]}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Add it to <code className="rounded bg-bone-100 px-1.5 py-0.5 text-[0.8125rem]">.env.local</code> (or
                your host&rsquo;s environment settings) and restart the site. The README section
                &ldquo;Managing listings&rdquo; walks through it.
              </p>
            </div>
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
    </main>
  );
}
