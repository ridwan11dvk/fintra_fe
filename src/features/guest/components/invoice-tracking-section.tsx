import { AnimatedSection } from "@railfinance/core/components/animated-section";
import { Button } from "@railfinance/core/ui/button";
import { ErrorBoundary } from "@railfinance/core/components/errors";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  FileText,
  Search,
} from "lucide-react";
import { InvoiceTracker, type Step } from "./invoice-tracker";

const trackingSteps: Step[] = [
  { label: "Invoice Submitted", status: "completed" },
  { label: "Under Verification", status: "completed" },
  { label: "Payment Scheduled", status: "completed" },
  { label: "Paid", status: "pending" },
];

const trackingStepsVertical: Step[] = [
  {
    label: "Invoice Submitted",
    status: "completed",
    description: "Your invoice has been received",
    icon: FileText,
  },
  {
    label: "Under Verification",
    status: "completed",
    description: "Being reviewed by our team",
    icon: Search,
  },
  {
    label: "Payment Scheduled",
    status: "current",
    description: "Payment date: 12 March 2026",
    icon: Calendar,
  },
  {
    label: "Paid",
    status: "pending",
    description: "Awaiting payment completion",
    icon: CheckCircle,
  },
];

export function InvoiceTrackingSection() {
  return (
    <section id="commitment" className="scroll-mt-16 bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <AnimatedSection animation="fade-up">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              Track your invoice status
            </h2>
            <p className="text-muted-foreground">
              Check the progress of Invoice submitted to KAI
            </p>
          </div>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Track Invoice Form */}
          <AnimatedSection animation="fade-left" delay={200}>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10 transition-shadow duration-300 hover:shadow-md">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Track Invoice Form
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="npwp" className="mb-2 block">
                    NIK/NPWP
                  </Label>
                  <Input id="npwp" placeholder="e.g. 07.234.5678-999.000" />
                </div>
                <div>
                  <Label htmlFor="invoice" className="mb-2 block">
                    Invoice Number / BRP Number
                  </Label>
                  <Input id="invoice" placeholder="e.g. INV-2025-00123" />
                </div>
                <Button className="w-full bg-primary text-white transition-transform duration-200 hover:scale-[1.02]">
                  Check Status
                </Button>
              </div>
            </div>
          </AnimatedSection>

          {/* Track Invoice Status */}
          <AnimatedSection animation="fade-right" delay={400}>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-foreground/10 transition-shadow duration-300 hover:shadow-md">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Track Invoice Status
              </h3>
              <div className="mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span className="font-medium text-foreground">
                    PT. ABC Logistik
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted Date:</span>
                  <span className="font-medium text-foreground">
                    02 March 2026
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Estimated Payment Date:
                  </span>
                  <span className="font-medium text-foreground">
                    12 March 2026
                  </span>
                </div>
              </div>

              {/* Progress Tracker - Horizontal on desktop, Vertical on mobile */}
              <div className="mb-4">
                <ErrorBoundary
                  fallback={
                    <div className="py-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Unable to load invoice tracker. Please refresh the page.
                      </p>
                    </div>
                  }
                >
                  <div className="hidden md:block">
                    <InvoiceTracker
                      steps={trackingSteps}
                      orientation="horizontal"
                    />
                  </div>
                  <div className="md:hidden">
                    <InvoiceTracker
                      steps={trackingStepsVertical}
                      orientation="vertical"
                    />
                  </div>
                </ErrorBoundary>
              </div>

              <p className="mb-4 text-xs text-muted-foreground">
                (*) Payment status is updated automatically from KAI&apos;s
                financial system.
              </p>
              <div className="text-center">
                <button
                  type="button"
                  className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:underline"
                >
                  View Full Details{" "}
                  <ChevronRight className="ml-1 size-4 transition-transform hover:translate-x-1" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

export default InvoiceTrackingSection;
