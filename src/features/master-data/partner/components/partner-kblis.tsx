import { PARTNER_UPDATE_PERMISSION } from "@/features/master-data/partner/data/partner.utils";
import {
  useCreatePartnerKbliMutation,
  useDeletePartnerKbliMutation,
  useListPartnerKblis,
} from "@/features/master-data/partner/data";
import type { PartnerKbli } from "@/features/master-data/partner/data/partner.types";
import { kbliService } from "@/features/master-data/kbli/data/kbli.service";
import { kbliQueryKeys } from "@/features/master-data/kbli/data/kbli.utils";
import type { KbliRecord } from "@/features/master-data/kbli/data/kbli.types";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { Visibility } from "@railfinance/core/components/visibility";
import { Button } from "@railfinance/core/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

interface PartnerKblisProps {
  partnerId: number;
  open?: boolean;
}

const KBLI_PAGE_SIZE = 1000;

export function PartnerKblis({ partnerId, open }: Readonly<PartnerKblisProps>) {
  const [selectedCode, setSelectedCode] = useState("");
  const [associationToRemove, setAssociationToRemove] = useState<PartnerKbli | null>(null);
  const partnerKblisQuery = useListPartnerKblis(
    partnerId,
    { page: 1, size: KBLI_PAGE_SIZE },
    { enabled: partnerId > 0 && open },
  );
  const kbliListParams = { search: "", page: 1, pageSize: KBLI_PAGE_SIZE };
  const masterKblisQuery = useQuery({
    queryKey: kbliQueryKeys.list(kbliListParams),
    queryFn: () => kbliService.list(kbliListParams),
    enabled: Boolean(open),
  });
  const createMutation = useCreatePartnerKbliMutation(partnerId, {
    onSuccess: () => setSelectedCode(""),
  });
  const deleteMutation = useDeletePartnerKbliMutation({
    onSuccess: () => setAssociationToRemove(null),
  });
  const associations = useMemo(
    () => partnerKblisQuery.data?.data?.content ?? [],
    [partnerKblisQuery.data?.data?.content],
  );
  const masterRecords = masterKblisQuery.data?.items ?? [];
  const associatedCodes = useMemo(
    () => new Set(associations.map((item) => item.code).filter(Boolean)),
    [associations],
  );
  const choices = masterRecords.filter(
    (record) => record.status === "ACTIVE" && !associatedCodes.has(record.code),
  );
  const masterByCode = new Map<string, KbliRecord>(masterRecords.map((record) => [record.code, record]));

  const handleAdd = () => {
    if (selectedCode) createMutation.mutate({ code: selectedCode, active: true });
  };
  const handleConfirmRemove = () => {
    if (associationToRemove) {
      deleteMutation.mutate({ partnerId, kbliId: associationToRemove.id });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Fields (KBLI)</CardTitle>
        <CardDescription>
          Associate this partner with active KBLI master records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-2">
            <label htmlFor="partner-kbli-choice" className="text-sm font-medium">
              Add business field
            </label>
            <Select value={selectedCode} onValueChange={setSelectedCode}>
              <SelectTrigger id="partner-kbli-choice" aria-label="Select active KBLI">
                <SelectValue placeholder="Select active KBLI" />
              </SelectTrigger>
              <SelectContent>
                {choices.map((record) => (
                  <SelectItem key={record.id} value={record.code}>
                    {record.code} — {record.businessFieldName} ({record.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Visibility permission={PARTNER_UPDATE_PERMISSION}>
            <Button
              type="button"
              onClick={handleAdd}
              disabled={!selectedCode || createMutation.isPending || choices.length === 0}
            >
              {createMutation.isPending ? "Adding…" : "Add KBLI"}
            </Button>
          </Visibility>
        </div>

        {(partnerKblisQuery.isLoading || masterKblisQuery.isLoading) && (
          <output className="block text-sm text-muted-foreground">Loading business fields…</output>
        )}
        {(partnerKblisQuery.isError || masterKblisQuery.isError) && (
          <p role="alert" className="text-sm text-destructive">Unable to load business fields. Refresh the page and try again.</p>
        )}
        {!masterKblisQuery.isLoading && !masterKblisQuery.isError && choices.length === 0 && (
          <p className="text-sm text-muted-foreground">No active KBLI options are available to add.</p>
        )}
        {!partnerKblisQuery.isLoading && !partnerKblisQuery.isError && associations.length === 0 && (
          <p className="text-sm text-muted-foreground">No business fields are associated with this partner.</p>
        )}

        {associations.length > 0 && (
          <ul className="divide-y rounded-md border">
            {associations.map((association) => {
              const record = association.code ? masterByCode.get(association.code) : undefined;
              const inactive = record?.status === "INACTIVE";
              let statusLabel = "Inactive association";
              if (inactive) {
                statusLabel = "Inactive in KBLI master · Existing association retained";
              } else if (association.active) {
                statusLabel = "Active";
              }
              return (
                <li key={association.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium">{association.code || "Unknown KBLI"} — {record?.businessFieldName ?? "Business field unavailable"}</p>
                    <p className="text-sm text-muted-foreground">
                      {record?.category ? `Category: ${record.category} · ` : ""}
                      {statusLabel}
                    </p>
                  </div>
                  <ActionButton
                    variant="delete"
                    label="Remove"
                    showLabel
                    onClick={() => setAssociationToRemove(association)}
                    permission={PARTNER_UPDATE_PERMISSION}
                    disabled={deleteMutation.isPending}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
      <ConfirmationModal
        open={Boolean(associationToRemove)}
        onOpenChange={(openState) => {
          if (!openState && !deleteMutation.isPending) setAssociationToRemove(null);
        }}
        title="Remove KBLI association"
        description={`Remove ${associationToRemove?.code ?? "this KBLI"} from this partner? The KBLI master record will not be changed.`}
        onConfirm={handleConfirmRemove}
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </Card>
  );
}
