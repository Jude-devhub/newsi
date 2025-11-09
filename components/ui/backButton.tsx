"use client";

import { useRouter } from "next/navigation";

export default function BackButton({
  label = "← Go back",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`text-blue-600 dark:text-blue-400 hover:underline ${className}`}
    >
      {label}
    </button>
  );
}
