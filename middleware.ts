import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession()

    // Handle authentication
    const isAuthPage = req.nextUrl.pathname === '/login'

    if (error) {
      console.error('Middleware auth error:', error.message)
      return isAuthPage ? res : redirectToLogin(req)
    }

    // Check auth conditions
    if (session) {
      // If authenticated and trying to access login page, redirect to dashboard
      if (isAuthPage) {
        return redirectToDashboard(req)
      }
    } else {
      // If not authenticated and trying to access protected route, redirect to login
      if (!isAuthPage) {
        return redirectToLogin(req)
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return redirectToLogin(req)
  }
}

function redirectToLogin(req: NextRequest) {
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/login'
  redirectUrl.searchParams.delete('error')
  redirectUrl.searchParams.delete('message')
  return NextResponse.redirect(redirectUrl)
}

function redirectToDashboard(req: NextRequest) {
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.searchParams.delete('error')
  redirectUrl.searchParams.delete('message')
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    "/dashboard/:path*", // Only protect /dashboard and its subroutes
  ],
}
