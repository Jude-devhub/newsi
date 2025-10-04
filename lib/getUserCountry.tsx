// lib/getUserCountry.ts
import { headers } from "next/headers";

export async function getUserCountry(): Promise<string | null> {
  const h = await headers();

  // check a few common headers and take the first IP if there are many
  const forwarded =
    h.get("x-forwarded-for") ??
    h.get("x-real-ip") ??
    h.get("cf-connecting-ip") ??
    h.get("true-client-ip") ??
    "";
  const ip = (forwarded.split(",")[0] || "").trim() || undefined;
  console.log("detected ip:", ip);

  // fallback to a safe public IP (or consider returning null)
  const target = ip ? `https://ipapi.co/${ip}/json/` : `https://ipapi.co/json/`;
  console.log("fetching country from:", target);

try {
  const res = await fetch(target, { cache: "no-store" });
  if (!res.ok) throw new Error(`ipapi request failed: ${res.status}`);

  const data = await res.json();
  return data?.country_name ?? null;
} catch (err) {
  console.error("Error fetching country:", err);
  return null;
}

}
