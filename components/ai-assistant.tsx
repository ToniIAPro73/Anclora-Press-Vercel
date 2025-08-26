"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Sparkles, MessageSquare, CheckCircle, Lightbulb, PenTool, BookOpen } from "lucide-react"

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  content: string
}

export function AIAssistant({ isOpen, onClose, content }: AIAssistantProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState("")

  const aiTools = [
    {
      id: "improve",
      name: "Mejorar Texto",
      description: "Mejora la claridad y fluidez del texto seleccionado",
      icon: PenTool,
      color: "bg-blue-500",
    },
    {
      id: "grammar",
      name: "Corregir Gramática",
      description: "Encuentra y corrige errores gramaticales",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      id: "title",
      name: "Sugerir Título",
      description: "Genera títulos creativos para capítulos",
      icon: Lightbulb,
      color: "bg-yellow-500",
    },
    {
      id: "description",
      name: "Generar Descripción",
      description: "Crea descripciones para publicación",
      icon: BookOpen,
      color: "bg-purple-500",
    },
  ]

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId)

    // Simulate AI response based on tool
    switch (toolId) {
      case "improve":
        setSuggestion(
          'Considera usar conectores más variados para mejorar la fluidez. Por ejemplo, en lugar de repetir "y" podrías usar "además", "asimismo" o "por otra parte".',
        )
        break
      case "grammar":
        setSuggestion(
          'El texto está bien estructurado gramaticalmente. Solo sugiero revisar la concordancia en "había estado gestándose" - podría ser "se había estado gestando".',
        )
        break
      case "title":
        setSuggestion(
          'Sugerencias de títulos:\n• "El Despertar de las Palabras"\n• "Cuando las Mariposas Escriben"\n• "El Primer Trazo"\n• "Entre Luces y Sombras"\n• "El Momento Esperado"',
        )
        break
      case "description":
        setSuggestion(
          "Una historia sobre el momento mágico en que un escritor encuentra su voz. Entre la luz del amanecer y las páginas en blanco, descubre que cada gran historia comienza con una sola palabra y el valor de escribirla.",
        )
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Asistente IA</h2>
            <p className="text-xs text-muted-foreground">Mejora tu escritura</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* AI Tools */}
          <div>
            <h3 className="font-medium mb-3">Herramientas Disponibles</h3>
            <div className="grid gap-2">
              {aiTools.map((tool) => (
                <Card
                  key={tool.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTool === tool.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleToolClick(tool.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-8 w-8 rounded-lg ${tool.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <tool.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{tool.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Suggestion */}
          {selectedTool && suggestion && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Sugerencia IA
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <pre className="whitespace-pre-wrap font-sans">{suggestion}</pre>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1">
                    Aplicar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Ignorar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Estadísticas del Texto</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Palabras</div>
                  <div className="font-medium">{content.split(" ").length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Caracteres</div>
                  <div className="font-medium">{content.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Párrafos</div>
                  <div className="font-medium">{content.split("\n\n").length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Tiempo lectura</div>
                  <div className="font-medium">{Math.ceil(content.split(" ").length / 200)} min</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
