"use server"

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
// Import createClient from the regular supabase-js SDK
import { createClient } from '@supabase/supabase-js'

// This function remains for other actions that might use it successfully
export async function createServerSupabaseClient() {
  // Attempt to await cookies() as suggested by linter hints
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle cookies in edge functions
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // Handle cookies in edge functions
          }
        },
      },
    }
  )
}

// Cars actions
export async function getCars(page: number = 1, itemsPerPage: number = 12): Promise<{ data: any[]; count: number | null; error?: string }> {
  const supabase = await createServerSupabaseClient()
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage - 1;

  // Fetch paginated data and total count in parallel
  const {
    data,
    error,
    count,
  } = await supabase
    .from("cars")
    .select("*", { count: "exact" }) // Request total count
    .order("created_at", { ascending: false })
    .range(startIndex, endIndex); // Apply pagination range

  if (error) {
    console.error("Error fetching cars:", error)
    return { data: [], count: 0, error: error.message };
  }

  return { data: data || [], count: count };
}

export async function addCar(car: any): Promise<{ success: boolean; data?: any; error?: string; fieldErrors?: Record<string, string> }> {
  // TEMPORARY DEBUGGING LOGS REMOVED
  // console.log("[SERVER ACTION DEBUG] SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);
  // console.log("[SERVER ACTION DEBUG] NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  // Use the regular Supabase client with Service Role Key for this action
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
        auth: {
            autoRefreshToken: false, 
        }
    }
  );

  try {
    const { data, error } = await supabaseAdmin 
      .from("cars")
      .insert([
        {
          make: car.make,
          model: car.model,
          year: car.year,
          category: car.category,
          color: car.color,
          license_plate: car.licensePlate,
          status: car.status,
          daily_rate: car.dailyRate,
          images: car.images || [],
          primary_image: car.primaryImage || null,
        },
      ])
      .select()
      .single(); 

    if (error) {
      // Log the raw error for precise message checking
      console.log("RAW DB ERROR in addCar:", JSON.stringify(error, null, 2)); 
      console.error("Database error in addCar (message property):", error.message);

      if (error.message.includes("duplicate key value violates unique constraint") && error.message.includes("cars_license_plate_key")) {
        return { success: false, error: "A car with this license plate already exists." };
      }
      console.error("Full Supabase error object (after duplicate check failed):", error);
      return { success: false, error: "A database error occurred while adding the car. Check server logs for details." }; 
    }

    if (!data) {
        return { success: false, error: "Failed to add car, no data returned from database." };
    }

    return { success: true, data: data };

  } catch (e: any) {
    console.error("Unexpected error in addCar action:", e);
    return { success: false, error: "An unexpected server error occurred. Please check server logs." };
  }
}

export async function updateCar(car: any): Promise<{ success: boolean; data?: any; error?: string }> {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data, error } = await supabaseAdmin
      .from("cars")
      .update({
        make: car.make,
        model: car.model,
        year: car.year,
        category: car.category,
        color: car.color,
        license_plate: car.licensePlate,
        status: car.status,
        daily_rate: car.dailyRate,
        images: car.images || [],
        primary_image: car.primaryImage || null,
      })
      .eq("id", car.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating car:", error);
      // Check for specific errors if needed, e.g., duplicate license plate if it can be changed and conflicts
      if (error.message.includes("duplicate key value violates unique constraint") && error.message.includes("cars_license_plate_key")) {
        return { success: false, error: "A car with this license plate already exists. Cannot update." };
      }
      return { success: false, error: "Failed to update car: " + error.message };
    }
    if (!data) {
      return { success: false, error: "Failed to update car, no data returned after update." };
    }
    return { success: true, data: data };
  } catch (e: any) {
    console.error("Unexpected error in updateCar action:", e);
    return { success: false, error: "An unexpected server error occurred while updating the car." };
  }
}

const CAR_IMAGES_BUCKET_NAME = "car-images"; // Define bucket name constant

