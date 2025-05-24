"use client"

import { useState, useEffect, useRef } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload, ImageUploadRef } from "@/components/image-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  make: z.string().min(2, { message: "Make must be at least 2 characters." }),
  model: z.string().min(1, { message: "Model is required." }),
  year: z.string().regex(/^\d{4}$/, { message: "Year must be a 4-digit number." }),
  category: z.string().min(1, { message: "Category is required." }),
  color: z.string().min(1, { message: "Color is required." }),
  licensePlate: z.string().min(1, { message: "License plate is required." }),
  status: z.string().min(1, { message: "Status is required." }),
  dailyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Daily rate must be a valid number." }),
})

type FormValues = z.infer<typeof formSchema>

interface ServerActionResult {
  success: boolean;
  data?: any;
  error?: string;
  fieldErrors?: Record<string, string>;
}

interface EditCarModalProps {
  car: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateCar: (car: any) => Promise<ServerActionResult>
}

export function EditCarModal({ car, open, onOpenChange, onUpdateCar }: EditCarModalProps) {
  const [images, setImages] = useState<string[]>([])
  const [primaryImageIndex, setPrimaryImageIndex] = useState(-1)
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const imageUploadRef = useRef<ImageUploadRef>(null)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      category: "",
      color: "",
      licensePlate: "",
      status: "",
      dailyRate: "",
    },
  })

  // Update form when car changes
  useEffect(() => {
    if (car) {
      form.reset({
        make: car.make || "",
        model: car.model || "",
        year: car.year ? car.year.toString() : "",
        category: car.category || "",
        color: car.color || "",
        licensePlate: car.licensePlate || "",
        status: car.status || "",
        dailyRate: car.dailyRate ? car.dailyRate.toString() : "",
      })

      // Set images if they exist
      if (car.images) {
        setImages(car.images)
        if (car.primaryImage) {
          const index = car.images.findIndex((img: string) => img === car.primaryImage)
          setPrimaryImageIndex(index !== -1 ? index : (car.images.length > 0 ? 0 : -1))
        } else {
          setPrimaryImageIndex(car.images.length > 0 ? 0 : -1)
        }
      } else {
        setImages([])
        setPrimaryImageIndex(-1)
      }
      imageUploadRef.current?.clearPendingFiles();
    }
  }, [car, form])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    if (!car?.id) {
      toast({
        title: "Error",
        description: "No car selected for editing.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    let finalImageUrls = [...images];

    try {
      // Upload any pending images from ImageUpload component
      if (imageUploadRef.current && imageUploadRef.current.getPendingFilesCount() > 0) {
        console.log("[EditCarModal] Found pending files. Triggering upload...");
        const newUploadedUrls = await imageUploadRef.current.uploadPendingFilesAndGetUrls();
        if (newUploadedUrls.length > 0) {
          finalImageUrls = [...finalImageUrls, ...newUploadedUrls];
          setImages(finalImageUrls);
          imageUploadRef.current.clearPendingFiles();
        }
        console.log("[EditCarModal] Pending files processed. New URLs:", newUploadedUrls);
      }

      const updatedCar = {
        ...car,
        make: values.make,
        model: values.model,
        year: Number.parseInt(values.year),
        category: values.category,
        color: values.color,
        licensePlate: values.licensePlate,
        status: values.status,
        dailyRate: Number.parseFloat(values.dailyRate),
        images: finalImageUrls,
        primaryImage: primaryImageIndex >= 0 && finalImageUrls[primaryImageIndex] ? finalImageUrls[primaryImageIndex] : null,
      }
      
      console.log("[EditCarModal] Calling onUpdateCar with:", updatedCar);
      const result = await onUpdateCar(updatedCar);
      console.log("[EditCarModal] Received result from onUpdateCar:", result);

      if (result && result.success) {
        console.log("[EditCarModal] onUpdateCar was successful. Closing modal.");
        setActiveTab("details")
        onOpenChange(false)
      } else {
        console.log("[EditCarModal] onUpdateCar reported an error or no success. Result:", result);
        const errorMessage = result?.error || "An unexpected error occurred while updating the car. Please try again.";
        console.log("[EditCarModal TOASTING FOR ERROR] Message:", errorMessage);
        toast({
          title: "Error Updating Car",
          description: errorMessage,
          variant: "destructive",
        })
      }

    } catch (error: any) { // This catch block should ideally not be hit for handled server errors
      console.error("[EditCarModal] UNEXPECTED error caught in onSubmit try/catch block:", error);
      const errorMessage = error?.message || "An unexpected client-side error occurred. Please try again.";
      toast({
        title: "Critical Client Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setActiveTab("details")
      imageUploadRef.current?.clearPendingFiles();
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen)
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Car</DialogTitle>
          <DialogDescription>Update the details of this car.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Car Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <FormControl>
                          <Input placeholder="Toyota" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Camry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Luxury">Luxury</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                            <SelectItem value="Compact">Compact</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Plate</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Rented">Rented</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dailyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Rate ($)</FormLabel>
                        <FormControl>
                          <Input placeholder="65.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="images">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Car Images</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update the images for this car. The primary image will be displayed in the car list.
                    </p>
                  </div>
                  <ImageUpload
                    ref={imageUploadRef}
                    images={images}
                    onImagesChange={(updatedImages) => {
                      setImages(updatedImages)
                      if (primaryImageIndex >= updatedImages.length) {
                        setPrimaryImageIndex(updatedImages.length > 0 ? 0 : -1);
                      }
                    }}
                    primaryImageIndex={primaryImageIndex}
                    onPrimaryImageChange={setPrimaryImageIndex}
                  />
                </div>
              </TabsContent>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Car"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
