"use client"

import { useState } from "react"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Textarea } from "@/components/ui/forms/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { Badge } from "@/components/ui/data-display/badge"
import { Separator } from "@/components/ui/layout/separator"
import { ScrollArea } from "@/components/ui/layout/scroll-area"
import { X, Database, Tag, Calendar, Shield, BookOpen } from "lucide-react"

interface MetadataPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function MetadataPanel({ isOpen, onClose }: MetadataPanelProps) {
  const [metadata, setMetadata] = useState({
    title: "Mi Primera Novela",
    author: "Autor Anónimo",
    isbn: "",
    publisher: "Anclora Press",
    publicationDate: "",
    language: "es",
    genre: "ficcion",
    description: "",
    keywords: ["novela", "ficción", "literatura"],
    rights: "all-rights-reserved",
    format: "epub3",
    preservationLevel: "epub-a",
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-96 glass-panel border-l border-border slide-in-right">
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Metadatos del Libro</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)] p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Información Básica</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={metadata.author}
                    onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    placeholder="978-84-XXXXX-XX-X"
                    value={metadata.isbn}
                    onChange={(e) => setMetadata({ ...metadata, isbn: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="publisher">Editorial</Label>
                  <Input
                    id="publisher"
                    value={metadata.publisher}
                    onChange={(e) => setMetadata({ ...metadata, publisher: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Publication Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Detalles de Publicación</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="date">Fecha de Publicación</Label>
                  <Input
                    id="date"
                    type="date"
                    value={metadata.publicationDate}
                    onChange={(e) => setMetadata({ ...metadata, publicationDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={metadata.language}
                    onValueChange={(value) => setMetadata({ ...metadata, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="genre">Género</Label>
                  <Select value={metadata.genre} onValueChange={(value) => setMetadata({ ...metadata, genre: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ficcion">Ficción</SelectItem>
                      <SelectItem value="no-ficcion">No Ficción</SelectItem>
                      <SelectItem value="biografia">Biografía</SelectItem>
                      <SelectItem value="historia">Historia</SelectItem>
                      <SelectItem value="ciencia">Ciencia</SelectItem>
                      <SelectItem value="arte">Arte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description & Keywords */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Descripción y Etiquetas</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="description">Sinopsis</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe brevemente el contenido del libro..."
                    value={metadata.description}
                    onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Palabras Clave</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {metadata.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {keyword}
                        <X className="h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Añadir palabra clave..."
                    className="mt-2"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value && !metadata.keywords.includes(value)) {
                          setMetadata({ ...metadata, keywords: [...metadata.keywords, value] })
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Digital Preservation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Preservación Digital</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="format">Formato de Preservación</Label>
                  <Select
                    value={metadata.preservationLevel}
                    onValueChange={(value) => setMetadata({ ...metadata, preservationLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="epub-a">EPUB/A (Preservación a largo plazo)</SelectItem>
                      <SelectItem value="epub3">EPUB 3 (Estándar)</SelectItem>
                      <SelectItem value="pdf-a">PDF/A (Archivo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rights">Gestión de Derechos</Label>
                  <Select
                    value={metadata.rights}
                    onValueChange={(value) => setMetadata({ ...metadata, rights: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-rights-reserved">Todos los derechos reservados</SelectItem>
                      <SelectItem value="creative-commons">Creative Commons</SelectItem>
                      <SelectItem value="public-domain">Dominio público</SelectItem>
                      <SelectItem value="no-drm">Sin DRM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Guardar Metadatos</Button>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
