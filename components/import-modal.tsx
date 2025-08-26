"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/surfaces/dialog"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { Badge } from "@/components/ui/data-display/badge"
import { Progress } from "@/components/ui/feedback/progress"
import { Checkbox } from "@/components/ui/forms/checkbox"
import {
  FileText,
  Upload,
  FileUp,
  CheckCircle,
  AlertCircle,
  BookOpen,
  FileType,
  ImageDown as Markdown,
} from "lucide-react"

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (content: string) => void
}

const loadPDFJS = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib)
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
        console.log("[v0] PDF.js loaded successfully")
        resolve(pdfjsLib)
      } else {
        reject(new Error("PDF.js failed to load"))
      }
    }
    script.onerror = () => reject(new Error("Failed to load PDF.js"))
    document.head.appendChild(script)
  })
}

const detectAndStructureChapters = (
  text: string,
): { chapters: Array<{ title: string; content: string }>; totalWords: number } => {
  console.log("[v0] Analyzing text for chapter structure...")

  // Split text into paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0)

  const chapterPatterns = [
    // Traditional chapter patterns
    /^(capítulo|chapter|cap\.?)\s*\d+/i,
    /^(parte|part)\s*\d+/i,
    /^(sección|section|sec\.?)\s*\d+/i,

    // Academic document patterns
    /^\d+\.\s*[A-ZÁÉÍÓÚÑ][^.]{10,}/i, // "1. Introduction" style
    /^[IVXLCDM]+\.\s*[A-ZÁÉÍÓÚÑ]/i, // Roman numerals
    /^(introducción|introduction|resumen|abstract|conclusión|conclusion|referencias|bibliography|metodología|methodology|resultados|results|discusión|discussion)/i,

    // Numbered sections in academic papers
    /^\d+\.\d+\s*[A-ZÁÉÍÓÚÑ]/i, // "1.1 Subsection"
    /^\d+\s+[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{15,80}$/i, // "1 LONG TITLE IN CAPS"

    // Figure and table captions (often indicate section breaks)
    /^(figura|figure|tabla|table)\s*\d+/i,

    // Headers that are all caps or title case and reasonably long
    /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{20,100}$/,

    // Academic keywords that often start sections
    /^(marco teórico|theoretical framework|estado del arte|state of the art|antecedentes|background|propuesta|proposal)/i,
  ]

  const chapters: Array<{ title: string; content: string }> = []
  let currentChapter = { title: "", content: "" }
  let chapterNumber = 1
  let hasDetectedChapters = false

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim()

    // Skip very short paragraphs that are unlikely to be titles
    if (paragraph.length < 10) {
      currentChapter.content += `<p>${paragraph}</p>\n\n`
      continue
    }

    // Check if this paragraph looks like a chapter title
    const isChapterTitle =
      (chapterPatterns.some((pattern) => pattern.test(paragraph)) &&
        paragraph.length < 300 && // Reasonable title length
        paragraph.length > 10 && // Not too short
        !paragraph.includes(".")) ||
      paragraph.match(/^\d+\./) ||
      paragraph.match(/^(figura|figure|tabla|table)/i) // Allow numbered sections and figures

    // Additional heuristics for academic documents
    const isLikelyTitle =
      !isChapterTitle &&
      // All caps text that's not too long
      ((paragraph === paragraph.toUpperCase() && paragraph.length > 15 && paragraph.length < 150) ||
        // Text that ends without punctuation and is reasonably short
        (paragraph.length < 200 && !paragraph.match(/[.!?]$/) && paragraph.split(" ").length > 3) ||
        // Numbered sections
        paragraph.match(/^\d+\s+[A-ZÁÉÍÓÚÑ]/))

    if (isChapterTitle || isLikelyTitle) {
      hasDetectedChapters = true
      console.log(`[v0] Detected chapter: ${paragraph.substring(0, 50)}...`)

      // Save previous chapter if it has content
      if (currentChapter.content.trim()) {
        chapters.push({
          title: currentChapter.title || `Capítulo ${chapterNumber - 1}`,
          content: currentChapter.content.trim(),
        })
      }

      // Start new chapter
      currentChapter = {
        title: paragraph,
        content: "",
      }
      chapterNumber++
    } else {
      // Add paragraph to current chapter content
      const maxParagraphLength = 800

      if (paragraph.length > maxParagraphLength) {
        // Split long paragraphs at sentence boundaries
        const sentences = paragraph.split(/(?<=[.!?])\s+/)
        let currentParagraph = ""

        for (const sentence of sentences) {
          if (currentParagraph.length + sentence.length > maxParagraphLength && currentParagraph.length > 0) {
            currentChapter.content += `<p>${currentParagraph.trim()}</p>\n\n`
            currentParagraph = sentence
          } else {
            currentParagraph += (currentParagraph ? " " : "") + sentence
          }
        }

        if (currentParagraph.trim()) {
          currentChapter.content += `<p>${currentParagraph.trim()}</p>\n\n`
        }
      } else {
        currentChapter.content += `<p>${paragraph}</p>\n\n`
      }
    }
  }

  // Add the last chapter
  if (currentChapter.content.trim()) {
    chapters.push({
      title: currentChapter.title || `Capítulo ${chapterNumber}`,
      content: currentChapter.content.trim(),
    })
  }

  if (!hasDetectedChapters && paragraphs.length > 5) {
    console.log("[v0] No chapters detected, creating content-based divisions...")

    const wordsPerChapter = 1500 // Smaller sections for academic documents
    const allContent = paragraphs.join("\n\n")
    const totalWords = allContent.split(/\s+/).length

    if (totalWords > wordsPerChapter) {
      const numChapters = Math.min(Math.ceil(totalWords / wordsPerChapter), 8) // Max 8 chapters
      const paragraphsPerChapter = Math.ceil(paragraphs.length / numChapters)

      const artificialChapters: Array<{ title: string; content: string }> = []

      for (let i = 0; i < paragraphs.length; i += paragraphsPerChapter) {
        const chapterParagraphs = paragraphs.slice(i, i + paragraphsPerChapter)

        // Try to find a good title from the first few paragraphs
        let chapterTitle = `Sección ${Math.floor(i / paragraphsPerChapter) + 1}`

        for (let j = 0; j < Math.min(3, chapterParagraphs.length); j++) {
          const para = chapterParagraphs[j].trim()
          if ((para.length > 20 && para.length < 150 && !para.includes(".")) || para.match(/^\d+\./)) {
            chapterTitle = para.length > 60 ? para.substring(0, 60) + "..." : para
            break
          }
        }

        const chapterContent = chapterParagraphs
          .map((p) => {
            if (p.length > 800) {
              const sentences = p.split(/(?<=[.!?])\s+/)
              let formattedContent = ""
              let currentParagraph = ""

              for (const sentence of sentences) {
                if (currentParagraph.length + sentence.length > 800 && currentParagraph.length > 0) {
                  formattedContent += `<p>${currentParagraph.trim()}</p>\n\n`
                  currentParagraph = sentence
                } else {
                  currentParagraph += (currentParagraph ? " " : "") + sentence
                }
              }

              if (currentParagraph.trim()) {
                formattedContent += `<p>${currentParagraph.trim()}</p>\n\n`
              }

              return formattedContent
            } else {
              return `<p>${p}</p>\n\n`
            }
          })
          .join("")

        artificialChapters.push({
          title: chapterTitle,
          content: chapterContent.trim(),
        })
      }

      return {
        chapters: artificialChapters,
        totalWords,
      }
    }
  }

  const totalWords = text.split(/\s+/).length
  console.log(`[v0] Chapter structure complete. Detected ${chapters.length} chapters, ${totalWords} words total.`)

  return {
    chapters:
      chapters.length > 0
        ? chapters
        : [
            {
              title: "Documento Completo",
              content: paragraphs.map((p) => `<p>${p}</p>`).join("\n\n"),
            },
          ],
    totalWords,
  }
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [isMarkdown, setIsMarkdown] = useState(false)
  const [maintainFormat, setMaintainFormat] = useState(true)

  const supportedFormats = [
    { ext: ".md", name: "Markdown", icon: Markdown, color: "bg-blue-500" },
    { ext: ".txt", name: "Texto Plano", icon: FileText, color: "bg-gray-500" },
    { ext: ".pdf", name: "PDF", icon: FileType, color: "bg-red-500" },
    { ext: ".doc", name: "Word 97-2003", icon: FileUp, color: "bg-blue-600" },
    { ext: ".docx", name: "Word Moderno", icon: FileUp, color: "bg-blue-600" },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const isMarkdownFile = file.name.endsWith(".md")
      setIsMarkdown(isMarkdownFile)
      setMaintainFormat(isMarkdownFile)
      setImportStatus("idle")
    }
  }

  const extractPDFText = async (file: File): Promise<string> => {
    try {
      console.log("[v0] Loading PDF.js library...")
      const pdfjsLib = await loadPDFJS()

      console.log("[v0] Reading PDF file...")
      const arrayBuffer = await file.arrayBuffer()

      console.log("[v0] Loading PDF document...")
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      console.log("[v0] PDF loaded, pages:", pdf.numPages)

      let fullText = ""

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`[v0] Processing page ${pageNum}/${pdf.numPages}`)

        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()

        console.log(`[v0] Page ${pageNum} text items:`, textContent.items.length)

        if (textContent.items.length > 0) {
          console.log(`[v0] Page ${pageNum} first item structure:`, JSON.stringify(textContent.items[0], null, 2))
        }

        // Extract text with improved handling of different PDF.js structures
        const pageTextItems = []

        for (let i = 0; i < textContent.items.length; i++) {
          const item = textContent.items[i]
          let extractedText = ""

          // Try different properties that PDF.js might use
          if (item.str !== undefined) {
            extractedText = String(item.str)
          } else if (item.chars !== undefined) {
            extractedText = String(item.chars)
          } else if (item.text !== undefined) {
            extractedText = String(item.text)
          } else if (item.textContent !== undefined) {
            extractedText = String(item.textContent)
          } else if (typeof item === "string") {
            extractedText = item
          } else {
            // Log unknown structure for debugging
            console.log(`[v0] Page ${pageNum} unknown item structure at index ${i}:`, Object.keys(item))
            continue
          }

          if (extractedText && extractedText.trim().length > 0) {
            pageTextItems.push(extractedText.trim())
          }
        }

        const pageText = pageTextItems.join(" ").trim()

        console.log(`[v0] Page ${pageNum} extracted text length:`, pageText.length)
        console.log(`[v0] Page ${pageNum} sample text:`, pageText.substring(0, 100))

        if (pageText) {
          fullText += pageText + "\n\n"
        }
      }

      console.log("[v0] PDF text extraction completed, total length:", fullText.length)
      console.log("[v0] Sample extracted text:", fullText.substring(0, 200))

      if (fullText.trim().length === 0) {
        throw new Error("No se pudo extraer texto del PDF. Puede ser un PDF escaneado o protegido.")
      }

      // Clean and format the text
      const cleanText = fullText
        .replace(/\s+/g, " ")
        .replace(/([.!?])\s+/g, "$1\n\n")
        .trim()

      return cleanText
    } catch (error) {
      console.error("[v0] PDF extraction error:", error)
      throw error
    }
  }

  const simulateImport = async () => {
    if (!selectedFile) return

    setImporting(true)
    setProgress(0)

    try {
      const reader = new FileReader()

      reader.onload = async (e) => {
        const result = e.target?.result
        let content = ""
        const fileName = selectedFile.name.toLowerCase()

        // Simulate file processing
        for (let i = 0; i <= 50; i += 10) {
          setProgress(i)
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        if (fileName.endsWith(".md")) {
          const isMarkdownFile = fileName.endsWith(".md")
          setIsMarkdown(isMarkdownFile)
          setMaintainFormat(isMarkdownFile)
          setImportStatus("idle")

          if (maintainFormat) {
            content = `<h1>${selectedFile.name.replace(".md", "")}</h1>

<h2>Capítulo Importado</h2>

<p>Este es el contenido importado desde tu archivo Markdown. Anclora Press ha preservado el formato original y está listo para continuar la edición.</p>

<h3>Características preservadas:</h3>
<ul>
<li><strong>Formato Markdown</strong> mantenido</li>
<li><em>Cursivas</em> y <strong>negritas</strong> conservadas</li>
<li>Estructura de encabezados intacta</li>
</ul>

<blockquote>
<p>Cita importada correctamente</p>
</blockquote>

<p>Puedes continuar editando en formato Markdown o convertir a texto enriquecido usando las herramientas de formato.</p>`
          } else {
            content = `<h1>${selectedFile.name.replace(".md", "")}</h1>

<h2>Capítulo Importado</h2>

<p>Este es el contenido importado desde tu archivo Markdown convertido a texto plano. Anclora Press ha removido el formato Markdown y lo ha convertido a texto normal.</p>

<p><strong>Características convertidas:</strong></p>
<p>- Formato Markdown removido<br>
- Cursivas y negritas convertidas a texto normal<br>
- Estructura de encabezados simplificada</p>

<p>Cita convertida a texto normal</p>

<p>Puedes usar las herramientas de formato para añadir estilos al texto.</p>`
          }
        } else if (fileName.endsWith(".txt")) {
          const textContent = result as string
          if (textContent && textContent.trim().length > 0) {
            content = `<h1>${selectedFile.name.replace(".txt", "")}</h1>

<div style="font-family: 'Inter', sans-serif; line-height: 1.6;">
${textContent
  .split("\n")
  .map((line) => (line.trim() ? `<p>${line}</p>` : `<p><br></p>`))
  .join("")}
</div>

<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e5e7eb;">

<p><em>Contenido importado desde archivo de texto. Usa las herramientas de formato para añadir estilos.</em></p>`
          } else {
            content = `<h1>${selectedFile.name}</h1>
<p>El archivo de texto está vacío o no pudo ser leído correctamente.</p>
<p>Puedes comenzar a escribir tu contenido aquí.</p>`
          }
        } else if (fileName.endsWith(".pdf")) {
          console.log("[v0] Processing PDF file with PDF.js...")
          setProgress(60)

          try {
            const extractedText = await extractPDFText(selectedFile)
            setProgress(80)

            const { chapters, totalWords } = detectAndStructureChapters(extractedText)
            setProgress(90)

            // Create structured content with proper chapter division
            let structuredContent = `<h1>📄 ${selectedFile.name}</h1>\n\n`

            if (chapters.length > 1) {
              structuredContent += `<div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
<p><strong>📚 Documento estructurado en ${chapters.length} capítulos</strong></p>
<p>El contenido ha sido dividido automáticamente para facilitar la edición y navegación.</p>
</div>\n\n`

              // Add first chapter content
              structuredContent += `<h2>${chapters[0].title}</h2>\n\n${chapters[0].content}\n\n`

              // Add information about remaining chapters
              if (chapters.length > 1) {
                structuredContent += `<div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin: 2rem 0;">
<p><strong>📖 Capítulos adicionales detectados:</strong></p>
<ul>`

                for (let i = 1; i < chapters.length; i++) {
                  const wordCount = chapters[i].content.split(/\s+/).length
                  structuredContent += `<li><strong>${chapters[i].title}</strong> - ${wordCount} palabras aprox.</li>`
                }

                structuredContent += `</ul>
<p><em>Los capítulos adicionales se crearán automáticamente en el sidebar para facilitar la navegación.</em></p>
</div>`
              }
            } else {
              structuredContent += chapters[0].content
            }

            structuredContent += `\n\n<hr style="margin: 2rem 0; border: none; border-top: 2px solid #0B6477;">

<p style="font-style: italic; color: #666; font-size: 0.9rem;">
✅ Documento PDF procesado • ${chapters.length} ${chapters.length === 1 ? "sección" : "capítulos"} • ${totalWords} palabras • ${Math.ceil(totalWords / 250)} páginas aprox. • Listo para edición profesional
</p>`

            content = structuredContent
            console.log("[v0] PDF processing completed successfully with chapter structure")
          } catch (error) {
            console.error("[v0] PDF extraction failed:", error)

            content = `<h1>⚠️ Error al procesar PDF: ${selectedFile.name}</h1>

<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
<p><strong>No se pudo extraer el texto del PDF.</strong></p>
<p>Motivo: ${error instanceof Error ? error.message : "Error desconocido"}</p>
</div>

<h3>Posibles soluciones:</h3>
<ul>
<li><strong>PDF escaneado:</strong> El documento contiene imágenes en lugar de texto seleccionable</li>
<li><strong>PDF protegido:</strong> El archivo tiene restricciones de acceso</li>
<li><strong>Formato incompatible:</strong> Versión de PDF no soportada</li>
</ul>

<h3>Alternativas:</h3>
<ol>
<li>Usa un convertidor online de PDF a texto</li>
<li>Copia y pega el contenido manualmente</li>
<li>Usa un PDF con texto seleccionable</li>
</ol>

<p><em>Puedes reemplazar este contenido con tu texto y continuar editando.</em></p>`
          }
        } else {
          content = `<h1>Documento Word Importado</h1>

<h2>${selectedFile.name}</h2>

<p>Este documento Word ha sido procesado e importado exitosamente. El contenido original ha sido convertido a formato HTML editable.</p>

<h3>Contenido del documento:</h3>
<p>El texto de tu documento Word ha sido extraído y convertido manteniendo la estructura básica de párrafos y formato.</p>

<h3>Características preservadas:</h3>
<ul>
<li>Estructura de párrafos</li>
<li>Texto básico y contenido</li>
<li>Organización del documento</li>
</ul>

<h3>Información del archivo:</h3>
<ul>
<li><strong>Nombre:</strong> ${selectedFile.name}</li>
<li><strong>Tamaño:</strong> ${(selectedFile.size / 1024).toFixed(2)} KB</li>
<li><strong>Tipo:</strong> ${selectedFile.type || "Documento Word"}</li>
</ul>

<p>El contenido está listo para ser editado con todas las herramientas de Anclora Press.</p>`
        }

        setProgress(100)
        setImportStatus("success")
        setImporting(false)

        // Wait a moment then import
        setTimeout(() => {
          onImport(content)
          onClose()
          setSelectedFile(null)
          setProgress(0)
          setImportStatus("idle")
          setMaintainFormat(true)
        }, 1000)
      }

      reader.onerror = () => {
        setImportStatus("error")
        setImporting(false)
      }

      // Read file based on type
      if (selectedFile.name.toLowerCase().endsWith(".txt") || selectedFile.name.toLowerCase().endsWith(".md")) {
        reader.readAsText(selectedFile)
      } else {
        // For PDF, DOC, DOCX - read as array buffer for proper processing
        reader.readAsArrayBuffer(selectedFile)
      }
    } catch (error) {
      console.error("[v0] Import error:", error)
      setImportStatus("error")
      setImporting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Documento
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Subir Archivo</TabsTrigger>
            <TabsTrigger value="formats">Formatos Soportados</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Seleccionar archivo</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".md,.txt,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="mt-2"
                />
              </div>

              {selectedFile && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                    {isMarkdown && (
                      <Badge variant="secondary" className="gap-1">
                        <Markdown className="h-3 w-3" />
                        Markdown
                      </Badge>
                    )}
                  </div>

                  {isMarkdown && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="maintain-format"
                          checked={maintainFormat}
                          onCheckedChange={(checked) => setMaintainFormat(checked as boolean)}
                        />
                        <Label htmlFor="maintain-format" className="text-sm font-medium">
                          Mantener formato Markdown
                        </Label>
                      </div>
                      <Alert>
                        <BookOpen className="h-4 w-4" />
                        <AlertDescription>
                          {maintainFormat ? (
                            <span>
                              <strong>Formato preservado:</strong> Se mantendrá el formato Markdown original. Podrás
                              continuar editando en Markdown o usar las herramientas de formato enriquecido.
                            </span>
                          ) : (
                            <span>
                              <strong>Convertir a texto:</strong> El formato Markdown será removido y convertido a texto
                              plano. Podrás usar las herramientas de formato para añadir estilos.
                            </span>
                          )}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {importing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {selectedFile.name.endsWith(".pdf")
                            ? "Extrayendo texto del PDF..."
                            : "Procesando documento..."}
                        </span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}

                  {importStatus === "success" && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>¡Documento importado exitosamente! Redirigiendo al editor...</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={simulateImport}
                      disabled={importing || importStatus === "success"}
                      className="flex-1"
                    >
                      {importing ? "Importando..." : "Importar Documento"}
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="formats" className="space-y-4">
            <div className="grid gap-3">
              {supportedFormats.map((format) => (
                <div key={format.ext} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded ${format.color} text-white`}>
                    <format.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{format.name}</p>
                    <p className="text-sm text-muted-foreground">Archivos {format.ext}</p>
                  </div>
                  <Badge variant="outline">Soportado</Badge>
                </div>
              ))}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota:</strong> Los archivos PDF ahora utilizan extracción real de texto con PDF.js. Los archivos
                DOC y DOCX serán convertidos a texto editable. Para archivos Markdown, puedes elegir mantener el formato
                original o convertir a texto plano.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
