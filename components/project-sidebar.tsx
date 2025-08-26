"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Folder, FileText, Plus, ChevronRight, ChevronDown, BookOpen, Palette, Sparkles } from "lucide-react"

export function ProjectSidebar() {
  const [expandedSections, setExpandedSections] = useState({
    projects: true,
    chapters: true,
    templates: false,
    ai: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="w-64 border-r border-border bg-sidebar">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {/* Recent Projects */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
              onClick={() => toggleSection("projects")}
            >
              {expandedSections.projects ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <Folder className="h-4 w-4 mr-2" />
              <span className="font-medium">Proyectos</span>
            </Button>

            {expandedSections.projects && (
              <div className="ml-6 mt-2 space-y-1">
                <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent/50 text-sidebar-accent-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Mi Primera Novela</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Activo
                  </Badge>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Guía de Marketing</span>
                </div>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 mt-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Proyecto
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Chapters */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
              onClick={() => toggleSection("chapters")}
            >
              {expandedSections.chapters ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="font-medium">Capítulos</span>
            </Button>

            {expandedSections.chapters && (
              <div className="ml-6 mt-2 space-y-1">
                <div className="text-xs text-muted-foreground mb-2">Front Matter</div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <FileText className="h-3 w-3" />
                  <span className="text-sm">Portada</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <FileText className="h-3 w-3" />
                  <span className="text-sm">Copyright</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <FileText className="h-3 w-3" />
                  <span className="text-sm">Índice</span>
                </div>

                <div className="text-xs text-muted-foreground mb-2 mt-4">Contenido</div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-primary/10 border border-primary/20">
                  <FileText className="h-3 w-3 text-primary" />
                  <span className="text-sm font-medium">Capítulo 1</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Editando
                  </Badge>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <FileText className="h-3 w-3" />
                  <span className="text-sm text-muted-foreground">Capítulo 2</span>
                </div>

                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 mt-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Capítulo
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Templates */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
              onClick={() => toggleSection("templates")}
            >
              {expandedSections.templates ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <Palette className="h-4 w-4 mr-2" />
              <span className="font-medium">Plantillas</span>
              <Badge variant="outline" className="ml-auto text-xs">
                15
              </Badge>
            </Button>

            {expandedSections.templates && (
              <div className="ml-6 mt-2 space-y-1">
                <div className="text-xs text-muted-foreground mb-2">Ficción</div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <div className="h-3 w-3 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
                  <span className="text-sm">Novela Moderna</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <div className="h-3 w-3 rounded bg-gradient-to-br from-pink-500 to-rose-500" />
                  <span className="text-sm">Romance</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <div className="h-3 w-3 rounded bg-gradient-to-br from-gray-700 to-gray-900" />
                  <span className="text-sm">Thriller</span>
                </div>

                <div className="text-xs text-muted-foreground mb-2 mt-4">No Ficción</div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <div className="h-3 w-3 rounded bg-gradient-to-br from-green-500 to-emerald-500" />
                  <span className="text-sm">Manual Técnico</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <div className="h-3 w-3 rounded bg-gradient-to-br from-orange-500 to-yellow-500" />
                  <span className="text-sm">Libro de Negocios</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* AI Tools */}
          <div>
            <Button variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => toggleSection("ai")}>
              {expandedSections.ai ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="font-medium">Asistente IA</span>
            </Button>

            {expandedSections.ai && (
              <div className="ml-6 mt-2 space-y-1">
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-sm">Mejorar Texto</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-sm">Generar Portada</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent/30 cursor-pointer">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-sm">Sugerir Título</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
