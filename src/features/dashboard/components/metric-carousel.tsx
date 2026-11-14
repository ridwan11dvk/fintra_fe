import type { MetricCardData } from "@railfinance/core/types";
import { Button } from "@railfinance/core/ui/button";
import { formatAbbr, formatCurrency } from "@railfinance/core/lib";
import { Metric } from "@railfinance/core/components/cards";
import { MotionCarousel } from "@railfinance/core/components/motion-carousel";
import { useNavigate } from "react-router";

type MetricCarouselProps = {
  items: MetricCardData[];
  footerLink?: string;
};
export function MetricCarousel({
  items,
  footerLink,
}: Readonly<MetricCarouselProps>) {
  const navigate = useNavigate();
  return (
    <div className="w-full rounded-xl shadow-md bg-background">
      <MotionCarousel<MetricCardData>
        hideNavigation
        dotsPosition="top-right"
        items={items}
        renderItem={(item) => (
          <Metric
            title={item.title}
            value={formatAbbr(item.value)}
            tooltip={{
              children: (
                <div className="p-2">
                  <div>
                    Current : {formatCurrency(item.value, item.currency)}
                  </div>
                  <div>
                    Before : {formatCurrency(item.lastValue, item.currency)}
                  </div>
                </div>
              ),
            }}
            percentage={item.percentage}
            status={item.status}
          />
        )}
        footer={
          <div className="flex justify-end bg-background">
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate(footerLink ?? "#")}
            >
              View report
            </Button>
          </div>
        }
      />
    </div>
  );
}

export default MetricCarousel;
