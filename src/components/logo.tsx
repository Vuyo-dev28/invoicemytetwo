import { cn } from "@/lib/utils"

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <path d="M9.5 3A2.5 2.5 0 0 1 12 5.5V6h-1v-.5A1.5 1.5 0 0 0 9.5 4H6v13.5A1.5 1.5 0 0 0 7.5 19H9v1h-.5a2.5 2.5 0 0 1-2.5-2.5V4h-1v15.5A2.5 2.5 0 0 1 2.5 22H2v-1h.5A1.5 1.5 0 0 0 4 19.5V12h1v7.5A2.5 2.5 0 0 0 7.5 22H11v-1h-1.5a1.5 1.5 0 0 1-1.5-1.5V11h1v8.5A1.5 1.5 0 0 0 10.5 21H12v1h-1.5a2.5 2.5 0 0 1-2.5-2.5V4h6.5A1.5 1.5 0 0 0 16 2.5V2h1v.5A2.5 2.5 0 0 1 14.5 5H13V4h1.5A1.5 1.5 0 0 1 16 5.5V13h-1V5.5A2.5 2.5 0 0 0 12.5 3H9.5z" />
    </svg>
  );
}
