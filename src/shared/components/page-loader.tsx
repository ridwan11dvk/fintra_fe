import { Loader2Icon } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2Icon
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        className="size-16 animate-spin"
      />
    </div>
  );
}

export default PageLoader;
