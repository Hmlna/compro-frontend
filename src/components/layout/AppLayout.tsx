import { Outlet } from "react-router";
import { Bell, LayoutDashboard, Library, Plus } from "lucide-react";
// import { useAuth } from "../../auth/AuthProvider";
import Sidebar, { SidebarItem } from "@/components/layout/Sidebar";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function AppLayout() {
  // const { user } = useAuth();
  const {
    canAccessDashboard,
    canAccessRequests,
    canAccessManager,
    canAccessVP,
    canAccessMapping,
    canAccessDev,
  } = useRoleAccess();

  function handleNotification() {
    alert("Notification clicked");
  }

  return (
    <div className="flex min-h-screen">
      <TooltipProvider>
        {/* --- SIDEBAR --- */}
        <Sidebar>
          {canAccessDashboard && (
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              to="/dashboard"
            />
          )}
          {canAccessRequests && (
            <SidebarItem
              icon={<Plus size={20} />}
              text="New Request"
              to="/new-request"
            />
          )}
          {canAccessRequests && (
            <SidebarItem
              icon={<Library size={20} />}
              text="Requests"
              to="/requests"
            />
          )}
          {canAccessManager && (
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Manager"
              to="/manager"
            />
          )}
          {canAccessVP && (
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="VP"
              to="/vp"
            />
          )}
          {canAccessMapping && (
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Mapping"
              to="/mapping"
            />
          )}
          {canAccessDev && (
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dev"
              to="/developer"
            />
          )}
        </Sidebar>

        {/* --- MAIN CONTENT WITH HEADER --- */}
        <div className="flex-1 flex flex-col">
          {/* Header - with space for hamburger menu on mobile */}
          <header className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-30 pl-16 md:pl-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {/* {getPageTitle()} */}
              </h2>
              <div className="w-auto mr-5">
                <button onClick={handleNotification} className="cursor-pointer">
                  <Bell />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-white pt-20 md:pt-6">
            <Outlet />
          </main>
        </div>
      </TooltipProvider>
    </div>
  );
}
