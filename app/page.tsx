import { Suspense } from 'react';
import LandingPage from './LandingPage';
import LoadingSpinner from '@/components/ui/loading-spinner';

export const metadata = {
  title: "Saifauto - Drive Your Journey, Trust Our Wheels",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LandingPage />
    </Suspense>
  );
} 