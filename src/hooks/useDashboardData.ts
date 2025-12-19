import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/api/dashboard";
import { useMemo } from "react";
import { ROLE_STATS_CONFIG } from "@/pages/config/dashboardStatsConfig";

export const useDashboardData = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    refetchInterval: 5000,
  });

  const dData = dashboardData?.data;
  const role = dData?.user.role;

  const listItems = useMemo(
    () => dData?.recentCRs || dData?.pendingCRs || dData?.assignedCRs || [],
    [dData]
  );

  const statsToRender = useMemo(() => {
    if (!role) return [];
    const currentStats = dData?.stats || {};
    const config = ROLE_STATS_CONFIG[role] || [];
    return config.map((item) => ({
      ...item,
      // @ts-expect-error - dynamic access to stats object
      value: currentStats[item.dataKey] || 0,
    }));
  }, [role, dData]);

  return {
    user: dData?.user,
    role,
    stats: statsToRender,
    listItems,
    workload: dData?.developerWorkload,
    isLoading,
  };
};
