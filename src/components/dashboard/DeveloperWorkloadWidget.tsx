/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, UserCog, User } from "lucide-react";
import type { DashboardCRBasic } from "@/types/dashboard";

interface WorkloadWidgetProps {
  workload?: DashboardCRBasic[];
}

export const DeveloperWorkloadWidget = ({
  workload = [],
}: WorkloadWidgetProps) => {
  const sortedWorkload = [...workload].sort(
    (a, b) => (b.assignedCrs || 0) - (a.assignedCrs || 0)
  );

  return (
    <Card className="h-fit shadow-sm border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCog className="w-5 h-5 text-indigo-600" />
              Developer Workload
            </CardTitle>
            <CardDescription>Active CRs per developer</CardDescription>
          </div>
          <BarChart3 className="w-4 h-4 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {sortedWorkload.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active workloads found.
          </p>
        ) : (
          sortedWorkload.map((dev, index) => {
            const count = (dev as any).assignedCRs ?? dev.assignedCrs ?? 0;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 shrink-0">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none text-slate-700">
                      {dev.developer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      IT Developer
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className={`ml-auto font-mono text-xs px-2.5 py-0.5 ${getBadgeColor(
                    count
                  )}`}
                >
                  {count} Active
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

const getBadgeColor = (count: number) => {
  if (count === 0) return "bg-slate-100 text-slate-600 border-slate-200";
  if (count < 3) return "bg-green-100 text-green-700 border-green-200"; // Low load
  if (count < 5) return "bg-yellow-100 text-yellow-700 border-yellow-200"; // Medium load
  return "bg-red-100 text-red-700 border-red-200"; // High load
};
