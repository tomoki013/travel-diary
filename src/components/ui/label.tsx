import * as React from "react";

import { cn } from "@/lib/utils";

// Radix Label を使わない自作版。`select-none` で二重クリック選択も抑止でき、
// htmlFor はネイティブ <label> が処理するため Server Component で十分。
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
