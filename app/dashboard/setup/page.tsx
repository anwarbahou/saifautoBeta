"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createAdminUser } from "@/lib/create-admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Car } from "lucide-react"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  async function handleSetup() {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await createAdminUser()

      if (result.error) {
        setMessage({ type: "error", text: result.error })
        return
      }

      setMessage({
        type: "success",
        text: "Admin user created successfully! Email: admin@example.com, Password: Admin123!",
      })

      // Redirect to login after 5 seconds
      setTimeout(() => {
        router.push("/login")
      }, 5000)
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary p-2">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">CarRent Dashboard Setup</CardTitle>
          <CardDescription>Create an admin user to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div
              className={`rounded-md p-3 text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {message.text}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            This will create an admin user with the following credentials:
          </p>
          <div className="rounded-md bg-muted p-3">
            <p className="text-sm">
              <strong>Email:</strong> admin@example.com
            </p>
            <p className="text-sm">
              <strong>Password:</strong> Admin123!
            </p>
          </div>
          <p className="text-sm text-muted-foreground">You can change these credentials later in the settings.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetup} className="w-full" disabled={isLoading || message?.type === "success"}>
            {isLoading ? "Creating admin user..." : "Create Admin User"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
