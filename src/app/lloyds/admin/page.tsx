import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminSignIn } from "./AdminSignIn";
import { AdminDashboard } from "./AdminDashboard";
import { db, accessRequests, analyticsEvents } from "@/lib/db";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <AdminSignIn />;
  }

  const requests = await db
    .select()
    .from(accessRequests)
    .orderBy(desc(accessRequests.requestedAt))
    .limit(200);

  const events = await db
    .select()
    .from(analyticsEvents)
    .orderBy(desc(analyticsEvents.timestamp))
    .limit(200);

  return <AdminDashboard requests={requests} events={events} />;
}
