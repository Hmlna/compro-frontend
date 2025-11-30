import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",

          "--success-bg": "rgb(99 102 241)", // indigo-500
          "--success-text": "#ffffff",
          "--error-bg": "rgb(239 68 68)", // red-500
          "--error-text": "#ffffff",
          "--info-bg": "rgb(59 130 246)", // blue-500
          "--info-text": "#ffffff",
          "--warning-bg": "rgb(245 158 11)", // amber-500
          "--warning-text": "#000000",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
