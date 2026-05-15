import { SiteHeader } from "@/components/lloyds/SiteHeader";
import { SiteFooter } from "@/components/lloyds/SiteFooter";
import { getSession } from "@/lib/auth";

export default async function LloydsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader authenticated={!!session} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
