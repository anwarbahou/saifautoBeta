import { Suspense } from 'react';
import LandingPage from './LandingPage';
import LoadingSpinner from '@/components/ui/loading-spinner';

export const metadata = {
  title: "Saifauto - Commencez votre voyage, faites-nous confiance",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LandingPage />
    </Suspense>
  );
} 