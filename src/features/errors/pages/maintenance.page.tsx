import { Button } from "@railfinance/core/ui/button";
import { Wrench } from "lucide-react";
import { useNavigate } from "react-router";

export function MaintenanceContent() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linier-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-blue-100 p-6">
            <Wrench className="h-16 w-16 text-blue-600" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-2">503</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Under Maintenance
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          We're currently performing scheduled maintenance to improve your
          experience. We'll be back online shortly. Thank you for your patience!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => globalThis.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}
export function MaintenancePage() {
  return <MaintenanceContent />;
}

export default MaintenancePage;
