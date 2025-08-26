"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/forms/button"
import { Separator } from "@/components/ui/layout/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/surfaces/popover"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Palette,
  ImageIcon,
  Link,
  Undo,
  Redo,
} from "lucide-react"
import type { RichTextEditorRef } from "./rich-text-editor"

interface FormattingToolbarProps {
  content: string
  onContentChange: (content: string) => void
  editorRef?: React.RefObject<RichTextEditorRef>
}

export function FormattingToolbar({ content, onContentChange, editorRef }: FormattingToolbarProps) {
  const [selectedFont, setSelectedFont] = useState("Inter")
  const [selectedSize, setSelectedSize] = useState("16")
  const [selectedColor, setSelectedColor] = useState("#000000")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fonts = [
    { name: "Inter", family: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    {
      name: "Space Grotesk",
      family: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    { name: "Arial", family: "Arial, sans-serif" },
    { name: "Helvetica", family: "Helvetica, Arial, sans-serif" },
    { name: "Times New Roman", family: "'Times New Roman', Times, serif" },
    { name: "Georgia", family: "Georgia, 'Times New Roman', Times, serif" },
    { name: "Verdana", family: "Verdana, Geneva, sans-serif" },
    { name: "Trebuchet MS", family: "'Trebuchet MS', Helvetica, sans-serif" },
    { name: "Impact", family: "Impact, Arial Black, sans-serif" },
    { name: "Comic Sans MS", family: "'Comic Sans MS', cursive" },
    { name: "Courier New", family: "'Courier New', Courier, monospace" },
    { name: "Lucida Console", family: "'Lucida Console', Monaco, monospace" },
    { name: "Palatino", family: "Palatino, 'Palatino Linotype', serif" },
    { name: "Garamond", family: "Garamond, Times, serif" },
    { name: "Bookman", family: "'Bookman Old Style', serif" },
    { name: "Avant Garde", family: "'Avant Garde', Avantgarde, sans-serif" },
    { name: "Helvetica Neue", family: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    { name: "Lucida Grande", family: "'Lucida Grande', 'Lucida Sans Unicode', sans-serif" },
    { name: "Tahoma", family: "Tahoma, Geneva, sans-serif" },
    { name: "Century Gothic", family: "'Century Gothic', AppleGothic, sans-serif" },
  ]

  const headingLevels = [
    { value: "p", label: "Párrafo" },
    { value: "h1", label: "Título 1" },
    { value: "h2", label: "Título 2" },
    { value: "h3", label: "Título 3" },
    { value: "h4", label: "Título 4" },
    { value: "h5", label: "Título 5" },
    { value: "h6", label: "Título 6" },
  ]

  const fontSizes = ["12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "64"]

  const handleUndo = () => {
    if (editorRef?.current?.canUndo()) {
      editorRef.current.undo()
    }
  }

  const handleRedo = () => {
    if (editorRef?.current?.canRedo()) {
      editorRef.current.redo()
    }
  }

  const applyFormatting = (format: string) => {
    if (!editorRef?.current) {
      console.log("[v0] No editor reference available")
      return
    }

    editorRef.current.focus()

    switch (format) {
      case "bold":
        editorRef.current.execCommand("bold")
        break
      case "italic":
        editorRef.current.execCommand("italic")
        break
      case "underline":
        editorRef.current.execCommand("underline")
        break
    }
  }

  const insertHeading = (level: string) => {
    if (!editorRef?.current) return

    editorRef.current.focus()

    if (level === "p") {
      editorRef.current.execCommand("formatBlock", "p")
    } else {
      editorRef.current.execCommand("formatBlock", level)
    }
  }

  const applyAlignment = (alignment: string) => {
    if (!editorRef?.current) return

    editorRef.current.focus()

    switch (alignment) {
      case "left":
        editorRef.current.execCommand("justifyLeft")
        break
      case "center":
        editorRef.current.execCommand("justifyCenter")
        break
      case "right":
        editorRef.current.execCommand("justifyRight")
        break
      case "justify":
        editorRef.current.execCommand("justifyFull")
        break
    }
  }

  const applyIndentation = (type: string) => {
    if (!editorRef?.current) return

    editorRef.current.focus()

    if (type === "indent") {
      editorRef.current.execCommand("indent")
    } else {
      editorRef.current.execCommand("outdent")
    }
  }

  const insertImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editorRef?.current) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      const imageHtml = `<img src="${imageUrl}" alt="Imagen insertada" style="max-width: 100%; height: auto;" />`
      editorRef.current?.insertHTML(imageHtml)
    }
    reader.readAsDataURL(file)
  }

  const insertLink = () => {
    if (!editorRef?.current) return

    const url = prompt("Ingresa la URL:")
    if (url) {
      editorRef.current.focus()
      editorRef.current.execCommand("createLink", url)
    }
  }

  const applyFontChange = (fontName: string) => {
    setSelectedFont(fontName)
    if (!editorRef?.current) return

    const selectedFontObj = fonts.find((f) => f.name === fontName)
    const fontFamily = selectedFontObj?.family || fontName

    console.log("[v0] Applying font change:", fontName, "with family:", fontFamily)
    editorRef.current.focus()

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)

      if (!range.collapsed) {
        // Apply to selected text
        const span = document.createElement("span")
        span.style.fontFamily = fontFamily

        try {
          const contents = range.extractContents()
          span.appendChild(contents)
          range.insertNode(span)

          // Clear selection and place cursor after the span
          selection.removeAllRanges()
          const newRange = document.createRange()
          newRange.setStartAfter(span)
          newRange.collapse(true)
          selection.addRange(newRange)

          console.log("[v0] Font applied to selected text via DOM manipulation")
        } catch (error) {
          console.log("[v0] Error applying font to selection:", error)
        }
      } else {
        // Set font for future typing by creating a styled span at cursor
        const span = document.createElement("span")
        span.style.fontFamily = fontFamily
        span.setAttribute("data-font-family", fontFamily)

        // Insert a zero-width space to make the span selectable
        span.textContent = "\u200B"

        try {
          range.insertNode(span)

          // Position cursor inside the span
          const newRange = document.createRange()
          newRange.setStart(span, 1)
          newRange.collapse(true)
          selection.removeAllRanges()
          selection.addRange(newRange)

          console.log("[v0] Font set for future typing via DOM manipulation")
        } catch (error) {
          console.log("[v0] Error setting font for future typing:", error)
        }
      }

      // Trigger content change to update the editor
      if (editorRef.current.getContent) {
        const newContent = editorRef.current.getContent()
        onContentChange(newContent)
      }
    }
  }

  const applySizeChange = (size: string) => {
    setSelectedSize(size)
    if (!editorRef?.current) return

    console.log("[v0] Applying size change:", size)
    editorRef.current.focus()

    try {
      const success = editorRef.current.execCommand("fontSize", false, "7") // Reset to largest
      editorRef.current.execCommand("fontSize", false, size + "px")

      if (!success) {
        // Fallback to DOM manipulation
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)

          if (!range.collapsed) {
            const span = document.createElement("span")
            span.style.fontSize = size + "px"

            const contents = range.extractContents()
            span.appendChild(contents)
            range.insertNode(span)

            selection.removeAllRanges()
            const newRange = document.createRange()
            newRange.setStartAfter(span)
            newRange.collapse(true)
            selection.addRange(newRange)
          }
        }
      }

      // Trigger content change
      if (editorRef.current.getContent) {
        const newContent = editorRef.current.getContent()
        onContentChange(newContent)
      }
    } catch (error) {
      console.log("[v0] Size application error:", error)
    }
  }

  const applyColorChange = (color: string) => {
    setSelectedColor(color)
    if (!editorRef?.current) return

    editorRef.current.focus()
    editorRef.current.execCommand("foreColor", color)
  }

  return (
    <div className="border-b border-border p-3 glass-panel">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Undo/Redo Buttons */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleUndo}
          disabled={!editorRef?.current?.canUndo()}
          title="Deshacer (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleRedo}
          disabled={!editorRef?.current?.canRedo()}
          title="Rehacer (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Family */}
        <Select value={selectedFont} onValueChange={applyFontChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {fonts.map((font) => (
              <SelectItem key={font.name} value={font.name} style={{ fontFamily: font.family }}>
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select value={selectedSize} onValueChange={applySizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Heading Levels */}
        <Select onValueChange={insertHeading}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Estilo" />
          </SelectTrigger>
          <SelectContent>
            {headingLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Formatting */}
        <Button variant="ghost" size="sm" onClick={() => applyFormatting("bold")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => applyFormatting("italic")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => applyFormatting("underline")} className="h-8 w-8 p-0">
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <Label>Color del texto</Label>
              <Input
                type="color"
                value={selectedColor}
                onChange={(e) => applyColorChange(e.target.value)}
                className="h-10"
              />
              <div className="grid grid-cols-6 gap-2">
                {[
                  "#000000",
                  "#333333",
                  "#666666",
                  "#999999",
                  "#0B6477",
                  "#14919B",
                  "#0AD1C8",
                  "#45DFB1",
                  "#80ED99",
                  "#213A57",
                ].map((color) => (
                  <button
                    key={color}
                    className="h-8 w-8 rounded border-2 border-border hover:border-primary"
                    style={{ backgroundColor: color }}
                    onClick={() => applyColorChange(color)}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyAlignment("left")}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyAlignment("center")}>
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyAlignment("right")}>
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyAlignment("justify")}>
          <AlignJustify className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Indentation */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyIndentation("outdent")}>
          <Outdent className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyIndentation("indent")}>
          <Indent className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Insert Elements */}
        <Button variant="ghost" size="sm" className="gap-1" onClick={insertImage}>
          <ImageIcon className="h-4 w-4" />
          Imagen
        </Button>
        <Button variant="ghost" size="sm" className="gap-1" onClick={insertLink}>
          <Link className="h-4 w-4" />
          Enlace
        </Button>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>
    </div>
  )
}
