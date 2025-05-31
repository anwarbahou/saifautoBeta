"use client"

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'
import styles from "./styles.module.css"
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import Head from "next/head";

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [origin, setOrigin] = useState('')
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // console.log(container);
  }, []);

  const particleOptions: ISourceOptions = {
    background: {
      color: {
        value: '#0d1117',
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        resize: { enable: true, delay: 0 },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#ffffff',
      },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: false,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: false,
        speed: 0.1,
        straight: false,
      },
      number: {
        value: 100,
      },
      opacity: {
        value: {
          min: 0.1,
          max: 0.5
        }
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  useEffect(() => {
    const initializePage = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
        router.refresh()
        return
      }
      setIsMounted(true)
      setOrigin(window.location.origin)
    }

    initializePage()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  if (!isMounted || !init) {
    return (
      <>
        <Head>
          <title>Saifauto - Login</title>
        </Head>
        <div className="flex min-h-screen items-center justify-center bg-muted/40">
          {init && (
            <Particles
              id="tsparticles-loading"
              particlesLoaded={particlesLoaded}
              options={particleOptions}
            />
          )}
          <Card className="w-full max-w-md z-10">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center">
                <Image src="/SVG/Asset 1.svg" alt="Saifauto Logo" width={40} height={40} className={`p-1 ${styles.loginLogo}`} />
              </div>
              <CardTitle className="text-2xl">Welcome back Imad!</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Saifauto - Login</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 relative">
        {init && (
          <Particles
            id="tsparticles-main"
            particlesLoaded={particlesLoaded}
            options={particleOptions}
            className="absolute top-0 left-0 w-full h-full z-0"
          />
        )}
        <Card className="w-full max-w-md z-10">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <Image src="/SVG/Asset 1.svg" alt="Saifauto Logo" width={48} height={48} className={`p-1 ${styles.loginLogo}`} />
            </div>
            <CardTitle className="text-2xl">Welcome back Imad!</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.authContainer}>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'hsl(var(--primary))',
                        brandAccent: 'hsl(var(--primary-foreground))',
                        brandButtonText: 'hsl(var(--primary-foreground))',
                        inputBackground: 'hsl(var(--background))',
                        inputText: 'hsl(var(--foreground))',
                        inputBorder: 'hsl(var(--border))',
                        inputBorderFocus: 'hsl(var(--ring))',
                        inputBorderHover: 'hsl(var(--border))',
                      },
                    },
                  },
                  className: {
                    input: 'supabase-ui-auth_ui-input',
                    button: 'supabase-ui-auth_ui-button',
                    label: 'supabase-ui-auth_ui-label',
                    anchor: 'supabase-ui-auth_ui-anchor',
                  },
                }}
                providers={[]}
                showLinks={false}
                redirectTo={origin ? `${origin}/` : undefined}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