export async function deleteCar(id: number): Promise<{ success: boolean; error?: string; imageDeletionError?: string }> {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let imageDeletionErrorMessages: string[] = [];

  try {
    // 1. Fetch the car record to get image URLs
    const { data: carData, error: fetchError } = await supabaseAdmin
      .from("cars")
      .select("images") // Only need the 'images' array which should contain all URLs
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: "Fetched rowcount was 0, but exactly one was expected" - means car not found, which is fine before delete.
      console.error("Error fetching car for deletion (not PGRST116):", fetchError);
      // If car not found, we might still want to proceed to ensure deletion if it's a race condition,
      // or return error if we strictly need to fetch it first.
      // For now, if car not found, image deletion is skipped, and DB deletion will also likely find nothing.
      // If it's any other error, then it's a problem.
      return { success: false, error: "Failed to fetch car details before deletion: " + fetchError.message };
    }

    if (carData && carData.images && Array.isArray(carData.images)) {
      const uniqueImageUrls = Array.from(new Set(carData.images.filter(url => typeof url === 'string' && url.trim() !== '')))

      if (uniqueImageUrls.length > 0) {
        const filePathsToRemove: string[] = [];
        for (const imageUrl of uniqueImageUrls) {
          try {
            const url = new URL(imageUrl);
            const parts = url.pathname.split('/');
            const bucketNameIndex = parts.indexOf(CAR_IMAGES_BUCKET_NAME);
            if (bucketNameIndex !== -1 && bucketNameIndex + 1 < parts.length) {
              const filePath = parts.slice(bucketNameIndex + 1).join('/');
              if (filePath) filePathsToRemove.push(filePath);
            } else {
               console.warn(`[deleteCar] Could not determine file path from URL for bucket '${CAR_IMAGES_BUCKET_NAME}': ${imageUrl}`);
            }
          } catch (e) {
            console.warn(`[deleteCar] Invalid image URL encountered while preparing for deletion: ${imageUrl}`, e);
          }
        }
        
        if (filePathsToRemove.length > 0) {
          console.log(`[deleteCar] Attempting to delete ${filePathsToRemove.length} image file(s) from storage:`, filePathsToRemove);
          const { data: storageDeleteData, error: storageDeleteError } = await supabaseAdmin.storage
            .from(CAR_IMAGES_BUCKET_NAME)
            .remove(filePathsToRemove);

          if (storageDeleteError) {
            console.error("[deleteCar] Error deleting images from Supabase storage:", storageDeleteError);
            imageDeletionErrorMessages.push("Some images failed to delete from storage: " + storageDeleteError.message);
            // We'll report this but proceed with DB record deletion.
          } else {
            console.log("[deleteCar] Image deletion attempt completed. Response:", storageDeleteData);
          }
        } else {
          console.log("[deleteCar] No valid file paths extracted from image URLs to delete from storage.");
        }
      } else {
        console.log("[deleteCar] No valid image URLs found in the car record to delete from storage.");
      }
    } else if (!fetchError) { // carData is null or images field is missing/not an array, but no fetch error (e.g. car found but no images field)
        console.log(`[deleteCar] Car record found (id: ${id}) but no images array present or it's empty. Skipping image deletion from storage.`);
    }


    // 2. Delete the car record from the database
    // This will succeed even if the record was already gone (e.g. due to a race condition or previous deletion)
    const { error: dbDeleteError } = await supabaseAdmin.from("cars").delete().eq("id", id);

    if (dbDeleteError) {
      console.error("[deleteCar] Error deleting car record from DB:", dbDeleteError);
      return { 
        success: false, 
        error: "Failed to delete car record: " + dbDeleteError.message, 
        imageDeletionError: imageDeletionErrorMessages.join("; ") || undefined
      };
    }

    // If we reached here, the DB deletion didn't throw an error.
    // The operation is considered successful regarding the DB record.
    // Include any image deletion issues as a non-blocking error string.
    if (imageDeletionErrorMessages.length > 0) {
      return { success: true, imageDeletionError: imageDeletionErrorMessages.join("; ") };
    }

    return { success: true };

  } catch (e: any) {
    console.error("[deleteCar] Unexpected error in deleteCar action:", e);
    return { 
      success: false, 
      error: "An unexpected server error occurred during car deletion.",
      imageDeletionError: imageDeletionErrorMessages.join("; ") || undefined 
    };
  }
}

interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  total_price: string | number;
  status: string;
}

interface ClientWithBookings {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  bookings: Booking[];
}

