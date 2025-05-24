"use client"

import type React from "react"
import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { X, Upload, Check, FileImage } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  onPrimaryImageChange: (index: number) => void
  primaryImageIndex: number
  pendingFiles?: File[]
  setPendingFiles?: (filesOrUpdater: File[] | ((prevFiles: File[]) => File[])) => void;
}

export interface ImageUploadRef {
  uploadPendingFilesAndGetUrls: () => Promise<string[]>;
  getPendingFilesCount: () => number;
  clearPendingFiles: () => void;
}

const BUCKET_NAME = "car-images"

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  (
    {
      images = [],
      onImagesChange,
      onPrimaryImageChange,
      primaryImageIndex,
      pendingFiles: controlledPendingFiles,
      setPendingFiles: controlledSetPendingFiles,
    }: ImageUploadProps,
    ref
  ) => {
    const [dragActive, setDragActive] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()
    const supabase = createBrowserSupabaseClient()

    const [internalPendingFiles, setInternalPendingFiles] = useState<File[]>([])

    const isPendingFilesControlled = controlledPendingFiles !== undefined && controlledSetPendingFiles !== undefined;

    const pendingFiles = isPendingFilesControlled ? controlledPendingFiles! : internalPendingFiles;
    const setPendingFiles = isPendingFilesControlled ? controlledSetPendingFiles! : setInternalPendingFiles;

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragleave" || e.type === "dragover") {
        setDragActive(e.type === "dragenter" || e.type === "dragover")
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleLocalFilesSelected(e.dataTransfer.files)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files.length > 0) {
        handleLocalFilesSelected(e.target.files)
      }
    }

    const handleLocalFilesSelected = (files: FileList) => {
      const newFiles = Array.from(files)
      setPendingFiles((prev: File[]) => [...prev, ...newFiles].slice(0, 5))
      if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const removePendingFile = (index: number) => {
      setPendingFiles(pendingFiles.filter((_, i) => i !== index))
    }

    useImperativeHandle(ref, () => ({
      uploadPendingFilesAndGetUrls: async (): Promise<string[]> => {
        if (pendingFiles.length === 0) {
          return [];
        }
        setIsUploading(true);
        let uploadedUrls: string[] = [];
        let filesUploadedCount = 0;
        let filesFailedCount = 0;
        const currentPendingFilesToUpload = [...pendingFiles]; // Create a snapshot for this upload operation

        toast({ title: "Uploading images...", description: `Starting upload of ${currentPendingFilesToUpload.length} file(s).` });

        for (const file of currentPendingFilesToUpload) {
          const fileExtension = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExtension}`;
          const filePath = `${fileName}`;

          try {
            const { error: uploadError } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
              });

            if (uploadError) {
              throw uploadError;
            }

            const { data: publicUrlData } = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              uploadedUrls.push(publicUrlData.publicUrl);
              filesUploadedCount++;
            } else {
              filesFailedCount++;
              console.error("[ImageUpload] Failed to get public URL for:", file.name);
            }
          } catch (error: any) {
            filesFailedCount++;
            console.error("[ImageUpload] Error uploading file:", file.name, error);
            toast({
              title: `Upload Error: ${file.name}`,
              description: error.message || "An unknown error occurred.",
              variant: "destructive",
            });
          }
        }
        
        setIsUploading(false);

        if (filesUploadedCount > 0) {
          toast({
            title: "Upload Finished",
            description: `${filesUploadedCount} image(s) processed successfully. ${filesFailedCount > 0 ? `${filesFailedCount} failed.` : ''}`,
            variant: filesFailedCount > 0 ? "default" : "default", // Changed from success to default
          });
        } else if (filesFailedCount > 0 && currentPendingFilesToUpload.length > 0) {
           toast({
            title: "Upload Failed",
            description: `All ${filesFailedCount} image(s) failed to upload.`,
            variant: "destructive",
          });
        }
        // Important: Return only successfully uploaded URLs for this batch
        return uploadedUrls; 
      },
      getPendingFilesCount: () => pendingFiles.length,
      clearPendingFiles: () => setPendingFiles([]),
    }));

    const removeImage = async (index: number) => {
      const imageUrlToRemove = images[index]
      const newImages = images.filter((_, i) => i !== index)
      
      try {
        const urlParts = imageUrlToRemove.split('/');
        const filePath = urlParts.slice(urlParts.indexOf(BUCKET_NAME) + 1).join('/');
        
        if (filePath) {
          const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
          if (deleteError) {
            console.error("Error deleting image from Supabase:", deleteError);
            toast({ title: "Error Deleting Image", description: "Failed to delete image from storage. It\'s removed from the list but might still exist in storage.", variant: "destructive" });
          } else {
            toast({ title: "Image Deleted", description: "Image removed from list and storage.", variant: "default" });
          }
        }
      } catch (e) {
        console.error("Error parsing URL for deletion or deleting from Supabase:", e);
        toast({ title: "Error Deleting Image", description: "Could not remove image from storage.", variant: "destructive" });
      }
      
      onImagesChange(newImages)

      if (index === primaryImageIndex) {
        onPrimaryImageChange(newImages.length > 0 ? 0 : -1)
      } else if (index < primaryImageIndex) {
        onPrimaryImageChange(primaryImageIndex - 1)
      }
    }

    const setPrimaryImage = (index: number) => {
      onPrimaryImageChange(index)
    }
    
    return (
      <div className="space-y-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drag and drop images or click to browse"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
        >
          <input
            id="image-upload-input"
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleChange}
          />
          <label htmlFor="image-upload-input" className="cursor-pointer flex flex-col items-center text-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">
              Drag & drop images or click to browse
            </p>
            <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WEBP (max 5MB per file, max 5 files)</p>
          </label>
        </div>

        {pendingFiles.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Selected for Upload ({pendingFiles.length}):</p>
              {/* <Button onClick={handleUploadPendingImages} disabled={isUploading} size="sm" type="button">
                {isUploading ? "Uploading..." : "Upload Selected"}
              </Button> */}
              {/* Removed Upload Selected Button - Parent will trigger upload */}
            </div>
            {pendingFiles.map((file, idx) => (
              <div key={file.name + '-' + idx} className="p-3 border rounded-lg bg-card shadow flex items-center justify-between">
                <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                  <FileImage className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate font-medium text-sm" title={file.name}>{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 ml-2" onClick={() => removePendingFile(idx)} title="Remove from pending" type="button" disabled={isUploading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {(images && images.length > 0) && (
          <div className="pt-4">
            <p className="text-sm font-medium mb-2">Uploaded Images ({images.length}):</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={image + '-' + index} className="relative group aspect-square rounded-md overflow-hidden border shadow-sm">
                  <Image src={image || "/placeholder.svg"} alt={`Car image ${index + 1}`} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white text-foreground"
                        onClick={() => setPrimaryImage(index)}
                        title="Set as primary image"
                        type="button"
                      >
                        {index === primaryImageIndex ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8 bg-red-500/80 hover:bg-red-500 text-white"
                        onClick={() => removeImage(index)} title="Remove image from list and storage"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {index === primaryImageIndex && (
                    <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full shadow">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

ImageUpload.displayName = "ImageUpload";
