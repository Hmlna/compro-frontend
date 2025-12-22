/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  User,
  Building2,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Eye,
} from "lucide-react";
import type { DashboardCRBasic } from "@/types/dashboard";
import { useLocation, useNavigate } from "react-router";

interface CardProps {
  item: DashboardCRBasic;
  onClick: (id: string) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// USER CARD
export const UserCard = ({ item, onClick }: CardProps) => (
  <Card className="flex flex-col hover:shadow-md transition-all border-l-4 border-l-gray-400">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
            {item.id}
          </span>
          <CardTitle className="text-base font-bold line-clamp-1">
            {item.title}
          </CardTitle>
        </div>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {(item.status || "PENDING").replace(/_/g, " ")}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="flex-1 text-sm pb-2 space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="w-3.5 h-3.5" />
        <span>Created: {formatDate(item.createdAt)}</span>
      </div>
      {item.updatedAt && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated: {formatDate(item.updatedAt)}</span>
        </div>
      )}
    </CardContent>
    <CardFooter className="pt-2">
      <Button
        variant="ghost"
        className="w-full justify-between hover:bg-gray-100"
        onClick={() => onClick(item.id)}
      >
        View Details <ArrowRight className="w-4 h-4" />
      </Button>
    </CardFooter>
  </Card>
);

// MANAGER UNIT CARD
export const ManagerCard = ({ item, onClick }: CardProps) => (
  <Card className="group relative flex flex-col bg-white">
    <CardHeader className="">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <span className="w-fit text-[10px] font-mono text-muted-foreground bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded inline-block">
            {item.id}
          </span>

          <CardTitle className="text-base font-bold leading-tight text-gray-900 line-clamp-2">
            {item.title}
          </CardTitle>
        </div>
        <Badge
          variant="secondary"
          className="shrink-0 bg-orange-100 text-orange-800 border-yellow-200 text-[10px] px-2 py-0.5 whitespace-nowrap"
        >
          PENDING MANAGER
        </Badge>
      </div>
    </CardHeader>

    <CardContent className="flex-1 text-sm pb-2 space-y-2">
      <div className="flex items-center gap-2 text-gray-600">
        <User className="w-3.5 h-3.5 text-muted-foreground" />
        <span>{item.requester}</span>
      </div>
      <div className="flex items-center gap-2 text-xs bg-gray-50 w-fit px-2 py-0.5 rounded">
        <Clock className="w-3 h-3" />
        <span>Submitted on {formatDate(item.createdAt)}</span>
      </div>
    </CardContent>

    <CardFooter>
      <Button
        className="w-full bg-white border-2 border-slate-100 text-slate-700 transition-all font-semibold justify-between"
        variant="outline"
        onClick={() => onClick(item.id)}
      >
        <span>Review Change Request</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </CardFooter>
  </Card>
);

// VP CARD
export const VPCard = ({ item, onClick }: CardProps) => (
  <Card className="group relative flex flex-col bg-white">
    <CardHeader className="">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <span className="w-fit text-[10px] font-mono text-muted-foreground bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded inline-block">
            {item.id}
          </span>

          <CardTitle className="text-base font-bold leading-tight text-gray-900 line-clamp-2">
            {item.title}
          </CardTitle>
        </div>
        <Badge
          variant="secondary"
          className="shrink-0 bg-orange-100 text-orange-800 border-yellow-200 text-[10px] px-2 py-0.5 whitespace-nowrap"
        >
          PENDING VP
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="flex-1 text-sm pb-2 space-y-2">
      <div className="flex items-center gap-2 text-gray-700">
        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-medium">{item.division}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <User className="w-3.5 h-3.5 text-muted-foreground" />
        <span>{item.requester}</span>
      </div>
      <div className="flex items-center gap-2 text-xs bg-gray-50 w-fit px-2 py-0.5 rounded">
        <Clock className="w-3 h-3" />
        <span>Submitted on {formatDate(item.createdAt)}</span>
      </div>
    </CardContent>

    <CardFooter>
      <Button
        className="w-full bg-white border-2 border-slate-100 text-slate-700 transition-all font-semibold justify-between"
        variant="outline"
        onClick={() => onClick(item.id)}
      >
        <span>Review Change Request</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </CardFooter>
  </Card>
);

