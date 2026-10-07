import type { HTMLAttributes } from "react";
import { cn } from "@mb/shared";

export function Container({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}
