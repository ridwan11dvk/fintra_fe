import { Button } from "@railfinance/core/ui/button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function EsaTokenErrorContent({ error }: Readonly<{ error: string }>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error("ESA Token Error:", error);
    }
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6">
            <AlertTriangle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-2">Invalid Token</h1>
        <h2 className="text-2xl font-semibold text-red-700 mb-4">
          {error ?? "Token Validation Failed"}
        </h2>
        {!error && (
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            The token you provided is invalid, expired, or has already been
            used. Please request a new token and try again.
          </p>
        )}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This error may also occur if the ESA server
            or App server is currently experiencing issues or is temporarily
            down. If the problem persists, please try again later or contact
            support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/login")} variant="outline">
            Back to Login
          </Button>
          {/* <Button onClick={() => navigate("/")}>Back to Dashboard</Button> */}
        </div>
      </div>
    </div>
  );
}

export function EsaTokenErrorPage({ error }: Readonly<{ error: string }>) {
  return <EsaTokenErrorContent error={error} />;
}

export default EsaTokenErrorPage;
