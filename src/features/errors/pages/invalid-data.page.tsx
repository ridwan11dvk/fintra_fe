import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";

interface InvalidDataContentProps {
  title?: string;
  message?: string;
}

export function InvalidDataContent({
  title,
  message,
}: Readonly<InvalidDataContentProps>) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-yellow-100 p-6">
            <AlertTriangle className="h-16 w-16 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {title ?? "Invalid Data"}
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          {message ??
            "The data provided is invalid or incomplete. Please check your input and try again."}
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

interface InvalidDataPageProps {
  title?: string;
  message?: string;
}

export function InvalidDataPage({
  title,
  message,
}: Readonly<InvalidDataPageProps>) {
  return (
    <Page type="base" title={title}>
      <InvalidDataContent title={title} message={message} />
    </Page>
  );
}

export default InvalidDataPage;
