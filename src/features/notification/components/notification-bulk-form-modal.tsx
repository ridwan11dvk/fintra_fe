import {
  createBulkNotificationSchema,
  useCreateBulkNotificationsMutation,
  useGetCategories,
  type CreateBulkNotificationFormData,
} from "@/features/notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Input } from "@railfinance/core/ui/input";
import { Modal } from "@railfinance/core/components/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { Textarea } from "@railfinance/core/ui/textarea";
import { toast } from "@railfinance/core/lib";
import { Loader, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

interface NotificationBulkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MetadataAction {
  key: string;
  label?: string;
  icon?: string;
  action?: string;
  url?: string;
}

interface MetadataLink {
  key: string;
  value: string;
}

export const NotificationBulkFormModal = ({
  isOpen,
  onClose,
}: NotificationBulkFormModalProps) => {
  const { control, handleSubmit, formState, reset, setValue } =
    useForm<CreateBulkNotificationFormData>({
      resolver: zodResolver(createBulkNotificationSchema),
      defaultValues: {
        categoryId: 0,
        title: "",
        message: "",
        channels: ["IN_APP"],
        userIds: [],
        userType: undefined,
        sendImmediately: true,
        metadata: {
          links: [],
          actions: [],
          variables: {},
        },
      },
    });

  const [metadataLinks, setMetadataLinks] = useState<MetadataLink[]>([]);
  const [metadataActions, setMetadataActions] = useState<MetadataAction[]>([]);
  const [newLink, setNewLink] = useState<MetadataLink>({ key: "", value: "" });
  const [newAction, setNewAction] = useState<MetadataAction>({
    key: "",
    label: "",
  });
  const [userIdInput, setUserIdInput] = useState<string>("");

  const { data: categoriesData } = useGetCategories();
  const createBulkMutation = useCreateBulkNotificationsMutation({
    onSuccess: () => {
      toast.success("Bulk notifications created successfully");
      handleClose();
    },
    onError: (error: Error) => {
      const message =
        (error as unknown as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ||
        error.message ||
        "Failed to create bulk notifications";
      toast.error(message);
    },
  });

  const channels = useWatch({ control, name: "channels" }) || [];
  const userIds = useWatch({ control, name: "userIds" }) || [];
  const categories = categoriesData?.data || [];

  const handleClose = () => {
    reset();
    setMetadataLinks([]);
    setMetadataActions([]);
    setNewLink({ key: "", value: "" });
    setNewAction({ key: "", label: "" });
    setUserIdInput("");
    onClose();
  };

  const handleAddLink = () => {
    if (newLink.key && newLink.value) {
      setMetadataLinks([...metadataLinks, newLink]);
      setNewLink({ key: "", value: "" });
    }
  };

  const handleRemoveLink = (key: string) => {
    setMetadataLinks(metadataLinks.filter((link) => link.key !== key));
  };

  const handleAddAction = () => {
    if (newAction.key) {
      setMetadataActions([...metadataActions, newAction]);
      setNewAction({ key: "", label: "" });
    }
  };

  const handleRemoveAction = (key: string) => {
    setMetadataActions(metadataActions.filter((action) => action.key !== key));
  };

  const handleAddUserId = () => {
    const id = Number(userIdInput);
    if (!Number.isNaN(id) && !userIds.includes(id)) {
      setValue("userIds", [...userIds, id]);
      setUserIdInput("");
    }
  };

  const handleRemoveUserId = (id: number) => {
    setValue(
      "userIds",
      userIds.filter((uid) => uid !== id),
    );
  };

  const handleChannelToggle = (channel: string) => {
    const notificationChannel = channel as
      | "IN_APP"
      | "EMAIL"
      | "SMS"
      | "WHATSAPP";
    const newChannels = channels.includes(notificationChannel)
      ? channels.filter((c) => c !== notificationChannel)
      : [...channels, notificationChannel];
    setValue("channels", newChannels);
  };

  const onSubmit = (data: CreateBulkNotificationFormData) => {
    const validIcons = new Set([
      "eye",
      "leftarrow",
      "rightarrow",
      "delete",
      "edit",
      "send",
      "sync",
    ]);
    const submitData = {
      ...data,
      metadata: {
        links: metadataLinks,
        actions: metadataActions.map((action) => ({
          ...action,
          icon:
            action.icon && validIcons.has(action.icon)
              ? (action.icon as
                  | "delete"
                  | "send"
                  | "sync"
                  | "eye"
                  | "leftarrow"
                  | "rightarrow"
                  | "edit")
              : undefined,
        })),
        variables: {},
      },
    };
    createBulkMutation.mutate(submitData);
  };

  // Update metadata when links/actions change
  useEffect(() => {
    const validIcons = new Set([
      "delete",
      "send",
      "sync",
      "eye",
      "leftarrow",
      "rightarrow",
      "edit",
    ]);

    const transformedActions = metadataActions.map((action) => ({
      ...action,
      icon: validIcons.has(action.icon ?? "")
        ? (action.icon as
            | "delete"
            | "send"
            | "sync"
            | "eye"
            | "leftarrow"
            | "rightarrow"
            | "edit")
        : undefined,
    }));

    setValue("metadata", {
      links: metadataLinks,
      actions: transformedActions,
      variables: {},
    });
  }, [metadataLinks, metadataActions, setValue]);

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleClose}
      title="Create Bulk Notifications"
      size="xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="bulk-notification-form"
            disabled={createBulkMutation.isPending}
          >
            {createBulkMutation.isPending && (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Bulk
          </Button>
        </div>
      }
    >
      <form
        id="bulk-notification-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Category */}
        <div>
          <div className="text-sm font-medium">Category *</div>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {formState.errors.categoryId && (
            <p className="text-sm text-red-600 mt-1">
              {formState.errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <div className="text-sm font-medium">Title *</div>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Notification title" />
            )}
          />
          {formState.errors.title && (
            <p className="text-sm text-red-600 mt-1">
              {formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <div className="text-sm font-medium">Message *</div>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Notification message"
                rows={4}
              />
            )}
          />
          {formState.errors.message && (
            <p className="text-sm text-red-600 mt-1">
              {formState.errors.message.message}
            </p>
          )}
        </div>

        {/* Channels */}
        <div>
          <div className="text-sm font-medium">Channels *</div>
          <div className="space-y-2 mt-2">
            {(["IN_APP", "EMAIL", "SMS", "WHATSAPP"] as const).map(
              (channel) => (
                <label key={channel} className="flex items-center gap-2">
                  <Checkbox
                    checked={channels.includes(channel)}
                    onCheckedChange={() => handleChannelToggle(channel)}
                  />
                  <span className="text-sm">{channel}</span>
                </label>
              ),
            )}
          </div>
          {formState.errors.channels && (
            <p className="text-sm text-red-600 mt-1">
              {formState.errors.channels.message}
            </p>
          )}
        </div>

        {/* Target Users */}
        <div>
          <div className="text-sm font-medium">Target Users (Optional)</div>
          <p className="text-xs text-muted-foreground mb-2">
            Leave empty to broadcast to all users
          </p>
          <div className="space-y-2">
            {userIds.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
              >
                <span className="text-sm">User ID: {id}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveUserId(id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                type="number"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="User ID"
              />
              <Button type="button" variant="outline" onClick={handleAddUserId}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* User Type */}
        {userIds.length > 0 && (
          <div>
            <div className="text-sm font-medium">User Type *</div>
            <Controller
              name="userType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNAL">Internal</SelectItem>
                    <SelectItem value="EXTERNAL">External</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.userType && (
              <p className="text-sm text-red-600 mt-1">
                {formState.errors.userType.message}
              </p>
            )}
          </div>
        )}

        {/* Send Immediately */}
        <div className="flex items-center gap-2">
          <Controller
            name="sendImmediately"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <div className="text-sm font-medium">Send Immediately</div>
        </div>

        {/* Metadata Links */}
        <div>
          <div className="text-sm font-medium">Metadata Links</div>
          <div className="space-y-2">
            {metadataLinks.map((link) => (
              <div
                key={`${link.key}-${link.value}`}
                className="flex gap-2 items-center"
              >
                <div className="flex-1 flex gap-2">
                  <Input value={link.key} disabled placeholder="Key" />
                  <Input value={link.value} disabled placeholder="Value/URL" />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveLink(link.key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={newLink.key}
                onChange={(e) =>
                  setNewLink({ ...newLink, key: e.target.value })
                }
                placeholder="Link key"
              />
              <Input
                value={newLink.value}
                onChange={(e) =>
                  setNewLink({ ...newLink, value: e.target.value })
                }
                placeholder="Link URL"
              />
              <Button type="button" variant="outline" onClick={handleAddLink}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Metadata Actions */}
        <div>
          <div className="text-sm font-medium">Metadata Actions</div>
          <div className="space-y-2">
            {metadataActions.map((action) => (
              <div
                key={`${action.key}-${action.url}`}
                className="flex gap-2 items-center"
              >
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <Input value={action.key} disabled placeholder="Key" />
                  <Input
                    value={action.label || ""}
                    disabled
                    placeholder="Label"
                  />
                  <Input
                    value={action.icon || ""}
                    disabled
                    placeholder="Icon"
                  />
                  <Input value={action.url || ""} disabled placeholder="URL" />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAction(action.key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-4 gap-2">
              <Input
                value={newAction.key}
                onChange={(e) =>
                  setNewAction({ ...newAction, key: e.target.value })
                }
                placeholder="Action key"
              />
              <Input
                value={newAction.label || ""}
                onChange={(e) =>
                  setNewAction({ ...newAction, label: e.target.value })
                }
                placeholder="Label"
              />
              <Select
                value={newAction.icon || ""}
                onValueChange={(value) =>
                  setNewAction({ ...newAction, icon: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="eye">eye</SelectItem>
                  <SelectItem value="leftarrow">leftarrow</SelectItem>
                  <SelectItem value="rightarrow">rightarrow</SelectItem>
                  <SelectItem value="delete">delete</SelectItem>
                  <SelectItem value="edit">edit</SelectItem>
                  <SelectItem value="send">send</SelectItem>
                  <SelectItem value="sync">sync</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" onClick={handleAddAction}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