// MANAGER IT CARD
export const ITManagerCard = ({ item, onClick }: CardProps) => (
  <Card className="group relative flex flex-col bg-white">
    <CardHeader className="">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <span className="w-fit text-[10px] font-mono text-muted-foreground bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded inline-block">
            {item.id}
          </span>

          <CardTitle className="text-base font-bold leading-tight text-gray-900 line-clamp-2">
            {item.title}
          </CardTitle>
        </div>
        <Badge
          variant="secondary"
          className="shrink-0 bg-orange-100 text-orange-800 border-yellow-200 text-[10px] px-2 py-0.5 whitespace-nowrap"
        >
          NEEDS MAPPING
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="flex-1 text-sm pb-2 space-y-2">
      <div className="flex items-center gap-2 text-gray-700">
        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-medium">{item.division}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <User className="w-3.5 h-3.5 text-muted-foreground" />
        <span>{item.requester}</span>
      </div>
      <div className="flex items-center gap-2 text-xs bg-gray-50 w-fit px-2 py-0.5 rounded">
        <Clock className="w-3 h-3" />
        <span>Last Update: {formatDate(item.updatedAt)}</span>
      </div>
    </CardContent>

    <CardFooter>
      <Button
        className="w-full bg-white border-2 border-slate-100 text-slate-700 transition-all font-semibold justify-between"
        variant="outline"
        onClick={() => onClick(item.id)}
      >
        <span>Review Change Request</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </CardFooter>
  </Card>
);

// DEVELOPER CARD
export const DeveloperCard = ({ item, onClick }: CardProps) => {
  const devItem = item as any;
  return (
    <Card className="group relative flex flex-col bg-white">
      <CardHeader className="">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <span className="w-fit text-[10px] font-mono text-muted-foreground bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded inline-block">
              {item.id}
            </span>

            <CardTitle className="text-base font-bold leading-tight text-gray-900 line-clamp-2">
              {devItem.title}
            </CardTitle>
          </div>
          {devItem.targetDate && (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-red-100">
              <AlertCircle className="w-3 h-3" />
              Due {formatDate(devItem.targetDate)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 text-sm pb-2 space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-medium">{item.division}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{item.requester}</span>
        </div>
        <div className="flex items-center gap-2 text-xs bg-gray-50 w-fit px-2 py-0.5 rounded">
          <Clock className="w-3 h-3" />
          <span>Assigned: {formatDate(devItem.assignedAt)}</span>
        </div>

        {devItem.notes && (
          <p className="text-xs text-gray-600 italic border-l-2 border-gray-300 pl-2 line-clamp-2">
            "{devItem.notes}"
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-white border-2 border-slate-100 text-slate-700 transition-all font-semibold justify-between"
          variant="outline"
          onClick={() => onClick(item.id)}
        >
          <span>View Assignment</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export const CompletedDevCard = ({ item, onClick }: CardProps) => {
  const devItem = item as any;
  return (
    <Card className="group relative flex flex-col border border-gray-200 bg-gray-50/50 opacity-80 hover:opacity-100 transition-opacity shadow-sm">
      <CardHeader className="">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <span className="w-fit text-[10px] font-mono text-gray-700/70 bg-gray-100/50 border border-gray-200 px-1.5 py-0.5 rounded inline-block">
              {item.id}
            </span>

            <CardTitle className="text-base font-bold leading-tight text-gray-600 line-through decoration-gray-300 line-clamp-2">
              {devItem.title}
            </CardTitle>
          </div>

          <span className="text-[10px] font-bold text-gray-700 bg-gray-100/50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-gray-200">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 text-sm pb-2 space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Building2 className="w-3.5 h-3.5 text-gray-600/50" />
          <span className="font-medium">{item.division}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-3.5 h-3.5 text-gray-600/50" />
          <span>{item.requester}</span>
        </div>
        <div className="flex items-center gap-2 text-xs bg-gray-100/50 text-gray-700/70 w-fit px-2 py-0.5 rounded">
          <Clock className="w-3 h-3" />
          <span>Assigned: {formatDate(devItem.assignedAt)}</span>
        </div>

        {devItem.notes && (
          <p className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2 line-clamp-2">
            "{devItem.notes}"
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full transition-all font-semibold justify-center"
          variant="outline"
          onClick={() => onClick(item.id)}
        >
          <Eye className="w-4 h-4 mr-2" />
          <span>View Record</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const RequestCardFactory = ({
  role,
  item,
}: {
  role: string;
  item: DashboardCRBasic;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (id: string) => {
    navigate(`/requests/${id}`, {
      state: { from: location },
    });
  };

  switch (role) {
    case "MANAGER":
      return <ManagerCard item={item} onClick={handleNavigate} />;
    case "VP":
      return <VPCard item={item} onClick={handleNavigate} />;
    case "MANAGER_IT":
      return <ITManagerCard item={item} onClick={handleNavigate} />;
    case "DEV":
      if (item.status === "COMPLETED") {
        return <CompletedDevCard item={item} onClick={handleNavigate} />;
      }
      return <DeveloperCard item={item} onClick={handleNavigate} />;
    case "USER":
    default:
      return <UserCard item={item} onClick={handleNavigate} />;
  }
};
