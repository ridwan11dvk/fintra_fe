import {
  M2M_CLIENT_CREATE_PERMISSION,
  M2M_CLIENT_URL,
  m2mClientQueryKeys,
  m2mClientService,
} from "@/features/settings";
import { ActionButton } from "@railfinance/core/components/actions";
import { DataTable } from "@railfinance/core/components/data-table";
import { useNavigate } from "react-router";
import { createM2mClientColumns } from "./m2m-client-columns";

export default function M2mClientList() {
  const navigate = useNavigate();

  const handleView = (id: number) => {
    navigate(`${M2M_CLIENT_URL}/${id}`);
  };

  const columns = createM2mClientColumns({
    onView: (client) => handleView(client.id),
  });

  return (
    <DataTable
      columns={columns}
      queryFn={m2mClientService.getClients}
      queryKey={[...m2mClientQueryKeys.all]}
      actions={
        <ActionButton
          variant="add"
          label="Create M2M Client"
          showLabel
          onClick={() => navigate(`${M2M_CLIENT_URL}/create`)}
          permission={M2M_CLIENT_CREATE_PERMISSION}
        />
      }
      search={{
        key: "search",
        placeholder: "Search M2M clients...",
      }}
      toolbar={{
        enableColumnToggle: false,
      }}
    />
  );
}
