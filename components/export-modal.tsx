"use client"

import { useState } from "react"
import { Button } from "@/components/ui/forms/button"
import { Card, CardContent } from "@/components/ui/surfaces/card"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Textarea } from "@/components/ui/forms/textarea"
import { Badge } from "@/components/ui/data-display/badge"
import { Separator } from "@/components/ui/layout/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/surfaces/dialog"
import { Download, FileText, Printer, Smartphone, CheckCircle, Settings } from "lucide-react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["epub"])
  const [metadata, setMetadata] = useState({
    title: "Mi Primera Novela",
    author: "Autor Anónimo",
    description: "Una historia fascinante sobre...",
    isbn: "",
    language: "es",
  })

  const formats = [
    {
      id: "epub",
      name: "EPUB",
      description: "Formato estándar para e-readers",
      icon: Smartphone,
      color: "bg-blue-500",
    },
    {
      id: "pdf",
      name: "PDF",
      description: "Para impresión y lectura digital",
      icon: FileText,
      color: "bg-red-500",
    },
    {
      id: "mobi",
      name: "MOBI",
      description: "Compatible con Kindle",
      icon: Smartphone,
      color: "bg-orange-500",
    },
    {
      id: "print",
      name: "Print PDF",
      description: "Optimizado para impresión",
      icon: Printer,
      color: "bg-green-500",
    },
  ]

  const toggleFormat = (formatId: string) => {
    setSelectedFormats((prev) => (prev.includes(formatId) ? prev.filter((id) => id !== formatId) : [...prev, formatId]))
  }

  const handleExport = () => {
    // Simulate export process
    console.log("Exporting in formats:", selectedFormats)
    console.log("Metadata:", metadata)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Libro
          </DialogTitle>
          <DialogDescription>Configura los formatos y metadatos para exportar tu libro</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-base font-medium">Formatos de Exportación</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Selecciona los formatos en los que quieres exportar tu libro
            </p>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => (
                <Card
                  key={format.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFormats.includes(format.id) ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => toggleFormat(format.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${format.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <format.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{format.name}</h4>
                          {selectedFormats.includes(format.id) && <CheckCircle className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{format.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <Label className="text-base font-medium">Metadatos del Libro</Label>
            <p className="text-sm text-muted-foreground mb-4">Información que aparecerá en el libro exportado</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={metadata.title}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={metadata.author}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, author: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN (opcional)</Label>
                <Input
                  id="isbn"
                  value={metadata.isbn}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, isbn: e.target.value }))}
                  placeholder="978-0-123456-78-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Input
                  id="language"
                  value={metadata.language}
                  onChange={(e) => setMetadata((prev) => ({ ...prev, language: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={(e) => setMetadata((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Breve descripción del libro..."
              />
            </div>
          </div>

          <Separator />

          {/* Export Options */}
          <div>
            <Label className="text-base font-medium">Opciones de Exportación</Label>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">Incluir tabla de contenidos</div>
                  <div className="text-xs text-muted-foreground">Genera automáticamente el índice</div>
                </div>
                <Badge variant="secondary">Activado</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">Numeración de páginas</div>
                  <div className="text-xs text-muted-foreground">Solo para formatos de impresión</div>
                </div>
                <Badge variant="secondary">Activado</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">Optimizar para dispositivos</div>
                  <div className="text-xs text-muted-foreground">Ajusta el formato según el dispositivo</div>
                </div>
                <Badge variant="secondary">Activado</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" className="gap-2">
              <Settings className="h-4 w-4" />
              Configuración Avanzada
            </Button>
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar ({selectedFormats.length} formato{selectedFormats.length !== 1 ? "s" : ""})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
