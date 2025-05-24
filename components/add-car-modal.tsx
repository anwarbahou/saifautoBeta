"use client"

import { useState, useRef } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface AddCarModalProps {
  onAddCar: (car: any) => Promise<ServerActionResult>;
}

export function AddCarModal({ onAddCar }: AddCarModalProps) {
  const [open, setOpen] = useState(false)
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
      year: new Date().getFullYear().toString(),
      category: "",
      color: "",
      licensePlate: "",
      status: "Available",
      dailyRate: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    let finalImageUrls = [...images];

    try {
      if (imageUploadRef.current && imageUploadRef.current.getPendingFilesCount() > 0) {
        console.log("[AddCarModal] Found pending files. Triggering upload...");
        const newUploadedUrls = await imageUploadRef.current.uploadPendingFilesAndGetUrls();
        if (newUploadedUrls.length > 0) {
          finalImageUrls = [...finalImageUrls, ...newUploadedUrls];
          setImages(finalImageUrls);
          imageUploadRef.current.clearPendingFiles();
        }
        console.log("[AddCarModal] Pending files processed. New URLs:", newUploadedUrls);
      }

      const newCar = {
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

      console.log("[AddCarModal] Calling onAddCar with:", newCar);
      const result = await onAddCar(newCar);
      console.log("[AddCarModal] Received result from onAddCar:", result);

      if (result && result.success) {
        console.log("[AddCarModal] onAddCar was successful. Resetting form.");
        form.reset({
          make: "",
          model: "",
          year: new Date().getFullYear().toString(),
          category: "",
          color: "",
          licensePlate: "",
          status: "Available",
          dailyRate: "",
        })
        setImages([])
        setPrimaryImageIndex(-1)
        setActiveTab("details")
        setOpen(false)
      } else {
        console.log("[AddCarModal] onAddCar reported an error or no success. Result:", result);
        const errorMessage = result?.error || "An unexpected error occurred while adding the car. Please try again."
        console.log("[AddCarModal TOASTING FOR ERROR] Message:", errorMessage);
        toast({
          title: "Error Adding Car",
          description: errorMessage,
          variant: "destructive",
        })
      }

    } catch (error: any) {
      console.error("[AddCarModal] UNEXPECTED error caught in onSubmit try/catch block:", error);
      const errorMessage = error?.message || "An unexpected client-side error occurred. Please try again."
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
      form.reset({
        make: "",
        model: "",
        year: new Date().getFullYear().toString(),
        category: "",
        color: "",
        licensePlate: "",
        status: "Available",
        dailyRate: "",
      })
      setImages([])
      setPrimaryImageIndex(-1)
      setActiveTab("details")
      setOpen(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          setOpen(newOpen)
          if (!newOpen) {
            handleClose()
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Car
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Car</DialogTitle>
          <DialogDescription>Enter the details of the new car to add to your fleet.</DialogDescription>
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
                        <Select onValueChange={field.onChange} value={field.value || "Available"}>
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
                      Upload images of the car. The primary image will be displayed in the car list.
                    </p>
                  </div>
                  <ImageUpload
                    ref={imageUploadRef}
                    images={images}
                    onImagesChange={(updatedImages) => setImages(updatedImages)}
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
                  {isSubmitting ? "Adding..." : "Add Car"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
