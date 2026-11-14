import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { Construction } from "lucide-react";
import { useNavigate } from "react-router";

export function UnderConstructionContent() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linier-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-purple-100 p-6">
            <Construction className="h-16 w-16 text-purple-600" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-2">Coming Soon</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Under Construction
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          This page is currently under construction. We're working hard to bring
          you something amazing. Please check back later!
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

export function UnderConstructionPage() {
  return (
    <Page type="base">
      <UnderConstructionContent />
    </Page>
  );
}

export default UnderConstructionPage;
