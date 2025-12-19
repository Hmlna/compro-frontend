import { Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/DashboardStatsGrid";
import { UserRequestTable } from "@/components/dashboard/UserRequestTable";
import { RequestCardFactory } from "@/components/dashboard/DashboardRequestCards";
import { DeveloperWorkloadWidget } from "@/components/dashboard/DeveloperWorkloadWidget";

const DashboardPage = () => {
  const { user, role, stats, listItems, workload, isLoading } =
    useDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardHeader user={user} />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const HeaderSection = (
    <>
      <DashboardHeader user={user} />
      <StatsGrid stats={stats} />
    </>
  );

  const RequestListSection = (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">
        {role === "USER"
          ? "Recent Change Requests"
          : "Tasks Requiring Attention"}
      </h2>

      {role === "USER" ? (
        <UserRequestTable data={listItems} />
      ) : listItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50/50">
          <p className="text-muted-foreground">No items found.</p>
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            role === "MANAGER_IT"
              ? "grid-cols-1 lg:grid-cols-2"
              : "md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {listItems.map((item) => (
            <RequestCardFactory
              key={item.id}
              role={role || "USER"}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Manager IT Layout
  if (role === "MANAGER_IT") {
    return (
      <div className="space-y-6">
        {HeaderSection}
        <div className="flex flex-col xl:flex-row-reverse gap-6 items-start relative">
          <aside className="w-full xl:w-80 shrink-0 xl:sticky xl:top-24 space-y-6 transition-all">
            <div className="bg-slate-50/80 p-1 rounded-xl border border-slate-200 shadow-sm">
              <DeveloperWorkloadWidget workload={workload} />
            </div>
          </aside>
          <div className="flex-1 w-full">{RequestListSection}</div>
        </div>
      </div>
    );
  }

  // Standard Layout (User, VP, Manager Unit, Dev)
  return (
    <div className="space-y-8">
      {HeaderSection}
      {RequestListSection}
    </div>
  );
};

export default DashboardPage;
