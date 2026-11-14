import {
  M2M_CLIENT_URL,
  useM2mClient,
  useUpdateM2mClient,
} from "@/features/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { useNavigate, useParams } from "react-router";
import M2mClientForm from "../components/m2m-client-form";
import type { M2mClientUpdateFormData } from "../data/m2m-client.schema";

export function EditM2mClientPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = Number(id);
  const { data: clientData, isLoading } = useM2mClient(clientId);
  const updateMutation = useUpdateM2mClient();

  const client = clientData?.data;

  const handleSubmit = (data: M2mClientUpdateFormData) => {
    updateMutation.mutate(
      {
        id: clientId,
        client: {
          name: data.name,
          description: data.description ?? undefined,
          status: data.status,
          expiresAt: data.expiresAt ?? undefined,
        },
      },
      {
        onSuccess: () => {
          navigate(`${M2M_CLIENT_URL}/${clientId}`);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center p-8">
        Client not found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit M2M Client: {client.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <M2mClientForm
            mode="edit"
            initialData={client}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
