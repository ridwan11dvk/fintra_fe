import { getDiffPercentage } from "@railfinance/core/lib";
import MetricCarousel from "./metric-carousel";
const generateRandomMetrics = () => ({
  value: Math.floor(globalThis.crypto.getRandomValues(new Uint32Array(1))[0]),
  lastValue: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0]),
  percentage: crypto.getRandomValues(new Uint32Array(1))[0].toFixed(2),
});

export function MetricSection() {
  const topUpIDR = generateRandomMetrics();
  const topUpUSD = generateRandomMetrics();
  const paidBillingIDR = generateRandomMetrics();
  const paidBillingUSD = generateRandomMetrics();
  const unpaidBillingIDR = generateRandomMetrics();
  const unpaidBillingUSD = generateRandomMetrics();

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-min">
      <MetricCarousel
        items={[
          {
            title: "Top Up (IDR)",
            currency: "IDR",
            status: "info",
            value: topUpIDR.value,
            lastValue: topUpIDR.lastValue,
            percentage: getDiffPercentage(topUpIDR.lastValue, topUpIDR.value),
          },
          {
            title: "Top Up (USD)",
            currency: "USD",
            status: "info",
            value: topUpUSD.value,
            lastValue: topUpUSD.lastValue,
            percentage: getDiffPercentage(topUpUSD.lastValue, topUpUSD.value),
          },
        ]}
      />
      <MetricCarousel
        items={[
          {
            title: "Paid Billing (IDR)",
            currency: "IDR",
            status: "success",
            value: paidBillingIDR.value,
            lastValue: paidBillingIDR.lastValue,
            percentage: getDiffPercentage(
              paidBillingIDR.lastValue,
              paidBillingIDR.value,
            ),
          },
          {
            title: "Paid Billing (USD)",
            currency: "USD",
            status: "success",
            value: paidBillingUSD.value,
            lastValue: paidBillingUSD.lastValue,
            percentage: getDiffPercentage(
              paidBillingUSD.lastValue,
              paidBillingUSD.value,
            ),
          },
        ]}
      />
      <MetricCarousel
        items={[
          {
            title: "Unpaid Billing (IDR)",
            currency: "IDR",
            status: "error",
            value: unpaidBillingIDR.value,
            lastValue: unpaidBillingIDR.lastValue,
            percentage: getDiffPercentage(
              unpaidBillingIDR.lastValue,
              unpaidBillingIDR.value,
            ),
          },
          {
            title: "Unpaid Billing (USD)",
            currency: "USD",
            status: "error",
            value: unpaidBillingUSD.value,
            lastValue: unpaidBillingUSD.lastValue,
            percentage: getDiffPercentage(
              unpaidBillingUSD.lastValue,
              unpaidBillingUSD.value,
            ),
          },
        ]}
      />
    </div>
  );
}

export default MetricSection;
