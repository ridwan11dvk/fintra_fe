import { AnimatedSection } from "@railfinance/core/components/animated-section";
import { Button } from "@railfinance/core/ui/button";

export function VendorPortalSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <AnimatedSection animation="fade-up">
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-8 shadow-sm ring-1 ring-foreground/10 transition-all duration-300 hover:shadow-md sm:flex-row">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Access your vendor portal
              </h2>
              <p className="text-muted-foreground">
                Manage receivable and payable transactions securely through your
                Railfinance account
              </p>
            </div>
            <Button
              size="lg"
              className="bg-primary text-white transition-transform duration-200 hover:scale-105"
            >
              Sign In
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export default VendorPortalSection;
