import { useAuth } from "@railfinance/core";
import { Button } from "@railfinance/core/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router";

export function ForbiddenContent() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-linier-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6">
            <Shield className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-2">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Forbidden Access
        </h2>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">
          You do not have permission to access this resource. Please contact
          your administrator if you believe you should have access.
        </p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
          Your access permissions may have been updated. Try re-logging in to
          refresh your access.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button onClick={() => logout()}>Re-login</Button>
        </div>
      </div>
    </div>
  );
}

export function ForbiddenPage() {
  return <ForbiddenContent />;
}

export default ForbiddenPage;
