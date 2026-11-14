import { M2M_CLIENT_URL, useCreateM2mClient } from "@/features/settings";
import { Button } from "@railfinance/core/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@railfinance/core/ui/dialog";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import M2mClientForm from "../components/m2m-client-form";
import type { M2mClientCreateFormData } from "../data/m2m-client.schema";

export function AddM2mClientPage() {
  const navigate = useNavigate();
  const createMutation = useCreateM2mClient();
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [createdToken, setCreatedToken] = useState<string>("");
  const [createdClientId, setCreatedClientId] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (data: M2mClientCreateFormData) => {
    createMutation.mutate(
      {
        name: data.name,
        description: data.description ?? undefined,
        permissionIds: data.permissionIds || [],
        expiresAt: data.expiresAt ?? undefined,
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            setCreatedToken(response.data.token);
            setCreatedClientId(response.data.id);
            setShowTokenModal(true);
          }
        },
      },
    );
  };

  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(createdToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Create M2M Client</CardTitle>
        </CardHeader>
        <CardContent>
          <M2mClientForm
            mode="create"
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>

      <Dialog open={showTokenModal} onOpenChange={setShowTokenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Client Created</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please copy and save the token below. It will not be shown again.
            </p>
            <div className="flex items-center gap-2 rounded-md border p-3 bg-muted">
              <code className="flex-1 text-sm break-all font-mono">
                {createdToken}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyToken}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTokenModal(false);
                  navigate(`${M2M_CLIENT_URL}/${createdClientId}`);
                }}
              >
                View Client
              </Button>
              <Button
                onClick={() => {
                  setShowTokenModal(false);
                  navigate(M2M_CLIENT_URL);
                }}
              >
                Back to List
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
