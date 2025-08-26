"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { X, Users, MessageCircle, Share2, Eye, Clock, CheckCircle } from "lucide-react"

interface CollaborationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CollaborationPanel({ isOpen, onClose }: CollaborationPanelProps) {
  const [collaborators] = useState([
    {
      id: 1,
      name: "María García",
      email: "maria@example.com",
      role: "Editor",
      status: "online",
      avatar: "/portrait-thoughtful-woman.png",
    },
    {
      id: 2,
      name: "Carlos López",
      email: "carlos@example.com",
      role: "Revisor",
      status: "offline",
      avatar: "/portrait-carlos.png",
    },
  ])

  const [comments] = useState([
    {
      id: 1,
      author: "María García",
      content: "Excelente inicio del capítulo. Sugiero desarrollar más la descripción del ambiente.",
      timestamp: "hace 2 horas",
      resolved: false,
    },
    {
      id: 2,
      author: "Carlos López",
      content: "La transición entre párrafos podría ser más fluida.",
      timestamp: "hace 1 día",
      resolved: true,
    },
  ])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-96 glass-panel border-l border-border slide-in-right">
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Colaboración</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)] p-6">
          <div className="space-y-6">
            {/* Share Project */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Compartir Proyecto</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Invitar colaborador</Label>
                  <div className="flex gap-2">
                    <Input id="email" placeholder="email@ejemplo.com" className="flex-1" />
                    <Button size="sm">Invitar</Button>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">Enlace de solo lectura</span>
                  </div>
                  <div className="flex gap-2">
                    <Input value="https://anclora.press/share/abc123" readOnly className="text-xs" />
                    <Button size="sm" variant="outline">
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Active Collaborators */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Colaboradores Activos</h3>
              </div>

              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {collaborator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{collaborator.name}</p>
                        <div
                          className={`h-2 w-2 rounded-full ${collaborator.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {collaborator.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Comments & Reviews */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Comentarios y Revisiones</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Textarea placeholder="Añadir comentario..." rows={3} />
                  <Button size="sm" className="mt-2">
                    Comentar
                  </Button>
                </div>

                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg border ${comment.resolved ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50" : "border-border"}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.author}</span>
                          {comment.resolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {comment.timestamp}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                      {!comment.resolved && (
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          Marcar como resuelto
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Version History */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Historial de Versiones</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded border border-border">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm">Versión actual</p>
                    <p className="text-xs text-muted-foreground">Editado por ti • hace 5 min</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Actual
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-2 rounded">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">v1.2</p>
                    <p className="text-xs text-muted-foreground">María García • hace 2 horas</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs">
                    Restaurar
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-2 rounded">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">v1.1</p>
                    <p className="text-xs text-muted-foreground">Carlos López • hace 1 día</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs">
                    Restaurar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
