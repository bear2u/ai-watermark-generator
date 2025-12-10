"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, Download, Type, Palette, Layout, Droplets, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type Position = "tl" | "tr" | "bl" | "br"

export default function WatermarkGenerator() {
  const [image, setImage] = useState<string | null>(null)
  
  // Customization State
  const [watermarkText, setWatermarkText] = useState("AI 생성 이미지")
  const [textColor, setTextColor] = useState("#ffffff")
  const [textOpacity, setTextOpacity] = useState(100)
  
  const [bgColor, setBgColor] = useState("#000000")
  const [bgOpacity, setBgOpacity] = useState(0)
  
  const [position, setPosition] = useState<Position>("br")
  
  const [isOpen, setIsOpen] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("watermark-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        if (parsed.watermarkText !== undefined) setWatermarkText(parsed.watermarkText)
        if (parsed.textColor !== undefined) setTextColor(parsed.textColor)
        if (parsed.textOpacity !== undefined) setTextOpacity(parsed.textOpacity)
        if (parsed.bgColor !== undefined) setBgColor(parsed.bgColor)
        if (parsed.bgOpacity !== undefined) setBgOpacity(parsed.bgOpacity)
        if (parsed.position !== undefined) setPosition(parsed.position)
        if (parsed.isOpen !== undefined) setIsOpen(parsed.isOpen)
      } catch (e) {
        console.error("Failed to parse settings", e)
      }
    }
  }, [])

  // Save settings to localStorage on change
  useEffect(() => {
    const settings = {
        watermarkText,
        textColor,
        textOpacity,
        bgColor,
        bgOpacity,
        position,
        isOpen
    }
    localStorage.setItem("watermark-settings", JSON.stringify(settings))
  }, [watermarkText, textColor, textOpacity, bgColor, bgOpacity, position, isOpen])

  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader()
       reader.onload = (event) => {
         if (event.target?.result) {
           setImage(event.target.result as string)
         }
       }
       reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
  }

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = new Image()
      
      img.onload = () => {
        // Set canvas to full image resolution
        canvas.width = img.width
        canvas.height = img.height
        
        if (ctx) {
          // Draw original image
          ctx.drawImage(img, 0, 0)
          
          if (watermarkText) {
            // Configure Font
            const fontSize = Math.max(20, Math.floor(img.width * 0.03)) 
            ctx.font = `bold ${fontSize}px sans-serif`
            ctx.textBaseline = "top" // Use top for easier custom generic positioning math
            
            // Measure text
            const textMetrics = ctx.measureText(watermarkText)
            const textWidth = textMetrics.width
            const textHeight = fontSize // Approx height
            
            // Padding
            const paddingX = Math.floor(fontSize * 0.6)
            const paddingY = Math.floor(fontSize * 0.4)
            
            const boxWidth = textWidth + (paddingX * 2)
            const boxHeight = textHeight + (paddingY * 2)
            
            const margin = Math.floor(img.width * 0.02)
            
            let x = 0
            let y = 0
            
            // Calculate Position
            switch (position) {
              case "tl":
                x = margin
                y = margin
                break
              case "tr":
                x = img.width - boxWidth - margin
                y = margin
                break
              case "bl":
                x = margin
                y = img.height - boxHeight - margin
                break
              case "br":
              default:
                x = img.width - boxWidth - margin
                y = img.height - boxHeight - margin
                break
            }
            
            // Draw Background
            if (bgOpacity > 0) {
              ctx.fillStyle = hexToRgba(bgColor, bgOpacity)
              // We can add rounded corners here if we want to be fancy, but rect is fine
              ctx.fillRect(x, y, boxWidth, boxHeight)
            }
            
            // Draw Text
            ctx.fillStyle = hexToRgba(textColor, textOpacity)
            
            // Text Shadow only if no background intensity or high text opacity to make it readable
            if (bgOpacity < 50) {
                ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
                ctx.shadowBlur = 4
                ctx.shadowOffsetX = 1
                ctx.shadowOffsetY = 1
            } else {
                ctx.shadowColor = "transparent"
            }

            ctx.fillText(watermarkText, x + paddingX, y + paddingY + (fontSize * 0.1)) // Slight vertical correction
          }
          setIsLoaded(true)
        }
      }
      img.src = image
    }
  }, [image, watermarkText, textColor, textOpacity, bgColor, bgOpacity, position])

  const handleDownload = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "watermarked-image.png"
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto pb-10">
      
      {/* Preview Section - Order 1 on Mobile */}
      <Card className="lg:col-span-2 shadow-sm order-1 lg:order-2 border-0 bg-transparent shadow-none lg:shadow-md lg:bg-card lg:border overflow-hidden">
         <CardHeader className="hidden lg:block">
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0 lg:p-6 flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg min-h-[300px] lg:min-h-[600px] transition-all">
           {!image && (
            <div className="text-center text-muted-foreground flex flex-col items-center p-10">
              <Upload className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg">Upload an image to start</p>
            </div>
          )}
          
          <div className={`relative w-full h-full flex justify-center items-center max-h-[50vh] lg:max-h-full ${!image ? 'hidden' : 'flex'}`}>
            <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-[50vh] lg:max-h-full h-auto w-auto object-contain shadow-lg rounded-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Controls Section - Order 2 on Mobile */}
      <Card className="lg:col-span-1 h-fit shadow-md order-2 lg:order-1">
        <CardHeader>
          <CardTitle className="text-xl">AI 이미지 워터마크 적용기</CardTitle>
          <CardDescription>Customize your watermark</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Image Upload Dropzone */}
          {/* Hidden Input for Click */}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
          
          <div 
            className={`
                border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                ${isDragging ? 'border-primary bg-primary/10' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
             <Upload className={`h-8 w-8 mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
             <p className="text-sm font-medium">Click to upload or drag and drop</p>
             <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
          </div>

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex w-full justify-between">
                Advanced Settings
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4 border rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/50">
                <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="bg">Back</TabsTrigger>
                    <TabsTrigger value="pos">Layout</TabsTrigger>
                    </TabsList>
                    
                    {/* Text Settings */}
                    <TabsContent value="text" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Content</Label>
                        <div className="relative">
                        <Type className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                            className="pl-9" 
                            value={watermarkText} 
                            onChange={(e) => setWatermarkText(e.target.value)} 
                        />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="flex justify-between">
                        Color 
                        <span className="text-xs text-muted-foreground">{textColor}</span>
                        </Label>
                        <div className="flex gap-2">
                        <Input 
                            type="color" 
                            className="w-full h-10 p-1 cursor-pointer" 
                            value={textColor} 
                            onChange={(e) => setTextColor(e.target.value)} 
                        />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex justify-between">
                        Opacity
                        <span className="text-xs text-muted-foreground">{textOpacity}%</span>
                        </Label>
                        <Slider 
                        value={[textOpacity]} 
                        onValueChange={(val) => setTextOpacity(val[0])} 
                        max={100} 
                        step={1} 
                        />
                    </div>
                    </TabsContent>

                    {/* Background Settings */}
                    <TabsContent value="bg" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label className="flex justify-between">
                        Color
                        <span className="text-xs text-muted-foreground">{bgColor}</span>
                        </Label>
                        <Input 
                        type="color" 
                        className="w-full h-10 p-1 cursor-pointer" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex justify-between">
                        Opacity
                        <span className="text-xs text-muted-foreground">{bgOpacity}%</span>
                        </Label>
                        <Slider 
                        value={[bgOpacity]} 
                        onValueChange={(val) => setBgOpacity(val[0])} 
                        max={100} 
                        step={1} 
                        />
                    </div>
                    </TabsContent>
                    
                    {/* Position Settings */}
                    <TabsContent value="pos" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Position</Label>
                        <Select value={position} onValueChange={(val: Position) => setPosition(val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tl">Top Left</SelectItem>
                            <SelectItem value="tr">Top Right</SelectItem>
                            <SelectItem value="bl">Bottom Left</SelectItem>
                            <SelectItem value="br">Bottom Right</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    </TabsContent>
                </Tabs>
            </CollapsibleContent>
          </Collapsible>

          <Button onClick={handleDownload} disabled={!image || !isLoaded} className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
