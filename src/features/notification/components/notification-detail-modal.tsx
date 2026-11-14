import type { NotificationResponse } from "@/features/notification";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import { cn } from "@railfinance/core/lib";
import { Modal } from "@railfinance/core/components/modal";
import { Separator } from "@railfinance/core/ui/separator";
import { ExternalLink, Loader } from "lucide-react";

interface NotificationDetailModalProps {
  notification: NotificationResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead?: (id: number) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export const NotificationDetailModal = ({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
  onDelete,
  isLoading,
}: NotificationDetailModalProps) => {
  if (!notification) return null;

  const channelColors: Record<string, string> = {
    IN_APP: "bg-blue-100 text-blue-800",
    EMAIL: "bg-green-100 text-green-800",
    SMS: "bg-purple-100 text-purple-800",
    WHATSAPP: "bg-teal-100 text-teal-800",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SENT: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    RETRYING: "bg-orange-100 text-orange-800",
  };

  const getIcon = (iconName?: string) => {
    const icons: Record<string, string> = {
      eye: "👁️",
      leftarrow: "←",
      rightarrow: "→",
      delete: "🗑️",
      edit: "✏️",
      send: "📤",
      sync: "🔄",
    };
    return icons[iconName || ""] || "→";
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title="Notification Detail"
      size="lg"
      showCloseButton={true}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Notification Content Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Notification Content</h3>
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Category
                </div>
                <p className="text-sm">{notification.categoryName}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Title
                </div>
                <p className="text-sm font-medium">{notification.title}</p>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Message
                </div>
                <p className="text-sm whitespace-pre-wrap">
                  {notification.message}
                </p>
              </div>
              <div className="flex gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Channel
                  </div>
                  <Badge
                    className={cn(
                      "mt-2 font-medium",
                      channelColors[notification.channel],
                    )}
                  >
                    {notification.channel}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Status
                  </div>
                  <Badge
                    className={cn(
                      "mt-2 font-medium",
                      statusColors[notification.status],
                    )}
                  >
                    {notification.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Information Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Delivery Information</h3>
            <div className="grid gap-4 text-sm">
              {notification.recipientEmail && (
                <div>
                  <div className="font-medium text-muted-foreground">
                    Recipient Email
                  </div>
                  <p>{notification.recipientEmail}</p>
                </div>
              )}
              {notification.recipientPhone && (
                <div>
                  <div className="font-medium text-muted-foreground">
                    Recipient Phone
                  </div>
                  <p>{notification.recipientPhone}</p>
                </div>
              )}
              {notification.scheduledAt && (
                <div>
                  <div className="font-medium text-muted-foreground">
                    Scheduled At
                  </div>
                  <p>{new Date(notification.scheduledAt).toLocaleString()}</p>
                </div>
              )}
              {notification.sentAt && (
                <div>
                  <div className="font-medium text-muted-foreground">
                    Sent At
                  </div>
                  <p>{new Date(notification.sentAt).toLocaleString()}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-muted-foreground">
                    Retry Count
                  </div>
                  <p>
                    {notification.retryCount} / {notification.maxRetries}
                  </p>
                </div>
                {notification.nextRetryAt && (
                  <div>
                    <div className="font-medium text-muted-foreground">
                      Next Retry At
                    </div>
                    <p>{new Date(notification.nextRetryAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
              {notification.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="font-medium text-red-900">Error Message</div>
                  <p className="text-red-800 text-sm">
                    {notification.errorMessage}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Section */}
          {notification.metadata && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-4">Metadata</h3>
                <div className="space-y-4">
                  {/* Links */}
                  {notification.metadata.links &&
                    notification.metadata.links.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Links
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {notification.metadata.links.map((link) => (
                            <a
                              key={link.key}
                              href={link.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 rounded text-blue-700 hover:bg-blue-100 text-sm"
                            >
                              {link.key}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Actions */}
                  {notification.metadata.actions &&
                    notification.metadata.actions.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Actions
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {notification.metadata.actions.map((action) => (
                            <Button
                              key={action.key}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (action.url) {
                                  globalThis.location.href = action.url;
                                }
                              }}
                              className="gap-2"
                            >
                              <span>{getIcon(action.icon)}</span>
                              <span>{action.label || action.key}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Variables */}
                  {notification.metadata.variables &&
                    Object.keys(notification.metadata.variables).length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Variables
                        </div>
                        <div className="mt-2 space-y-2">
                          {Object.entries(notification.metadata.variables).map(
                            ([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-sm">{key}:</span>
                                <span className="text-sm font-medium">
                                  {String(value)}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Read State Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Read State</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <div className="font-medium text-muted-foreground">Is Read</div>
                <p>
                  <Badge
                    className={
                      notification.isRead
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-600 text-white"
                    }
                  >
                    {notification.isRead ? "Read" : "Unread"}
                  </Badge>
                </p>
              </div>
              {notification.readAt && (
                <div>
                  <div className="font-medium text-muted-foreground">
                    Read At
                  </div>
                  <p>{new Date(notification.readAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Audit Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Audit</h3>
            <div className="grid gap-4 text-sm">
              <div>
                <div className="font-medium text-muted-foreground">
                  Created By
                </div>
                <p>{notification.createdBy}</p>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">
                  Created At
                </div>
                <p>{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
              {notification.updatedBy && (
                <div>
                  <div className="font-medium text-muted-foreground">
                    Updated By
                  </div>
                  <p>{notification.updatedBy}</p>
                </div>
              )}
              <div>
                <div className="font-medium text-muted-foreground">
                  Updated At
                </div>
                <p>{new Date(notification.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            {!notification.isRead && onMarkAsRead && (
              <Button
                onClick={() => onMarkAsRead(notification.id)}
                variant="outline"
              >
                Mark as Read
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(notification.id)}
                variant="destructive"
              >
                Delete
              </Button>
            )}
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
