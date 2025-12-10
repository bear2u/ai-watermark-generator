"use client"

import Link from "next/link"
import { Bot, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-6xl mx-auto px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              AI 이미지 워터마크 적용기
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/ai/intro" title="Switch to AI Mode">
                    <Bot className="h-5 w-5" />
                    <span className="sr-only">Switch to AI Mode</span>
                </Link>
             </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
