import { AnimatedSection } from "@railfinance/core/components/animated-section";
import { Mail, Phone } from "lucide-react";

export function SupportSection() {
  return (
    <section id="payment" className="scroll-mt-16 py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <AnimatedSection animation="scale">
          <div className="rounded-xl bg-gray-50 p-8 text-center transition-all duration-300 hover:bg-gray-100">
            <h3 className="mb-2 text-lg font-bold text-foreground">
              Still have questions?
            </h3>
            <p className="mb-6 text-muted-foreground">
              Or if you need assistance regarding invoice or payment status,
              please contact our support team
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="mailto:support.railfinance@kai.id"
                className="flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Mail className="size-4 text-primary" />
                <span>support.railfinance@kai.id</span>
              </a>
              <a
                href="tel:+628123456789"
                className="flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
              >
                <Phone className="size-4 text-primary" />
                <span>+62 8123 4567 89</span>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export default SupportSection;
