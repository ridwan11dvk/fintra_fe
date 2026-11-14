import { useAuth } from "@railfinance/core";
import { RequestAccessForm } from "@railfinance/core/access-request";
import { getModuleLink } from "@railfinance/core/lib";
import { ComponentIcon } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router";

export function ModuleSelector() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const moduleLink = getModuleLink();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (moduleLink.length === 0) {
    return (
      <div className="p-15">
        <RequestAccessForm onSuccess={() => navigate("/")} />
      </div>
    );
  }

  if (moduleLink.length === 1) {
    const firstModule = moduleLink[0];
    return <Navigate to={firstModule.url} />;
  }

  return (
    <div className="p-15 text-center">
      <div className="text-3xl pb-10">Choose your module</div>
      <div className="grid md:grid-cols-3 gap-10">
        {moduleLink.map((module) => (
          <Link key={module.id} to={module.url}>
            <div className="rounded-xl border-2 bg-background p-3 transition-transform duration-500 hover:scale-105">
              <div className="flex flex-row items-center gap-4">
                <div className="bg-primary text-white p-3 rounded-xl">
                  <ComponentIcon />
                </div>
                <div className="font-bold">{module.name}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ModuleSelector;
