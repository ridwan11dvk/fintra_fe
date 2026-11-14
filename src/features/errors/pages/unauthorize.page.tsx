import { Button } from "@railfinance/core/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router";

export function UnauthorizeContent() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linier-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-yellow-100 p-6">
            <Lock className="h-16 w-16 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-2">401</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Unauthorized Access
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          You don't have permission to access this resource. Please log in with
          the correct credentials or contact support if you believe this is a
          mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    </div>
  );
}

export function UnauthorizePage() {
  return <UnauthorizeContent />;
}

export default UnauthorizePage;
