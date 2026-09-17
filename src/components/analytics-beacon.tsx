"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Privacy-conscious, first-party analytics: records the path, the referrer host
 * (never the full URL) and a coarse device class. No cookies, no fingerprinting,
 * no personal data. Disable with NEXT_PUBLIC_ANALYTICS=off.
 */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ANALYTICS === "off") return;
    const device = window.matchMedia("(max-width: 767px)").matches
      ? "mobile"
      : window.matchMedia("(max-width: 1279px)").matches
        ? "tablet"
        : "desktop";
    let referrerHost = "";
    try {
      referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
    } catch {
      referrerHost = "";
    }
    fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: pathname, referrerHost, device }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
