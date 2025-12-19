interface DashboardHeaderProps {
  user: { name: string; role: string; division: string } | undefined;
}

export const DashboardHeader = ({ user }: DashboardHeaderProps) => (
  <div className="flex flex-col gap-2">
    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
    {user && (
      <p className="text-muted-foreground">
        Welcome,{" "}
        <span className="font-semibold text-foreground">{user.name}</span>
        <span className="text-xs ml-2 bg-muted px-2 py-0.5 rounded-full uppercase font-medium border">
          {user.role.replace("_", " ")} • {user.division}
        </span>
      </p>
    )}
  </div>
);
