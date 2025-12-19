import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import type { DashboardCRBasic } from "@/types/dashboard";
import type { RequestStatus } from "@/types/request";

import { RequestStatusBadge } from "@/components/RequestStatusBadge";

const formatRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

interface UserRequestTableProps {
  data: DashboardCRBasic[];
}

export const UserRequestTable = ({ data }: UserRequestTableProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (id: string) => {
    navigate(`/requests/${id}`, {
      state: { from: location },
    });
  };

  return (
    <div className="rounded-md border bg-white mx-auto shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[600px] md:min-w-full">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-20 text-left pl-5 font-bold">
                ID
              </TableHead>
              <TableHead className="text-center font-bold">
                Change Request Title
              </TableHead>
              <TableHead className="w-[120px] text-center font-bold">
                Status
              </TableHead>
              <TableHead className="w-[150px] whitespace-nowrap font-bold">
                Last Update
              </TableHead>
              <TableHead className="w-[1%] whitespace-nowrap font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No recent requests found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="w-20 text-left pl-5">
                    <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md inline-block max-w-20 sm:max-w-full truncate md:whitespace-nowrap">
                      {item.id}
                    </span>
                  </TableCell>

                  <TableCell className="text-center font-medium max-w-[200px] truncate">
                    {item.title}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <RequestStatusBadge
                        status={item.status as RequestStatus}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap text-center">
                    {item.updatedAt ? formatRelativeTime(item.updatedAt) : "-"}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavigate(item.id)}
                      className="whitespace-nowrap hover:bg-primary/10 hover:text-primary"
                    >
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline-block">
                          View Details
                        </span>
                      </div>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
