"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Car as CarIconLucide, Edit, MoreHorizontal, Trash, Plus } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tag,
  Palette,
  DollarSign,
  Key,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react"

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
  const [allFetchedCars, setAllFetchedCars] = useState<Car[]>([]) // To store all cars if needed for filter dropdowns
  const [displayedCars, setDisplayedCars] = useState<Car[]>([]) // Cars for the current page
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
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Fetches cars for the current page
  const loadPaginatedCars = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const { data, count, error } = await getCars(page, itemsPerPage);
      if (error) {
        throw new Error(error);
      }
      setDisplayedCars(data); // Set current page's cars
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      // If allFetchedCars is meant to populate filter dropdowns with *all* possible options,
      // it would need a separate fetch or a different strategy. For now, it's not being updated here.
    } catch (error: any) {
      console.error("Failed to load cars:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load cars. See console for details.",
        variant: "destructive",
      });
      setDisplayedCars([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [toast, itemsPerPage]);

  // Initial load and when currentPage changes
  useEffect(() => {
    loadPaginatedCars(currentPage);
  }, [currentPage, loadPaginatedCars]);
  
  // Effect to load all cars once for filter dropdowns (if this is the desired strategy)
  useEffect(() => {
    async function loadAllCarsForFilters() {
      try {
        // This fetches ALL cars. If this is too much, an alternative strategy for filters is needed.
        const { data, error } = await getCars(1, 10000); // Fetch a large number for filters
        if (error) throw new Error(error);
        setAllFetchedCars(data);
      } catch (error:any) {
        console.error("Failed to load all cars for filters:", error);
        // Potentially toast or handle this error for filter population
      }
    }
    loadAllCarsForFilters();
  }, []);

  const filteredCars = useMemo(() => {
    // This now filters only the `displayedCars` (current page data)
    return displayedCars.filter((car) => {
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
  }, [displayedCars, searchTerm, selectedMake, selectedModel, selectedYear, selectedStatus]);
  
  const uniqueMakes = useMemo(() => Array.from(new Set(allFetchedCars.map((car) => car.make))), [allFetchedCars]);
  const uniqueModels = useMemo(() => {
    let models = allFetchedCars;
    if (selectedMake) {
      models = models.filter(car => car.make === selectedMake);
    }
    return Array.from(new Set(models.map((car) => car.model)));
  }, [allFetchedCars, selectedMake]);
  const uniqueYears = useMemo(() => Array.from(new Set(allFetchedCars.map((car) => car.year.toString()))).map(Number).sort((a, b) => b - a), [allFetchedCars]);
  const uniqueStatuses = useMemo(() => Array.from(new Set(allFetchedCars.map((car) => car.status))), [allFetchedCars]);

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
      // Add to displayedCars if on the first page (or handle differently)
      // Also update allFetchedCars for filters
      loadPaginatedCars(currentPage); // Refresh current page
      setAllFetchedCars(prev => [newCarFromResponse, ...prev]); // Add to master list for filters
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
      loadPaginatedCars(currentPage); // Refresh current page
      setAllFetchedCars(prev => prev.map(c => c.id === result.data.id ? result.data : c)); // Update in master list
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
    const result = await deleteCar(carId);
    if (result.success) {
      toast({
        title: "Success",
        description: "Car deleted successfully." + (result.imageDeletionError ? ` Warning: ${result.imageDeletionError}` : ""),
      });
      loadPaginatedCars(currentPage); // Corrected: Refresh current page using the renamed function
      setAllFetchedCars(prev => prev.filter(c => c.id !== carId)); // Remove from master list
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete car. An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

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
    setCurrentPage(1); // Reset to page 1 when filters are reset
    // loadCars(1); // Fetch data for page 1 with cleared filters (if filters were server-side)
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Current cars to render are now directly from filteredCars as pagination is handled by API
  // const currentCars = filteredCars; // No longer slicing client-side

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
          <Button onClick={() => setIsEditModalOpen(true)} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un véhicule
          </Button>
        </div>
        <div className="mt-6 flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Rechercher un véhicule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Select value={selectedMake} onValueChange={setSelectedMake}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Marque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les marques</SelectItem>
                {Array.from(new Set(allFetchedCars.map(car => car.make))).sort().map(make => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les modèles</SelectItem>
                {Array.from(new Set(allFetchedCars.map(car => car.model))).sort().map(model => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear?.toString()} onValueChange={(value) => setSelectedYear(value ? parseInt(value) : null)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les années</SelectItem>
                {Array.from(new Set(allFetchedCars.map(car => car.year))).sort().map(year => (
                  <SelectItem key={year} value={year?.toString() || ""}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="État" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les états</SelectItem>
                <SelectItem value="Available">Disponible</SelectItem>
                <SelectItem value="Rented">Loué</SelectItem>
                <SelectItem value="Maintenance">En maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleResetFilters} variant="outline">Reset Filters</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Chargement des véhicules...</span>
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
            {filteredCars.map((car) => (
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
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} aria-disabled={currentPage <= 1} className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined} />
                </PaginationItem>
                {getPaginationItems()}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} aria-disabled={currentPage >= totalPages} className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
      <CardFooter>
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
            onEdit={handleEditCar}
            onDelete={handleDeleteCar}
          />
        )}
      </CardFooter>
    </Card>
  )
}
