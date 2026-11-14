import { Card, CardContent, CardHeader, CardTitle } from "@railfinance/core/ui/card";

const exchangeRates = [
  { pair: "USD/IDR", rate: "16,775.00", change: "+0.12%", absolute: "+26.50" },
  { pair: "GBP/IDR", rate: "22,525.00", change: "+0.12%", absolute: "+26.50" },
  { pair: "SGD/IDR", rate: "12,350.00", change: "+0.12%", absolute: "+26.50" },
  { pair: "AUD/IDR", rate: "11,236.50", change: "+0.12%", absolute: "+26.50" },
  { pair: "CNY/IDR", rate: "2,405.50", change: "+0.12%", absolute: "+26.50" },
];

export function ExchangeRateSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exchangeRates.map((item, index) => (
            <div key={item.pair}>
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{item.pair}</p>
                  <p className="text-md font-bold mt-1">{item.rate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-green-600">
                    {item.change}
                  </p>
                  <p className="text-xs font-semibold text-green-600">
                    {item.absolute}
                  </p>
                </div>
              </div>
              {index < exchangeRates.length - 1 && (
                <div className="mt-4 border-t" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
