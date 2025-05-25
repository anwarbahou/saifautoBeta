import { Suspense } from 'react';
import LandingPlaceholder from './LandingPage'; // Assuming LandingPage.tsx is in the same app directory

export default async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* @ts-expect-error Server Component */}
      <LandingPlaceholder />
    </Suspense>
  );
} 