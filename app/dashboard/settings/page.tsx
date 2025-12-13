import { auth } from "@clerk/nextjs/server";
import { Crown, Settings as SettingsIcon } from "lucide-react";
import { getCurrentUserSettings } from "@/actions/user-settings";
import { PageHeader } from "@/components/dashboard/page-header";
import { PricingCards } from "@/components/dashboard/pricing-cards";
import { SettingsForm } from "@/components/dashboard/settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const { userId, has } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen bg-linear-to-r from-white to-gray-50 dark:from-black dark:to-gray-950">
        <div className="container mx-auto py-12 px-6 lg:px-8">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                Authentication Required
              </CardTitle>
              <CardDescription className="text-base">
                Please sign in to access settings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const isPro = await has({ plan: "pro" });
  const settings = isPro ? await getCurrentUserSettings() : null;

  return (
    <div>
      <div>
        {/* Header */}
        <PageHeader
          icon={SettingsIcon}
          title="Settings"
          description="Configure default settings for your newsletter generation. These settings will be automatically applied to all newsletters you create."
        />

        {/* Free User Upfgrade Prompt */}
        {!isPro && (
          <Card>
            <CardHeader>
              <div>
                <div>
                  <Crown />
                </div>
                <div>
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Customize your newsletter with persistent settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <p>Pro users can save default newsletter settings including:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="inline-flex size-6 items-center justify-center rounded-md bg-linear-to-br from-cyan-500 to-teal-600 text-white shrink-0 mt-0.5">
                      <SettingsIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground font-medium">
                      Newsletter name, description, and target audience
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="inline-flex size-6 items-center justify-center rounded-md bg-linear-to-br from-cyan-500 to-teal-600 text-white shrink-0 mt-0.5">
                      <SettingsIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground font-medium">
                      Brand voice, company information, and industry
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="inline-flex size-6 items-center justify-center rounded-md bg-linear-to-br from-cyan-500 to-teal-600 text-white shrink-0 mt-0.5">
                      <SettingsIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground font-medium">
                      Custom disclaimers, footers, and sender information
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="inline-flex size-6 items-center justify-center rounded-md bg-linear-to-br from-cyan-500 to-teal-600 text-white shrink-0 mt-0.5">
                      <SettingsIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground font-medium">
                      Automatic application to all generated newsletters
                    </span>
                  </li>
                </ul>
              </div>

              {/* Pricing Cards */}
              <div>
                <PricingCards compact />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Form */}
        {isPro && <SettingsForm initialSettings={settings} />}
      </div>
    </div>
  );
}
