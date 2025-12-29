import { ChevronFirst, ChevronLast, Command, LogOut, Menu } from "lucide-react";
// import logo from "@/assets/ticket.svg";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useRef,
} from "react";
import { NavLink } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SidebarContextType = {
  expanded: boolean;
  isMobile: boolean;
};

const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  isMobile: false,
});

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { logout, user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);

  const [expanded, setExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarExpanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", JSON.stringify(expanded));
  }, [expanded]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 767;
      const wasMobile = isMobile;

      setIsMobile(mobile);

      if (mobile && !wasMobile) {
        setExpanded(false);
      }
      if (!mobile && wasMobile) {
        const saved = localStorage.getItem("sidebarExpanded");
        setExpanded(saved !== null ? JSON.parse(saved) : true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !expanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      const sidebarEl = sidebarRef.current;
      const target = e.target as Node;

      if (isLogoutDialogOpen) return;

      if (sidebarEl && !sidebarEl.contains(target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, expanded, isLogoutDialogOpen]);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && expanded && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          h-screen transition-transform duration-300 z-50
          ${isMobile ? "fixed top-0 left-0" : "sticky top-0"}
          ${isMobile && !expanded ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <nav className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
          <div className="p-4 pb-2 mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2 overflow-hidden transition-all">
              {/* <img
                src={logo}
                alt="Logo"
                className={`transition-all ${expanded ? "w-10" : "w-0"}`}
              /> */}
              <Command
                className={`transition-all ${expanded ? "w-10" : "w-0"}`}
              />
              <h1
                className={`text-xl font-semibold text-black transition-all ${
                  expanded ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                compro
              </h1>
            </div>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded, isMobile }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t border-gray-200 flex p-3">
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              } `}
            >
              <div className="leading-4">
                <h4 className="font-semibold text-black text-sm">
                  {user?.email}
                </h4>
              </div>
            </div>
            <AlertDialog
              open={isLogoutDialogOpen}
              onOpenChange={setIsLogoutDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <button
                  className="p-1 rounded hover:bg-gray-100 text-red-500 transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut size={20} />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will end your current session.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      logout();
                      window.location.replace(
                        `${import.meta.env.BASE_URL}login?logged_out=1`
                      );
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Log out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </nav>
      </aside>
    </>
  );
}

type SidebarItemProps = {
  icon: ReactNode;
  text: string;
  to: string;
  alert?: boolean;
};

export function SidebarItem({ icon, text, to, alert }: SidebarItemProps) {
  const { expanded, isMobile } = useContext(SidebarContext);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group",
          isActive
            ? "bg-gray-100 text-black font-semibold"
            : "hover:bg-gray-100 text-gray-600 hover:text-black",
        ].join(" ")
      }
    >
      {icon}
      <span
        className={`overflow-hidden transition-all whitespace-nowrap ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-black ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
      {!expanded && !isMobile && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6 
          bg-black text-white text-sm 
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap pointer-events-none z-50
        `}
        >
          {text}
        </div>
      )}
    </NavLink>
  );
}
