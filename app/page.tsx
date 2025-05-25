import { Suspense } from 'react';
import LandingPlaceholder from './LandingPage'; // Assuming LandingPage.tsx is in the same app directory
import LoadingSpinner from '@/components/ui/loading-spinner'; // Import the new spinner

export default async function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {/* @ts-expect-error Server Component */}
      <LandingPlaceholder />
    </Suspense>
  );
} 