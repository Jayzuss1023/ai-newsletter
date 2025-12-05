import { Check } from "lucide-react";
import CTAButtons from "../buttons/CTAButtons";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from cyan-600 to-teal-600 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-size-[24px_24px]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="maz-w-2xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight texst-white sm:text-5xl">
            Ready to Save Hours Every Week?
          </h2>
          <p className="mt-6 text-lg leading-8 text-teal-100">
            Join thousands of newsletter creators who are already using AI to
            streamline their content creation. plans starting at just $9/month.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButtons />
          </div>

          {/* Trust signals */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
            <div className="flex items-center justify-center gap-2">
              <Check className="size-5 text-green-300" />
              <span className="text-sm">Starting at $9/month</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="size-5 text-green-300" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="size-5 text-green-300" />
              <span className="text-sm">No setup fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
