import { Button } from "@railfinance/core/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

export function NotFoundContent() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linier-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6">
            <AlertCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Please
          check the URL and try again.
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

export function NotFoundPage() {
  return <NotFoundContent />;
}

export default NotFoundPage;
