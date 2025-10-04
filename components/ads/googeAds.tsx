// src/components/Adsense.tsx
"use client";

import { useEffect } from "react";

export default function Adsense() {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-XXXXXXXXXX" // Replace with your AdSense ID
      data-ad-slot="1234567890" // Replace with your Ad slot ID
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
