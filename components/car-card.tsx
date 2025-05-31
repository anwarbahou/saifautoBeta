"use client"

import Image from "next/image"
import { Car as CarIconLucide, Edit, MoreHorizontal, Trash, CalendarDays, Palette, Tag, DollarSign, Gauge, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

// Define the Car type (can be imported from a shared types file later)
export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  color: string;
  license_plate: string;
  status: string;
  daily_rate: number;
  images: string[];
  primary_image: string | null;
}

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (carId: number) => void;
  onPreview: (car: Car) => void;
}

export function CarCard({ car, onEdit, onDelete, onPreview }: CarCardProps) {
  const getStatusBadgeVariant = (status: string) => {
    if (status === "Available") return "secondary"
    if (status === "Rented") return "default"
    return "destructive" // For "Maintenance" or other statuses
  }

  const getStatusIcon = (status: string) => {
    if (status === "Available") return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
    if (status === "Rented") return <XCircle className="mr-2 h-4 w-4 text-red-500" />;
    if (status === "Maintenance") return <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />;
    return <ShieldCheck className="mr-2 h-4 w-4" />; // Default or other statuses
  }

  // Prepare unique images, primary first
  const allDisplayImages = car.primary_image
    ? [car.primary_image, ...(car.images || []).filter(img => img !== car.primary_image)]
    : (car.images || []);
  const uniqueDisplayImages = Array.from(new Set(allDisplayImages.filter(img => typeof img === 'string' && img.trim() !== '')));

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <CardHeader className="p-0 relative">
        <div className="w-full relative">
          {uniqueDisplayImages.length > 1 ? (
            <Carousel opts={{ loop: uniqueDisplayImages.length > 1 }} className="w-full">
              <CarouselContent>
                {uniqueDisplayImages.map((imageSrc, index) => (
                  <CarouselItem key={index}>
                    <div 
                      className="aspect-[16/10] w-full relative overflow-hidden bg-muted rounded-md cursor-pointer group/image"
                      onClick={(e) => {
                        // Check if the click target is one of the carousel navigation buttons
                        // This is a safeguard, though typically direct clicks on buttons won't trigger this parent div's onClick.
                        const target = e.target as HTMLElement;
                        if (target.closest(".absolute[class*=\"left-2\"], .absolute[class*=\"right-2\"]")) {
                          return; // Do nothing if a nav button was clicked
                        }
                        onPreview(car);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onPreview(car);
                        }
                      }}
                      aria-label={`Preview ${car.make} ${car.model}`}
                    >
                      <Image
                        src={imageSrc || "/img/cars/car-placeholder.png"}
                        alt={`${car.make} ${car.model} image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover/image:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-50 hover:opacity-100 focus:opacity-100 transition-opacity" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-50 hover:opacity-100 focus:opacity-100 transition-opacity" />
            </Carousel>
          ) : uniqueDisplayImages.length === 1 ? (
            <div 
              className="aspect-[16/10] w-full relative overflow-hidden bg-muted rounded-md cursor-pointer group/image"
              onClick={() => onPreview(car)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onPreview(car);
                }
              }}
              aria-label={`Preview ${car.make} ${car.model}`}
            >
              <Image
                src={uniqueDisplayImages[0] || "/img/cars/car-placeholder.png"}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover transition-transform duration-300 group-hover/image:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="aspect-[16/10] w-full flex items-center justify-center bg-muted rounded-md">
              <CarIconLucide className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 bg-background/80 hover:bg-background"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onPreview(car)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview Car
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(car)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Car
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => onDelete(car.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Car
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge 
          variant={getStatusBadgeVariant(car.status)} 
          className="absolute top-2 left-2 flex items-center z-10"
        >
          {getStatusIcon(car.status)}
          {car.status}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold mb-1">
          {car.make} {car.model}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-3">
          ID: CAR-{car.id.toString().padStart(3, "0")}
        </CardDescription>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Year: {car.year}</span>
          </div>
          <div className="flex items-center">
            <Gauge className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Category: {car.category}</span>
          </div>
          <div className="flex items-center">
            <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Color: {car.color}</span>
          </div>
          <div className="flex items-center">
            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>License: {car.license_plate}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-muted/40 border-t">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-muted-foreground">Daily Rate</p>
          <p className="text-lg font-semibold">
            ${car.daily_rate.toFixed(2)}
            <span className="text-xs text-muted-foreground">/day</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  )
} 