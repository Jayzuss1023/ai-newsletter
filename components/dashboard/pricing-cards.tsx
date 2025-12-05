import { PricingTable } from "@clerk/nextjs";
import { Spinner } from "../ui/spinner";

interface PricingCardProps {
  compact?: boolean;
}

export function PricingCards({ compact = false }: PricingCardProps) {
  return (
    <div>
      <div>
        <PricingTable
          appearance={{
            elements: {
              pricingTableCardHeader: {
                backgroundColor: "teal",
                color: "white",
              },
              pricingTableCardTitle: {
                fontSize: compact ? "1.5rem" : "2rem",
                fontWeight: "bold",
                color: "white",
              },
              pricingTableCardDescription: {
                fontSize: compact ? "0.875rem" : "1rem",
                color: "white",
              },
              pricingTableCardFee: {
                color: "white",
              },
              pricingTableCardFeePeriod: {
                color: "white",
              },
            },
          }}
          fallback={
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-10" />
            </div>
          }
        />
      </div>
    </div>
  );
}
