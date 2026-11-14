/**
 * Access Request Feature - Request Detail Modal
 * Shows request details and allows admin to approve/reject
 */

import {
  ACCESS_REQUEST_APPROVE_ACTION_TEXT,
  ACCESS_REQUEST_DETAIL_MODAL_TITLE,
  ACCESS_REQUEST_REJECT_ACTION_TEXT,
  RejectModal,
  type AccessRequestDetailResponse,
  type AccessRequestStatus,
} from "@/features/access-request";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import { cn } from "@railfinance/core/lib";
import { Modal } from "@railfinance/core/components/modal";
import { Separator } from "@railfinance/core/ui/separator";
import { useState } from "react";
import { ApproveModal } from "./approve-modal";

interface RequestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: AccessRequestDetailResponse | null;
  onSuccess?: () => void;
}

const getStatusBadgeVariant = (
  status: AccessRequestStatus,
): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "PENDING":
      return "default";
    case "APPROVED":
      return "secondary";
    case "REJECTED":
      return "destructive";
  }
};

export const RequestDetailModal = ({
  open,
  onOpenChange,
  request,
  onSuccess,
}: RequestDetailModalProps) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const handleSuccess = () => {
    setShowApproveModal(false);
    setShowRejectModal(false);
    onOpenChange(false);
    onSuccess?.();
  };

  if (!request) return null;

  const isStatusPending = request.status === "PENDING";
  const isApproved = request.status === "APPROVED";
  const isRejected = request.status === "REJECTED";

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={ACCESS_REQUEST_DETAIL_MODAL_TITLE}
        size="lg"
      >
        <div className="space-y-6">
          {/* Request Info Section */}
          <div className="space-y-4">
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">User Name</p>
                <p className="font-medium">{request.userName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIPP</p>
                <p className="font-medium">{request.userNipp || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={getStatusBadgeVariant(request.status)}
                  className="mt-1"
                >
                  {request.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requested At</p>
                <p className="font-medium">
                  {new Date(request.requestedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Modules Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Requested Modules</h3>
                  <div className="space-y-4">
                    {request.moduleNames.split(",").map((module: string) => (
                      <Badge
                        key={module.trim()}
                        variant="outline"
                        className="text-xs"
                      >
                        {module.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Roles Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Requested Roles</h3>
                  <div className="space-y-4">
                    {request?.roleNames?.split(",").map((role: string) => (
                      <Badge
                        key={role.trim()}
                        variant="outline"
                        className="text-xs"
                      >
                        {role.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {request.requestNotes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Request Notes
                  </p>
                  <p className="text-sm bg-muted p-3 rounded">
                    {request.requestNotes}
                  </p>
                </div>
              </>
            )}

            {isApproved && request.approvedAt && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved At</p>
                    <p className="font-medium">
                      {new Date(request.approvedAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approved By</p>
                    <p className="font-medium">{request.approvedBy || "-"}</p>
                  </div>
                </div>
              </>
            )}

            {request.responseNotes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Response Notes
                  </p>
                  <p
                    className={cn([
                      "text-sm p-3 rounded",
                      isRejected
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted",
                    ])}
                  >
                    {request.responseNotes}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          {isStatusPending && (
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(true)}
              >
                {ACCESS_REQUEST_REJECT_ACTION_TEXT}
              </Button>
              <Button onClick={() => setShowApproveModal(true)}>
                {ACCESS_REQUEST_APPROVE_ACTION_TEXT}
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <RejectModal
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        request={request}
        onSuccess={handleSuccess}
      />

      <ApproveModal
        open={showApproveModal}
        onOpenChange={setShowApproveModal}
        request={request}
        onSuccess={handleSuccess}
      />
    </>
  );
};
