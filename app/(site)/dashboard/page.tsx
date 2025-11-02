import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardClient from "@/components/ui/DashboardClient";

export default async function DashboardPage() {
  // 🟢 Fetch the session from NextAuth
  const session = await getServerSession(authOptions);

  // 🟡 If no session, redirect to login
  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  // 🟢 Pass the NextAuth session directly to your client component
  return <DashboardClient session={session} />;
}
