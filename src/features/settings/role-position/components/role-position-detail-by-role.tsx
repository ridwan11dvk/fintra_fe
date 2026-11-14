import { type RolePositionDetailByRoleResponse } from "@/features/settings/role-position";
import { Accordion, AccordionCard } from "@railfinance/core/ui/accordion";
import { Badge } from "@railfinance/core/ui/badge";
import { Label } from "@railfinance/core/ui/label";

interface RolePositionDetailByRoleProps {
  data: RolePositionDetailByRoleResponse;
}

export function RolePositionDetailByRole({
  data,
}: Readonly<RolePositionDetailByRoleProps>) {
  const { role, jobPositions } = data;

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["role-position-info"]}>
        <AccordionCard
          trigger="Role Position Information (By Role)"
          value="role-position-info"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="font-medium">
                  {role.code} - {role.name}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Job Positions</Label>
                <div className="flex flex-wrap gap-2">
                  {jobPositions.length > 0 ? (
                    jobPositions.map((jp) => (
                      <Badge key={jp.id} variant="outline">
                        {jp.code ?? "-"} - {jp.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      No job positions assigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AccordionCard>
      </Accordion>
    </div>
  );
}
