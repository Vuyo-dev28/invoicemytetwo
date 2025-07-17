import { cn } from "@/lib/utils"

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      {...props}
    >
        <path d="M12 18.535a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>
        <path d="M22 12a10 10 0 1 0-20 0 10 10 0 0 0 20 0Z"></path>
        <path d="M12 12a6 6 0 1 0-6-6"></path>
    </svg>
  );
}
