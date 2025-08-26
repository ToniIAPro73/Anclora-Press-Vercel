"use client"

import { Card } from "@/components/ui/card"

interface LivePreviewProps {
  content: string
  device: "kindle" | "tablet" | "desktop" | "print"
}

export function LivePreview({ content, device }: LivePreviewProps) {
  console.log("[v0] LivePreview rendering with content length:", content?.length || 0)
  console.log("[v0] LivePreview device:", device)
  console.log("[v0] LivePreview content preview:", content?.substring(0, 100) || "No content")

  const getDeviceStyles = () => {
    switch (device) {
      case "kindle":
        return {
          width: "280px",
          fontSize: "14px",
          lineHeight: "1.5",
          fontFamily: "ui-serif, Georgia, serif",
          backgroundColor: "#f8f8f8",
          color: "#333",
        }
      case "tablet":
        return {
          width: "100%",
          fontSize: "16px",
          lineHeight: "1.6",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          backgroundColor: "white",
          color: "#000",
        }
      case "desktop":
        return {
          width: "100%",
          fontSize: "18px",
          lineHeight: "1.7",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          backgroundColor: "white",
          color: "#000",
        }
      case "print":
        return {
          width: "100%",
          fontSize: "12px",
          lineHeight: "1.4",
          fontFamily: "ui-serif, Georgia, serif",
          backgroundColor: "white",
          color: "#000",
        }
    }
  }

  const styles = getDeviceStyles()

  const renderContent = (htmlContent: string) => {
    console.log("[v0] Rendering content:", htmlContent?.substring(0, 50) || "Empty")

    if (!htmlContent || htmlContent.trim() === "" || htmlContent === "<p><br></p>") {
      return (
        <div className="text-gray-400 italic p-4 text-center">
          <p>Comienza a escribir para ver la vista previa...</p>
          <p className="text-xs mt-2">El contenido aparecerá aquí en tiempo real</p>
        </div>
      )
    }

    // Clean up the HTML content and render it directly
    const cleanContent = htmlContent
      .replace(/<div><br><\/div>/g, "<br>") // Clean up empty divs
      .replace(/<div>/g, "<p>") // Convert divs to paragraphs
      .replace(/<\/div>/g, "</p>") // Convert closing divs
      .replace(/<p><\/p>/g, "<br>") // Replace empty paragraphs with breaks
      .replace(/<p><br><\/p>/g, "<br>") // Replace paragraphs with just breaks

    return (
      <div
        dangerouslySetInnerHTML={{ __html: cleanContent }}
        className="prose prose-sm max-w-none leading-relaxed"
        style={{
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
          color: styles.color,
        }}
      />
    )
  }

  return (
    <div className="p-4">
      <Card
        className="mx-auto shadow-lg border-2"
        style={{
          maxWidth: device === "kindle" ? "300px" : "100%",
          minHeight: device === "print" ? "400px" : "300px",
        }}
      >
        <div className="p-6" style={styles}>
          {renderContent(content)}
        </div>
      </Card>
    </div>
  )
}
