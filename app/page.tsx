"use client"

import WatermarkGenerator from "@/components/watermark-generator";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const mode = localStorage.getItem("app-mode")
    if (mode === "ai") {
      router.push("/ai/chat")
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {/* Header/Nav can go here if needed */}
      </div>

      <div className="relative flex place-items-center w-full">
        <WatermarkGenerator />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {/* Footer/Info can go here */}
      </div>
    </main>
  );
}
