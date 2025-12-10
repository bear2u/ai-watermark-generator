"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bot, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AIChatPage() {
  const router = useRouter()

  useEffect(() => {
    // Only check on mount to prevent flashing if possible, 
    // mainly for enforcing the mode.
    const mode = localStorage.getItem("app-mode")
    if (mode !== 'ai') {
        // Optional: could force redirect back to intro if they landed here accidentally
        // without setting the flag. But maybe permissive is better.
    }
  }, [])

  const disableAIMode = () => {
    localStorage.removeItem("app-mode")
    router.push("/")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="bg-muted p-6 rounded-full animate-bounce">
            <Bot className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">AI 채팅 화면 (준비중)</h1>
        <p className="text-muted-foreground max-w-md">
            이곳에서 AI 챗봇과 대화하며 워터마크 작업을 수행하게 됩니다.
            현재 기능 구현 준비 중입니다.
        </p>
      </div>
      
      <div className="border-t p-4 flex justify-center bg-muted/20">
         <Button variant="outline" onClick={disableAIMode}>
            <LogOut className="mr-2 h-4 w-4" />
            일반 모드로 돌아가기
         </Button>
      </div>
    </div>
  )
}
