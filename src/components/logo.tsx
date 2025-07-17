import { cn } from "@/lib/utils"

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 108 96"
      fill="currentColor"
      className={cn("h-6 w-auto", className)}
      {...props}
    >
      <path d="M0 96V0h36l24 48L84 0h24v96h-20V31.5L68 63 48 24 28 63 8 31.5V96H0ZM20 28h8v16h-8V28Zm0 20a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" />
    </svg>
  );
}
