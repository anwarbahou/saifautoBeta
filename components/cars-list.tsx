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
import { AddCarModal } from "@/components/add-car-modal"
import { EditCarModal } from "@/components/edit-car-modal"
import { CarCard, Car as CarCardType } from "@/components/car-card"
import { CarCardSkeleton } from "@/components/car-card-skeleton"
import { CarDetailsModal } from "@/components/car-details-modal"
import { getCars, addCar, updateCar, deleteCar } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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
  const [viewingCar, setViewingCar] = useState<CarCardType | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const { toast } = useToast()

  const [selectedMake, setSelectedMake] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 rows on xl:grid-cols-4

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

  const filteredCars = cars.filter((car) => {
    const matchesSearchTerm =
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.license_plate && car.license_plate.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMake = selectedMake ? car.make === selectedMake : true;
    const matchesModel = selectedModel ? car.model === selectedModel : true;
    const matchesYear = selectedYear ? car.year === selectedYear : true;
    const matchesStatus = selectedStatus ? car.status === selectedStatus : true;

    return matchesSearchTerm && matchesMake && matchesModel && matchesYear && matchesStatus;
  });

  const uniqueMakes = Array.from(new Set(cars.map((car) => car.make)));
  const uniqueModels = Array.from(new Set(cars.map((car) => car.model)));
  const uniqueYears = Array.from(new Set(cars.map((car) => car.year.toString()))).map(Number).sort((a, b) => b - a);
  const uniqueStatuses = Array.from(new Set(cars.map((car) => car.status)));

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

  const handleEditCar = (carToEdit: CarCardType) => {
    const transformedCar: CarFormData = {
      id: carToEdit.id,
      make: carToEdit.make,
      model: carToEdit.model,
      year: carToEdit.year,
      category: carToEdit.category,
      color: carToEdit.color,
      licensePlate: carToEdit.license_plate,
      status: carToEdit.status,
      dailyRate: carToEdit.daily_rate,
      images: carToEdit.images || [],
      primaryImage: carToEdit.primary_image,
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
        if (result.imageDeletionError) {
          console.warn("[handleDeleteCar] Image deletion issue:", result.imageDeletionError);
          toast({
            title: "Image Deletion Warning",
            description: result.imageDeletionError,
            variant: "default", // Or another appropriate variant like warning if available
            duration: 5000, 
          });
        }
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

  const handleViewCarDetails = (car: CarCardType) => {
    setViewingCar(car);
    setIsViewModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedStatus(null);
    setCurrentPage(1); // Reset to first page on filter reset
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top of page on page change
  };

  const getPaginationItems = () => {
    const paginationItems = [];
    const maxPagesToShow = 5; // Max number of page links to show (e.g., 1 ... 3 4 5 ... 10)
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      let startPage = Math.max(2, currentPage - halfMaxPages + (currentPage + halfMaxPages > totalPages ? totalPages - currentPage - halfMaxPages +1: 0) );
      let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages - (currentPage <= halfMaxPages ? halfMaxPages - currentPage +1 : 0) );
      
      if (currentPage - 1 > halfMaxPages && totalPages > maxPagesToShow-1 ){
          if(startPage > 2) paginationItems.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }

      for (let i = startPage; i <= endPage; i++) {
        paginationItems.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (totalPages - currentPage > halfMaxPages && totalPages > maxPagesToShow -1 ){
          if(endPage < totalPages -1) paginationItems.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
      // Show last page
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return paginationItems;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Cars Fleet</CardTitle>
            <CardDescription>Manage your rental vehicles. View details, edit, or add new cars.</CardDescription>
          </div>
          <AddCarModal onAddCar={handleAddCar} />
        </div>
        <div className="mt-6 flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search by make, model, or license plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Select value={selectedMake || ""} onValueChange={(value) => setSelectedMake(value === "all" ? null : value)}>
              <SelectTrigger className={`w-full md:w-[160px] ${selectedMake ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                <SelectValue placeholder="Filter by Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {uniqueMakes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedModel || ""} onValueChange={(value) => setSelectedModel(value === "all" ? null : value)} disabled={!selectedMake && uniqueModels.length === 0}>
              <SelectTrigger className={`w-full md:w-[160px] ${selectedModel ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                <SelectValue placeholder="Filter by Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {uniqueModels
                  .filter(model => !selectedMake || cars.find(car => car.make === selectedMake && car.model === model))
                  .map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear?.toString() || ""} onValueChange={(value) => setSelectedYear(value === "all" ? null : parseInt(value))}>
              <SelectTrigger className={`w-full md:w-[120px] ${selectedYear ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus || ""} onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}>
              <SelectTrigger className={`w-full md:w-[150px] ${selectedStatus ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleResetFilters} variant="outline">Reset Filters</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <CarIconLucide className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Cars Found</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? `No cars match your search for "${searchTerm}". Try a different term.`
                : "There are no cars in the fleet yet. Click 'Add Car' to get started!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
            {currentCars.map((car) => (
              <div key={car.id} className="cursor-pointer">
                <CarCard
                  car={car}
                  onEdit={() => handleEditCar(car)}
                  onDelete={() => handleDeleteCar(car.id)}
                  onPreview={() => handleViewCarDetails(car)}
                />
              </div>
            ))}
          </div>
        )}
        {!loading && filteredCars.length > itemsPerPage && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                {getPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handlePageChange(currentPage + 1); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      {editingCar && (
        <EditCarModal
          car={editingCar}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onUpdateCar={handleUpdateCar}
        />
      )}

      {viewingCar && (
        <CarDetailsModal
          car={viewingCar}
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          onEdit={() => {
            setIsViewModalOpen(false);
            handleEditCar(viewingCar);
          }}
          onDelete={() => {
            setIsViewModalOpen(false);
            handleDeleteCar(viewingCar.id);
          }}
        />
      )}
    </Card>
  )
}
