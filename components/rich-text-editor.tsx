"use client"

import type React from "react"
import { useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  content: string
  onContentChange: (content: string) => void
  placeholder?: string
  className?: string
}

export interface RichTextEditorRef {
  focus: () => void
  getSelection: () => Selection | null
  execCommand: (command: string, value?: string) => void
  insertHTML: (html: string) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ content, onContentChange, placeholder, className }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [history, setHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)

    const saveToHistory = useCallback(
      (content: string) => {
        setHistory((prev) => {
          const newHistory = prev.slice(0, historyIndex + 1)
          newHistory.push(content)
          if (newHistory.length > 20) {
            newHistory.shift()
          }
          return newHistory
        })
        setHistoryIndex((prev) => Math.min(prev + 1, 19))
      },
      [historyIndex],
    )

    useImperativeHandle(ref, () => ({
      focus: () => {
        editorRef.current?.focus()
      },
      getSelection: () => {
        return window.getSelection()
      },
      execCommand: (command: string, value?: string) => {
        document.execCommand(command, false, value)
        handleContentChange()
      },
      insertHTML: (html: string) => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          const div = document.createElement("div")
          div.innerHTML = html
          const fragment = document.createDocumentFragment()
          while (div.firstChild) {
            fragment.appendChild(div.firstChild)
          }
          range.insertNode(fragment)
          handleContentChange()
        }
      },
      undo: () => {
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          const previousContent = history[newIndex]
          if (editorRef.current) {
            editorRef.current.innerHTML = previousContent
            onContentChange(previousContent)
          }
        }
      },
      redo: () => {
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1
          setHistoryIndex(newIndex)
          const nextContent = history[newIndex]
          if (editorRef.current) {
            editorRef.current.innerHTML = nextContent
            onContentChange(nextContent)
          }
        }
      },
      canUndo: () => historyIndex > 0,
      canRedo: () => historyIndex < history.length - 1,
    }))

    const handleContentChange = () => {
      if (editorRef.current) {
        const htmlContent = editorRef.current.innerHTML
        onContentChange(htmlContent)
        saveToHistory(htmlContent)
      }
    }

    const handleInput = () => {
      handleContentChange()
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData.getData("text/plain")
      document.execCommand("insertText", false, text)
      handleContentChange()
    }

    const handleClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "IMG") {
        setSelectedImage(target as HTMLImageElement)
        // Remove previous selection
        document.querySelectorAll(".selected-image").forEach((img) => {
          img.classList.remove("selected-image")
        })
        target.classList.add("selected-image")
      } else {
        setSelectedImage(null)
        document.querySelectorAll(".selected-image").forEach((img) => {
          img.classList.remove("selected-image")
        })
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault()
          if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            const previousContent = history[newIndex]
            if (editorRef.current) {
              editorRef.current.innerHTML = previousContent
              onContentChange(previousContent)
            }
          }
        } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault()
          if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            const nextContent = history[newIndex]
            if (editorRef.current) {
              editorRef.current.innerHTML = nextContent
              onContentChange(nextContent)
            }
          }
        }
      }
    }

    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content
        if (history.length === 0) {
          saveToHistory(content)
        }
      }
    }, [content, history.length, saveToHistory])

    return (
      <>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-h-full w-full resize-none border-0 bg-transparent text-base leading-relaxed focus:outline-none font-sans p-4",
            "prose prose-slate dark:prose-invert max-w-none",
            "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4",
            "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3",
            "[&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2",
            "[&_p]:mb-4 [&_p]:leading-relaxed",
            "[&_strong]:font-bold [&_em]:italic [&_u]:underline",
            "[&_img]:max-w-full [&_img]:h-auto [&_img]:cursor-pointer",
            "[&_.selected-image]:ring-2 [&_.selected-image]:ring-blue-500 [&_.selected-image]:ring-offset-2",
            className,
          )}
          data-placeholder={placeholder}
          style={{
            minHeight: "calc(100vh - 300px)",
          }}
        />

        {selectedImage && (
          <div
            className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg z-50"
            style={{
              top: selectedImage.getBoundingClientRect().bottom + 10,
              left: selectedImage.getBoundingClientRect().left,
            }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-300">Tamaño:</span>
              <button
                onClick={() => {
                  selectedImage.style.width = "25%"
                  handleContentChange()
                }}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                25%
              </button>
              <button
                onClick={() => {
                  selectedImage.style.width = "50%"
                  handleContentChange()
                }}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                50%
              </button>
              <button
                onClick={() => {
                  selectedImage.style.width = "75%"
                  handleContentChange()
                }}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                75%
              </button>
              <button
                onClick={() => {
                  selectedImage.style.width = "100%"
                  handleContentChange()
                }}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                100%
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-300">Alineación:</span>
              <button
                onClick={() => {
                  selectedImage.style.display = "block"
                  selectedImage.style.marginLeft = "0"
                  selectedImage.style.marginRight = "auto"
                  handleContentChange()
                }}
                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              >
                Izq
              </button>
              <button
                onClick={() => {
                  selectedImage.style.display = "block"
                  selectedImage.style.marginLeft = "auto"
                  selectedImage.style.marginRight = "auto"
                  handleContentChange()
                }}
                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              >
                Centro
              </button>
              <button
                onClick={() => {
                  selectedImage.style.display = "block"
                  selectedImage.style.marginLeft = "auto"
                  selectedImage.style.marginRight = "0"
                  handleContentChange()
                }}
                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              >
                Der
              </button>
            </div>
          </div>
        )}
      </>
    )
  },
)

RichTextEditor.displayName = "RichTextEditor"
