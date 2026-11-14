import { Button } from "@railfinance/core/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";

export function ServerErrorContent() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linier-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-orange-100 p-6">
            <AlertTriangle className="h-16 w-16 text-orange-600" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-2">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Server Error
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Something went wrong on our end. Our team has been notified and is
          working to fix the issue. Please try again later.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );
}

export function ServerErrorPage() {
  return <ServerErrorContent />;
}

export default ServerErrorPage;
