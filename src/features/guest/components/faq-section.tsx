import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@railfinance/core/ui/accordion";
import { AnimatedSection } from "@railfinance/core/components/animated-section";
import { useGetPublicFaqs } from "@railfinance/core/masterdata";

const FAQ_TARGET = "guest_home";

export function FAQSection() {
  const { data } = useGetPublicFaqs(FAQ_TARGET);
  const faqItems = data?.data ?? [];

  if (faqItems.length === 0) {
    return null;
  }

  return (
    <section id="manual" className="scroll-mt-16 bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <AnimatedSection animation="fade-up">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground">
              Common questions about invoice tracking and vendor services in
              RailFinacne.
            </p>
          </div>
        </AnimatedSection>

        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AnimatedSection
              key={item.id}
              animation="fade-up"
              delay={index * 100}
            >
              <AccordionItem
                value={`item-${item.id}`}
                className="rounded-lg bg-white px-4 ring-1 ring-foreground/10 transition-all duration-300 hover:shadow-sm data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left font-medium text-foreground transition-colors hover:no-underline hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </AnimatedSection>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQSection;
