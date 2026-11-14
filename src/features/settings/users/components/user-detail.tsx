import { cn, generateInitials } from "@railfinance/core/lib";
import { Avatar, AvatarFallback, AvatarImage } from "@railfinance/core/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import type { ReactNode } from "react";
import { hasUserDetailValue, type UserDetailEntry } from "./user-detail.utils";

/**
 * Renders a two column label/value grid. Entries without a value are skipped
 * so a section never shows a blank row.
 */
export function UserDetailGrid({
  entries,
}: Readonly<{ entries: UserDetailEntry[] }>) {
  const visible = entries.filter(hasUserDetailValue);
  if (visible.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {visible.map((entry) => (
        <div
          key={entry.label}
          className={cn("min-w-0", entry.full && "sm:col-span-2")}
        >
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {entry.label}
          </p>
          <p className="mt-0.5 text-sm font-medium break-words">
            {entry.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Card wrapper for a titled group of user information.
 */
export function UserInfoSection({
  title,
  icon,
  children,
  className,
}: Readonly<{
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}>) {
  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/**
 * Identity header of a user: avatar, name, contact and status badges.
 */
export function UserIdentityCard({
  name,
  email,
  photo,
  badges,
  action,
}: Readonly<{
  name: string;
  email?: string;
  photo?: string;
  badges?: ReactNode;
  action?: ReactNode;
}>) {
  return (
    <Card className="gap-0">
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback className="text-lg font-semibold">
              {generateInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1.5">
            <h2 className="truncate text-xl font-semibold">{name}</h2>
            {email && (
              <p className="truncate text-sm text-muted-foreground">{email}</p>
            )}
            {badges && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {badges}
              </div>
            )}
          </div>
        </div>
        {action && <div className="flex flex-wrap gap-2">{action}</div>}
      </CardContent>
    </Card>
  );
}
