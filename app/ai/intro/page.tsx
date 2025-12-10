"use client"

import { useRouter } from "next/navigation"
import { Bot, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AIIntroPage() {
  const router = useRouter()

  const enableAIMode = () => {
    localStorage.setItem("app-mode", "ai")
    router.push("/ai/chat")
  }

  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center py-20">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="flex flex-col items-center space-y-4 pt-10">
          <div className="bg-primary/10 p-6 rounded-full">
            <Bot className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">AI 모드 시작하기</CardTitle>
          <CardDescription className="text-xl max-w-lg mx-auto">
            AI 비서와 대화하며 이미지를 처리하고 워터마크를 생성해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-8 pb-10">
          <div className="grid gap-4 md:grid-cols-2 text-left w-full max-w-lg">
             <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                    <User className="h-4 w-4" /> 일반 모드
                </div>
                <p className="text-sm text-muted-foreground">직관적인 UI 컨트롤을 통해 직접 워터마크를 설정하고 적용합니다.</p>
             </div>
             <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-semibold text-primary">
                    <Bot className="h-4 w-4" /> AI 모드
                </div>
                <p className="text-sm text-muted-foreground">자연어 대화를 통해 AI가 설정을 도와주고 더 똑똑하게 작업을 처리합니다.</p>
             </div>
          </div>
          
          <Button size="lg" onClick={enableAIMode} className="w-full max-w-sm h-12 text-lg gap-2">
            AI 모드로 전환하기
            <ArrowRight className="h-4 w-4" />
          </Button>

           <p className="text-xs text-muted-foreground">
            * '일반 모드'로 언제든지 돌아갈 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
