import Link from "next/link";

interface SiteHeaderProps {
  authenticated?: boolean;
}

export function SiteHeader({ authenticated }: SiteHeaderProps) {
  return (
    <header className="border-b border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link href="/lloyds" className="group">
          <div className="flex flex-col">
            <span className="section-label">NSAI for Insurance</span>
            <span className="section-label" style={{ color: "var(--text-tertiary)" }}>
              Lloyd&apos;s Market Demonstrations
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-8">
          {authenticated ? (
            <>
              <Link
                href="/lloyds/demos"
                className="text-sm hover:text-white transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                Demonstrations
              </Link>
              <Link
                href="/lloyds/positioning"
                className="text-sm hover:text-white transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                Positioning
              </Link>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/lloyds/signin"
                className="text-sm hover:text-white transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                Sign in
              </Link>
              <Link href="/lloyds/request-access" className="btn-primary text-sm">
                Request access →
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
