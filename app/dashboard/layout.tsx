import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { has } = await auth();
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
