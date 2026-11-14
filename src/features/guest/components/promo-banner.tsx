import adsBanner from "@/assets/images/ads-banner.png";
import { AnimatedSection } from "@railfinance/core/components/animated-section";
import { Image } from "@railfinance/core/components/image";
import { MotionCarousel } from "@railfinance/core/components/motion-carousel";

type PromoBannerData = {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
};

const carouselData: PromoBannerData[] = [
  {
    title: "Simplify Your Financial Operations",
    subtitle: "Support your financial operations end-to-end",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    imageUrl: adsBanner,
  },
  {
    title: "Streamline Your Workflow with Role-Based Access Control",
    subtitle: "Operate within defined roles and workflows",
    imageUrl: adsBanner,
  },
];

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <MotionCarousel<PromoBannerData>
        className=""
        dotsPosition="bottom-center"
        items={carouselData}
        renderItem={(item) =>
          item.imageUrl ? (
            <AnimatedSection animation="scale">
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={adsBanner}
                  alt="Promo Grand Opening"
                  className="h-auto w-full transition-transform duration-500 hover:scale-105"
                />
              </div>
            </AnimatedSection>
          ) : (
            <AnimatedSection animation="scale" className="h-full w-full">
              <div className="h-full w-full flex flex-col justify-center text-center items-center">
                <p className="text-xl md:text-2xl font-semibold">
                  {item.title}
                </p>
                <p className="text-base md:text-lg font-semibold">
                  {item.subtitle}
                </p>
                <p className="text-xs md:text-sm ">{item.description}</p>
              </div>
            </AnimatedSection>
          )
        }
      />
    </section>
  );
}

export default PromoBanner;
