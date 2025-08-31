import { FileText, Image, X } from "lucide-react"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import React from "react"

interface FileUploadAreaProps {
    files: File[]
    onFilesChange: (files: File[]) => void
    accept?: string
    multiple?: boolean
    label: string
    icon: React.ReactNode
    description: string
}

export function FileUploadArea({ files, onFilesChange, accept, multiple = true, label, icon, description }: FileUploadAreaProps) {
    const [isDragOver, setIsDragOver] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        const droppedFiles = Array.from(e.dataTransfer.files)
        if (accept) {
            const acceptedTypes = accept.split(',').map(type => type.trim())
            const filteredFiles = droppedFiles.filter(file => {
                return acceptedTypes.some(acceptedType => {
                    if (acceptedType === 'image/*') return file.type.startsWith('image/')
                    if (acceptedType.startsWith('.')) return file.name.toLowerCase().endsWith(acceptedType.toLowerCase())
                    return file.type === acceptedType
                })
            })
            onFilesChange(multiple ? [...files, ...filteredFiles] : filteredFiles.slice(0, 1))
        } else {
            onFilesChange(multiple ? [...files, ...droppedFiles] : droppedFiles.slice(0, 1))
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        onFilesChange(multiple ? [...files, ...selectedFiles] : selectedFiles.slice(0, 1))
    }

    const removeFile = (index: number) => {
        onFilesChange(files.filter((_, i) => i !== index))
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-3">
            <div
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                    }
                `}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                    {icon}
                    <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Click to browse or drag and drop files here
                        </p>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected files:</Label>
                    <div className="space-y-1">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {file.type.startsWith('image/') ? (
                                        <Image className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    ) : (
                                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                    <span className="truncate">{file.name}</span>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
