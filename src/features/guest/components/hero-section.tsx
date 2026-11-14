import heroBg from "@/assets/images/hero-bg.jpg";
import { AnimatedSection } from "@railfinance/core/components/animated-section";
import { Button } from "@railfinance/core/ui/button";
import { Image } from "@railfinance/core/components/image";
import { useScrollParallax } from "@railfinance/core/hooks";

export function HeroSection() {
  const { ref: parallaxRef, style: parallaxStyle } =
    useScrollParallax<HTMLDivElement>({
      speed: 0.3,
      direction: "up",
    });

  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {/* Parallax Background */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 h-[120%] top-[-10%]"
        style={parallaxStyle}
      >
        <Image
          src={heroBg}
          alt="Hero Background"
          className="h-full w-full object-cover opacity-40"
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center md:py-28">
        <AnimatedSection animation="fade-up" delay={0}>
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            Financial Transparency for
            <br />
            KAI Partners
          </h1>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={200}>
          <p className="mb-8 text-base text-white/90 md:text-lg">
            Track invoice progress and monitor payment status through
            RailFinance.
          </p>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={400}>
          <Button size="lg">Track Invoice</Button>
        </AnimatedSection>
      </div>
    </section>
  );
}

export default HeroSection;
