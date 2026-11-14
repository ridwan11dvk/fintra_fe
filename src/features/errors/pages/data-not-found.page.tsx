import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

interface DataNotFoundContentProps {
  title?: string;
  message?: string;
}

export function DataNotFoundContent({
  title,
  message,
}: Readonly<DataNotFoundContentProps>) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-orange-100 p-6">
            <AlertCircle className="h-16 w-16 text-orange-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {title ?? "No Data Found"}
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          {message ??
            "The data you're looking for could not be found. Please try again or contact support if the problem persists."}
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

interface DataNotFoundPageProps {
  title?: string;
  message?: string;
}

export function DataNotFoundPage({
  title,
  message,
}: Readonly<DataNotFoundPageProps>) {
  return (
    <Page type="base" title={title}>
      <DataNotFoundContent title={title} message={message} />
    </Page>
  );
}

export default DataNotFoundPage;
