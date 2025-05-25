"use client"

import Image from "next/image"
import {
  Car as CarIconLucide,
  Edit,
  Trash,
  CalendarDays,
  Palette,
  Tag,
  Gauge,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ResponsiveDialogOrDrawer } from "@/components/ui/ResponsiveDialogOrDrawer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Car } from "./car-card"

interface CarDetailsModalProps {
  car: Car | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (car: Car) => void;
  onDelete: (carId: number) => void;
}

export function CarDetailsModal({
  car,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: CarDetailsModalProps) {
  if (!car) return null;

  const handleEdit = () => {
    onEdit(car);
    onOpenChange(false); // Close this modal to open the edit modal
  };

  const handleDelete = () => {
    onDelete(car.id);
    onOpenChange(false); // Close this modal
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === "Available") return "secondary";
    if (status === "Rented") return "default";
    return "destructive";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Available") return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
    if (status === "Rented") return <XCircle className="mr-2 h-4 w-4 text-red-500" />;
    if (status === "Maintenance") return <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />;
    return <ShieldCheck className="mr-2 h-4 w-4" />;
  };

  const allImages = car.primary_image 
    ? [car.primary_image, ...(car.images || []).filter(img => img !== car.primary_image)] 
    : (car.images || []);
  const uniqueImages = Array.from(new Set(allImages.filter(img => typeof img === 'string' && img.trim() !== '')));

  const modalTitle = car ? `${car.make} ${car.model}` : "Car Details";
  const modalDescription = car ? `ID: CAR-${car.id.toString().padStart(3, "0")}` : "Details for the selected car.";

  const modalFooter = (
    <Button variant="outline" onClick={() => onOpenChange(false)} aria-label="Close details modal">
      Close
    </Button>
  );

  return (
    <ResponsiveDialogOrDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={modalTitle}
      description={modalDescription}
      footer={modalFooter}
      className="sm:max-w-2xl"
    >
      <div className="py-4 space-y-6">
        <div className="flex space-x-2 justify-end mb-4">
          <Button variant="ghost" onClick={handleEdit} size="icon" aria-label="Edit car">
            <Edit className="h-5 w-5" />
          </Button>
          <Button variant="destructive" onClick={handleDelete} size="icon" aria-label="Delete car">
            <Trash className="h-5 w-5" />
          </Button>
        </div>

        {uniqueImages.length > 0 ? (
          <Carousel opts={{ loop: uniqueImages.length > 1 }} className="w-full">
            <CarouselContent>
              {uniqueImages.map((imageSrc, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[16/9] w-full relative overflow-hidden rounded-md bg-muted">
                    <Image
                      src={imageSrc}
                      alt={`${car.make} ${car.model} image ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {uniqueImages.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="aspect-[16/9] w-full flex items-center justify-center bg-muted rounded-md">
            <CarIconLucide className="h-24 w-24 text-muted-foreground" />
            <p className="sr-only">No images available</p>
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{car.year}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{car.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Color</p>
              <p className="font-medium">{car.color}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">License Plate</p>
              <p className="font-medium">{car.license_plate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(car.status)}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={getStatusBadgeVariant(car.status)} className="font-medium">
                {car.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Daily Rate</p>
              <p className="font-medium">${car.daily_rate.toFixed(2)} / day</p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveDialogOrDrawer>
  );
} 