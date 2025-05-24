"use server"

import { createUser } from "@/lib/auth"

export async function createAdminUser() {
  const email = "admin@example.com"
  const password = "Admin123!"

  try {
    const result = await createUser(email, password)

    if (result.error) {
      console.error("Error creating admin user:", result.error)
      return { error: result.error }
    }

    return { success: true, user: result.user }
  } catch (error) {
    console.error("Unexpected error creating admin user:", error)
    return { error: "An unexpected error occurred" }
  }
}
