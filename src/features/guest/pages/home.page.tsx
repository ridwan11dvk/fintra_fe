import {
  FAQSection,
  HeroSection,
  InvoiceTrackingSection,
  PromoBanner,
  SupportSection,
  VendorPortalSection,
} from "../components";

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <PromoBanner />
      <InvoiceTrackingSection />
      <VendorPortalSection />
      <FAQSection />
      <SupportSection />
    </div>
  );
}

export default HomePage;