// Clients actions
export async function getClients() {
  // Use the admin client with service role key to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
      }
    }
  )
  
  // First, get all clients
  const { data: clientsData, error: clientsError } = await supabaseAdmin
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (clientsError) {
    console.error("Error fetching clients:", clientsError)
    return []
  }

  // Then, get all bookings for these clients
  const { data: bookingsData, error: bookingsError } = await supabaseAdmin
    .from('bookings')
    .select(`
      id,
      start_date,
      end_date,
      total_price,
      status,
      created_at,
      client_id
    `)
    .in('client_id', clientsData.map(client => client.id))
    .order('created_at', { ascending: false })

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError)
    // Continue with empty bookings array rather than failing completely
    return clientsData.map(client => ({
      id: client.id,
      name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
      email: client.email,
      phone: client.phone,
      join_date: client.created_at,
      status: 'Inactive',
      total_bookings: 0,
      active_bookings: 0,
      completed_bookings: 0,
      total_spent: 0,
      last_booking_date: null
    }))
  }

  // Create a map of client_id to their bookings
  const bookingsByClient = bookingsData?.reduce((acc: { [key: string]: any[] }, booking: any) => {
    if (!acc[booking.client_id]) {
      acc[booking.client_id] = []
    }
    acc[booking.client_id].push(booking)
    return acc
  }, {}) || {}

  // Process each client's data
  const processedClients = clientsData.map(client => {
    const bookings = bookingsByClient[client.id] || []
    const activeBookings = bookings.filter((b: Booking) => b.status === 'Active' || b.status === 'Confirmed')
    const completedBookings = bookings.filter((b: Booking) => b.status === 'Completed')
    // Safely handle total_price if it might be null or undefined
    const totalSpent = bookings.reduce((sum: number, b: Booking) => {
      const price = b.total_price !== null && b.total_price !== undefined ? parseFloat(b.total_price.toString()) : 0;
      return sum + (price || 0);
    }, 0)
    const lastBooking = bookings.length > 0 ? 
      bookings.sort((a: Booking, b: Booking) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0] : null

    return {
      id: client.id,
      name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
      email: client.email,
      phone: client.phone,
      join_date: client.created_at,
      status: activeBookings.length > 0 ? 'Active' : 'Inactive',
      total_bookings: bookings.length,
      active_bookings: activeBookings.length,
      completed_bookings: completedBookings.length,
      total_spent: totalSpent,
      last_booking_date: lastBooking ? lastBooking.start_date : null
    }
  })

  return processedClients
}

// Bookings actions
export async function getBookings() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      clients (id, first_name, last_name, email, phone),
      cars (id, make, model, license_plate, daily_rate)
    `)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data
}

export async function getRecentBookings(limit = 5) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      clients (id, name),
      cars (id, make, model)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent bookings:", error)
    return []
  }

  return data
}

// Action to get car counts by status for pie chart widget
export async function getCarStatsByStatus(): Promise<{ success: boolean; data?: Array<{ name: string; value: number }>; error?: string }> {
  const supabase = await createServerSupabaseClient();
  try {
    const { data: cars, error: carsError } = await supabase
      .from("cars")
      .select("status");

    if (carsError) {
      console.error("Error fetching cars for status stats:", carsError);
      return { success: false, error: carsError.message };
    }

    if (!cars) {
      return { success: false, error: "No car data found for stats." };
    }

    const counts: { [key: string]: number } = {};
    cars.forEach((car: { status: string }) => {
      counts[car.status] = (counts[car.status] || 0) + 1;
    });

    const statsData = Object.entries(counts).map(([name, value]) => ({ name, value }));
    return { success: true, data: statsData };

  } catch (e: any) {
    console.error("Unexpected error in getCarStatsByStatus:", e);
    return { success: false, error: "An unexpected server error occurred." };
  }
}

// Action to get upcoming bookings
export async function getUpcomingBookings(limit = 3): Promise<{ success: boolean; data?: any[]; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        clients (id, first_name, last_name),
        cars (id, make, model)
      `)
      .gte("start_date", today) // Greater than or equal to today
      .order("start_date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching upcoming bookings:", error);
      return { success: false, error: error.message };
    }
    return { success: true, data: data || [] };
  } catch (e: any) {
    console.error("Unexpected error in getUpcomingBookings:", e);
    return { success: false, error: "An unexpected server error occurred." };
  }
}

// Dashboard stats
export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient()

  // For now, return mock data
  // TODO: Implement real database queries
  return {
    totalRevenue: 15420.50,
    activeBookings: 8,
    availableCars: 12,
    totalClients: 45,
  }
}

export async function deleteClient(id: number): Promise<{ success: boolean; error?: string }> {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error } = await supabaseAdmin.from("clients").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
