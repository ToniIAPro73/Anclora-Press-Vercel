"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/data-display/badge"
import { Separator } from "@/components/ui/layout/separator"
import { ScrollArea } from "@/components/ui/layout/scroll-area"
import {
  FileText,
  Sparkles,
  Download,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  Printer,
  Users,
  Shield,
  Database,
  Zap,
  Upload,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AIAssistant } from "@/components/ai-assistant"
import { ProjectSidebar } from "@/components/project-sidebar"
import { LivePreview } from "@/components/live-preview"
import { ExportModal } from "@/components/export-modal"
import { MetadataPanel } from "@/components/metadata-panel"
import { CollaborationPanel } from "@/components/collaboration-panel"
import { ImportModal } from "@/components/import-modal"
import { FormattingToolbar } from "@/components/formatting-toolbar"
import { RichTextEditor, type RichTextEditorRef } from "@/components/rich-text-editor"
import Image from "next/image"

export default function AncloraPress() {
  const [content, setContent] = useState(`<h1>Mi Primera Novela</h1>

<h2>Capítulo 1: El Comienzo</h2>

<p>Era una mañana como cualquier otra cuando todo cambió. El sol se filtraba a través de las cortinas de mi pequeño apartamento, creando patrones de luz y sombra que danzaban sobre las páginas en blanco de mi escritorio.</p>

<p>Había soñado con este momento durante años: sentarme frente a la pantalla y comenzar a escribir la historia que había estado gestándose en mi mente. Pero ahora que el momento había llegado, las palabras parecían esquivas, como mariposas que se alejan justo cuando intentas atraparlas.</p>

<p><em>"Cada gran historia comienza con una sola palabra"</em>, me recordé a mí mismo, y comencé a escribir...</p>`)
  const [selectedDevice, setSelectedDevice] = useState<"kindle" | "tablet" | "desktop" | "print">("kindle")
  const [showAI, setShowAI] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)

  // Calculate word count and reading time
  const updateWordCount = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")
    const words = plainText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
    setReadingTime(Math.ceil(words.length / 200))
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    updateWordCount(value)
  }

  const handleContentImport = (importedContent: string) => {
    setContent(importedContent)
    updateWordCount(importedContent)

    // Check if imported content contains multiple chapters for future sidebar integration
    const chapterMatches = importedContent.match(/<h2[^>]*>([^<]+)<\/h2>/g)
    if (chapterMatches && chapterMatches.length > 1) {
      console.log(`[v0] Imported content contains ${chapterMatches.length} chapters`)
      // Future: Update sidebar with detected chapters
    }
  }

  const editorRef = useRef<RichTextEditorRef>(null)

  return (
    <div className="min-h-screen bg-background fade-in">
      {/* Header */}
      <header className="border-b border-border glass-panel">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image src="/images/anclora-press-logo.png" alt="Anclora Press" fill className="object-cover" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-xl text-foreground">Anclora Press</h1>
                <p className="text-xs text-muted-foreground">Editor Híbrido Profesional</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowImport(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Importar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCollaboration(!showCollaboration)}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Colaborar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowMetadata(!showMetadata)} className="gap-2">
              <Database className="h-4 w-4" />
              Metadatos
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAI(!showAI)} className="gap-2">
              <Sparkles className="h-4 w-4" />
              IA Avanzada
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowExport(true)} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <ProjectSidebar />

        {/* Main Editor Area */}
        <div className="flex-1 flex">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <div className="border-b border-border p-4 glass-panel">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="gap-1">
                    <FileText className="h-3 w-3" />
                    Capítulo 1
                  </Badge>
                  <span className="text-sm text-muted-foreground">{wordCount} palabras</span>
                  <span className="text-sm text-muted-foreground">• {readingTime} min lectura</span>
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Shield className="h-3 w-3" />
                    EPUB/A Compatible
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Zap className="h-4 w-4" />
                    Análisis IA
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <FormattingToolbar content={content} onContentChange={handleContentChange} editorRef={editorRef} />

            <div className="flex-1 p-6 slide-in-right">
              <RichTextEditor
                ref={editorRef}
                content={content}
                onContentChange={handleContentChange}
                placeholder="Comienza a escribir tu historia... Anclora Press te ayudará con IA avanzada, análisis estilométrico y preservación digital profesional."
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="w-80 border-l border-border glass-panel">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Vista Previa Profesional</h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant={selectedDevice === "kindle" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDevice("kindle")}
                    className="h-8 w-8 p-0"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedDevice === "tablet" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDevice("tablet")}
                    className="h-8 w-8 p-0"
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedDevice === "desktop" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDevice("desktop")}
                    className="h-8 w-8 p-0"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedDevice === "print" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDevice("print")}
                    className="h-8 w-8 p-0"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {selectedDevice === "kindle" && "Kindle Paperwhite"}
                {selectedDevice === "tablet" && 'iPad 10.9"'}
                {selectedDevice === "desktop" && "Desktop 1920px"}
                {selectedDevice === "print" && "Print A5"}
              </Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
              <LivePreview content={content} device={selectedDevice} />
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Enhanced AI Assistant */}
      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} content={content} />

      <MetadataPanel isOpen={showMetadata} onClose={() => setShowMetadata(false)} />
      <CollaborationPanel isOpen={showCollaboration} onClose={() => setShowCollaboration(false)} />

      {/* Import Modal */}
      <ImportModal isOpen={showImport} onClose={() => setShowImport(false)} onImport={handleContentImport} />

      {/* Export Modal */}
      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} />

      {/* Enhanced Status Bar */}
      <div className="border-t border-border glass-panel px-6 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Guardado automático • Preservación EPUB/A</span>
            <Separator orientation="vertical" className="h-4" />
            <span>
              {wordCount} palabras • {readingTime} min lectura
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>Última modificación: hace 2 min</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-primary">✓ Cumple código ético SEDIC</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span>IA Analizando</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Sincronizando</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
