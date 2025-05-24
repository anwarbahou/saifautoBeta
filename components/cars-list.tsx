"use client"

import { useState, useEffect } from "react"
import { Car as CarIconLucide, Edit, MoreHorizontal, Trash } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddCarModal } from "@/components/add-car-modal"
import { EditCarModal } from "@/components/edit-car-modal"
import { CarRowSkeleton } from "@/components/car-row-skeleton"
import { getCars, addCar, updateCar, deleteCar } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

// Define the Car type based on database schema and form usage
interface Car {
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

// Define the type for form data, which might use camelCase
interface CarFormData {
  id?: number;
  make: string;
  model: string;
  year: number;
  category: string;
  color: string;
  licensePlate: string;
  status: string;
  dailyRate: number;
  images: string[];
  primaryImage: string | null;
}

interface ServerActionResult {
  success: boolean;
  data?: any;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export function CarsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCar, setEditingCar] = useState<CarFormData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function loadCars() {
      try {
        const data: Car[] = await getCars()
        setCars(data)
      } catch (error) {
        console.error("Failed to load cars:", error);
        toast({
          title: "Error",
          description: "Failed to load cars. See console for details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCars()
  }, [toast])

  const filteredCars = cars.filter(
    (car) =>
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.license_plate && car.license_plate.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddCar = async (newCarData: CarFormData): Promise<ServerActionResult> => {
    const carToAdd = {
      make: newCarData.make,
      model: newCarData.model,
      year: newCarData.year,
      category: newCarData.category,
      color: newCarData.color,
      licensePlate: newCarData.licensePlate,
      status: newCarData.status,
      dailyRate: newCarData.dailyRate,
      images: newCarData.images || [],
      primaryImage: newCarData.primaryImage || null,
    }

    const result = await addCar(carToAdd)

    if (!result.success) {
      return result;
    }

    if (result.data) {
      const newCarFromResponse = result.data as any;
      const formattedNewCar: Car = {
        id: newCarFromResponse.id,
        make: newCarFromResponse.make,
        model: newCarFromResponse.model,
        year: newCarFromResponse.year,
        category: newCarFromResponse.category,
        color: newCarFromResponse.color,
        license_plate: newCarFromResponse.license_plate,
        status: newCarFromResponse.status,
        daily_rate: newCarFromResponse.daily_rate,
        images: newCarFromResponse.images || [],
        primary_image: newCarFromResponse.primary_image || null,
      };

      setCars((prevCars) => [...prevCars, formattedNewCar]);
      toast({
        title: "Success",
        description: "Car added successfully",
      })
      return result;
    } else {
      console.error("Add car action reported success but returned no data. This is unexpected.");
      return { success: false, error: "Car was supposedly added, but no data was returned from the server. Please check server logs." };
    }
  }

  const handleEditCar = (car: Car) => {
    const transformedCar: CarFormData = {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      category: car.category,
      color: car.color,
      licensePlate: car.license_plate,
      status: car.status,
      dailyRate: car.daily_rate,
      images: car.images || [],
      primaryImage: car.primary_image,
    }

    setEditingCar(transformedCar)
    setIsEditModalOpen(true)
  }

  const handleUpdateCar = async (updatedCarData: CarFormData): Promise<ServerActionResult> => {
    const carToUpdate = {
      id: updatedCarData.id!,
      make: updatedCarData.make,
      model: updatedCarData.model,
      year: updatedCarData.year,
      category: updatedCarData.category,
      color: updatedCarData.color,
      licensePlate: updatedCarData.licensePlate,
      status: updatedCarData.status,
      dailyRate: updatedCarData.dailyRate,
      images: updatedCarData.images || [],
      primaryImage: updatedCarData.primaryImage || null,
    }

    const result = await updateCar(carToUpdate);

    if (!result.success) {
      return result;
    }

    if (result.data) {
      const updatedCarFromResponse = result.data as any;
      const formattedUpdatedCar: Car = {
          id: updatedCarFromResponse.id,
          make: updatedCarFromResponse.make,
          model: updatedCarFromResponse.model,
          year: updatedCarFromResponse.year,
          category: updatedCarFromResponse.category,
          color: updatedCarFromResponse.color,
          license_plate: updatedCarFromResponse.license_plate,
          status: updatedCarFromResponse.status,
          daily_rate: updatedCarFromResponse.daily_rate,
          images: updatedCarFromResponse.images || [],
          primary_image: updatedCarFromResponse.primary_image || null,
      };
      setCars((prevCars) => prevCars.map((c) => (c.id === formattedUpdatedCar.id ? formattedUpdatedCar : c)))
      toast({
        title: "Success",
        description: "Car updated successfully",
      });
      return result;
    } else {
      console.error("Update car action reported success but returned no data. This is unexpected.");
      return { success: false, error: "Car was supposedly updated, but no data was returned from the server. Please check server logs." };
    }
  }

  const handleDeleteCar = async (carId: number) => {
    console.log("[handleDeleteCar] Attempting to delete car ID:", carId);
    try {
      const result = await deleteCar(carId);
      console.log("[handleDeleteCar] Result from server action:", result);

      if (result.success) {
        setCars((prevCars) => prevCars.filter((car) => car.id !== carId))
        console.log("[handleDeleteCar] TOASTING: Success - Car deleted successfully");
        toast({
          title: "Success",
          description: "Car deleted successfully",
        });
      } else {
        console.error("Failed to delete car (from server action):", result.error);
        console.log("[handleDeleteCar] TOASTING: Error -", result.error);
        toast({
          title: "Error Deleting Car",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Unexpected error in handleDeleteCar:", error);
      console.log("[handleDeleteCar] TOASTING: Fallback Error - Unexpected client-side issue");
      toast({
        title: "Error",
        description: "Failed to delete car due to an unexpected client-side issue. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Cars Fleet</CardTitle>
            <CardDescription>Manage your rental vehicles</CardDescription>
          </div>
          <AddCarModal onAddCar={handleAddCar} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Make & Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <CarRowSkeleton key={index} />
                ))
              ) : filteredCars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    No cars found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="relative h-12 w-16 overflow-hidden rounded-md">
                        {car.primary_image ? (
                          <Image
                            src={car.primary_image || "/placeholder.svg"}
                            alt={`${car.make} ${car.model}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <CarIconLucide className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">CAR-{car.id.toString().padStart(3, "0")}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span>{`${car.make} ${car.model}`}</span>
                      </div>
                    </TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>{car.category}</TableCell>
                    <TableCell>{car.license_plate}</TableCell>
                    <TableCell>
                      {(() => {
                        let badgeVariant: "default" | "secondary" | "destructive" | "outline" | null | undefined;
                        if (car.status === "Available") {
                          badgeVariant = "secondary";
                        } else if (car.status === "Rented") {
                          badgeVariant = "default";
                        } else {
                          badgeVariant = "destructive";
                        }
                        return (
                          <Badge variant={badgeVariant}>
                            {car.status}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell>${car.daily_rate}/day</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditCar(car)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCar(car.id)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete car
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {editingCar && (
        <EditCarModal
          car={editingCar}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onUpdateCar={handleUpdateCar}
        />
      )}
    </Card>
  )
}
