import { Suspense } from 'react';
import NewNavbar from '@/components/landing/NewNavbar';
import NewFooter from '@/components/landing/NewFooter';
import SearchResultsDisplay from './SearchResultsDisplay';

export const metadata = {
  title: "Saifauto - Search",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search page...</div>}>
      <NewNavbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        <SearchResultsDisplay />
      </main>
      <NewFooter />
    </Suspense>
  );
}