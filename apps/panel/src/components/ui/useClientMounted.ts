"use client";

import * as React from "react";

export function useClientMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  return mounted;
}
