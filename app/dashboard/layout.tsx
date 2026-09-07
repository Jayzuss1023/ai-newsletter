import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId, has } = await auth();
  if (!userId || !has) {
    throw new Error("no user found");
  }
  const hasPaidPlan =
    (await has({ plan: "pro" })) || (await has({ plan: "starter" }));

  if (!hasPaidPlan) {
    redirect("#/pricing");
  }

  return (
    <div>
      <DashboardHeader />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
