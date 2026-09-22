import { Cloud, ExternalLink, HardDrive, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { site } from "@/data/site";
import { requireAdmin } from "@/lib/admin/auth";
import { usingSupabase } from "@/lib/listings/store";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const cloud = usingSupabase();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ink-900/10 bg-bone-50/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="font-display text-lg text-ink-900">
              {site.nameLine1} <span className="text-gold-600">{site.nameLine2}</span>
            </span>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-400">Admin</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="hidden items-center gap-1.5 rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs text-ink-500 sm:inline-flex"
              title={cloud ? "Listings and photos are saved to Supabase storage." : "Listings and photos are saved in the data/ folder on this server."}
            >
              {cloud ? <Cloud className="size-3.5" /> : <HardDrive className="size-3.5" />}
              {cloud ? "Cloud storage" : "Local storage"}
            </span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <ExternalLink className="size-3.5" />
              View site
            </a>
            <form action={logout}>
              <button type="submit" className="btn btn-sm text-ink-500 hover:text-ink-900">
                <LogOut className="size-3.5" />
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:py-10">{children}</main>
    </div>
  );
}
