'use client';

import React, { useState, useMemo } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Car, Fuel, Users, Cog, Search, Filter, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from 'next/navigation';

// Re-define CarData or import from a shared types file if available
interface CarData {
  id: string | number;
  make: string;
  model: string;
  name: string;
  type: string;
  price_per_day: number;
  image_url: string;
  seats: number | null;
  fuel_type: string | null;
  transmission: string | null;
}

interface FleetControlsAndListProps {
  initialCars: CarData[];
}

const FleetControlsAndList: React.FC<FleetControlsAndListProps> = ({ initialCars }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const searchParams = useSearchParams();

  const carTypes = useMemo(() => {
    const types = new Set(initialCars.map(car => car.type));
    return ['all', ...Array.from(types)];
  }, [initialCars]);

  const carModels = useMemo(() => {
    const models = new Set(initialCars.map(car => car.model));
    return ['all', ...Array.from(models).sort()];
  }, [initialCars]);

  const filteredCars = useMemo(() => {
    return initialCars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || car.type === selectedType;
      const matchesModel = selectedModel === 'all' || car.model === selectedModel;
      return matchesSearch && matchesType && matchesModel;
    });
  }, [initialCars, searchTerm, selectedType, selectedModel]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  // Build URL with search parameters
  const getCarUrl = (carId: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    return `/cars/${carId}?${params.toString()}`;
  };

  return (
    <>
      <div className="mb-8 p-4 md:p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              <Input
                type="search"
                placeholder="Search by make, model, or name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-full"
                aria-label="Search cars"
              />
            </div>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-2 items-center justify-start md:justify-end">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:w-[160px]" aria-label="Filter by car type">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                {carTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:w-[160px]" aria-label="Filter by car model">
                <CheckSquare className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Model" />
              </SelectTrigger>
              <SelectContent>
                {carModels.map(model => (
                  <SelectItem key={model} value={model}>
                    {model === 'all' ? 'All Models' : model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="w-full sm:w-auto flex-grow sm:flex-grow-0">
              More Filters <Cog className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredCars.map((car_item) => (
            <Card key={car_item.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
              <CardHeader className="p-0 relative">
                <Link href={getCarUrl(car_item.id)} aria-label={`View details for ${car_item.name}`}>
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={car_item.image_url || "/img/cars/car-placeholder.png"}
                      alt={car_item.name}
                      width={600}
                      height={375}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>
                <Badge variant="default" className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  {car_item.type || "N/A"}
                </Badge>
              </CardHeader>
              <CardContent className="p-5 flex-grow">
                <CardTitle className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{car_item.name}</CardTitle>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{car_item.seats || "N/A"} Seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-primary" />
                    <span>{car_item.fuel_type || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cog className="h-4 w-4 text-primary" />
                    <span>{car_item.transmission || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700/50 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {car_item.price_per_day} MAD
                    <span className="text-sm font-normal text-gray-600">/day</span>
                  </p>
                </div>
                <Button asChild size="default" className="text-base font-semibold">
                  <Link href={getCarUrl(car_item.id)}>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 col-span-full">
          <Search className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Cars Match Your Criteria</h3>
          <p className="text-gray-600">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </>
  );
};

export default FleetControlsAndList; 