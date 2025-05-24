"use server"

import { createServerClient as _createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from "uuid"

// export async function uploadCarImage(file: File) { // Commented out - moving to client-side
//   try {
//     const cookieStore = cookies()
//     const supabase = _createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           get(name: string) {
//             return cookieStore.get(name)?.value
//           },
//           set(name: string, value: string, options: CookieOptions) {
//             cookieStore.set(name, value, options)
//           },
//           remove(name: string, options: CookieOptions) {
//             cookieStore.delete(name, options)
//           },
//         },
//       }
//     )

//     // Create the bucket if it doesn't exist
//     const { error: bucketError } = await supabase.storage.createBucket("car-images", {
//       public: true,
//       fileSizeLimit: 5242880, // 5MB
//       allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
//     })

//     // Ignore "Bucket already exists" error
//     if (bucketError && !bucketError.message.includes("already exists")) {
//       console.error("Error creating bucket:", bucketError)
//       throw new Error(bucketError.message)
//     }

//     // Convert the file to an ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer()
//     const buffer = new Uint8Array(arrayBuffer)

//     // Generate a unique filename
//     const fileExt = file.name.split(".").pop()
//     const fileName = `${uuidv4()}.${fileExt}`
//     const filePath = `${fileName}`

//     // Upload the file to Supabase Storage
//     const { data, error } = await supabase.storage.from("car-images").upload(filePath, buffer, {
//       contentType: file.type,
//       upsert: false,
//     })

//     if (error) {
//       console.error("Error uploading image:", error)
//       throw new Error(error.message)
//     }

//     // Get the public URL for the uploaded file
//     const {
//       data: { publicUrl },
//     } = supabase.storage.from("car-images").getPublicUrl(filePath)

//     return publicUrl
//   } catch (error) {
//     console.error("Error in uploadCarImage:", error)
//     throw error
//   }
// }

// export async function deleteCarImage(imageUrl: string) { // Commented out for now
//   try {
//     const cookieStore = cookies()
//     const supabase = _createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           get(name: string) {
//             return cookieStore.get(name)?.value
//           },
//           set(name: string, value: string, options: CookieOptions) {
//             cookieStore.set(name, value, options)
//           },
//           remove(name: string, options: CookieOptions) {
//             cookieStore.delete(name, options)
//           },
//         },
//       }
//     )

//     // Extract the file path from the URL
//     const urlObj = new URL(imageUrl)
//     const pathParts = urlObj.pathname.split("/")
//     const bucketName = pathParts[1]
//     const filePath = pathParts.slice(2).join("/")

//     // Delete the file from Supabase Storage
//     const { error } = await supabase.storage.from(bucketName).remove([filePath])

//     if (error) {
//       console.error("Error deleting image:", error)
//       throw new Error(error.message)
//     }

//     return true
//   } catch (error) {
//     console.error("Error in deleteCarImage:", error)
//     throw error
//   }
// }
