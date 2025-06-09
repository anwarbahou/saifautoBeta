import { useEffect } from 'react';

const titles = [
  'Saifauto - Commencez votre voyage ici',
  '🔥 Meilleures offres de location de voitures !',
  '💰 Prix imbattables !',
  '🚗 Voitures premium disponibles',
  '⚡ Réservez maintenant et économisez !',
];

export function useBlinkingTitle(defaultTitle: string) {
  useEffect(() => {
    let currentIndex = 0;
    let isDefault = true;

    // Function to update the title
    const updateTitle = () => {
      document.title = isDefault ? defaultTitle : titles[currentIndex];
    };

    // Initial title
    updateTitle();

    // Switch between default and rotating titles
    const mainInterval = setInterval(() => {
      isDefault = !isDefault;
      updateTitle();
    }, 1500); // Reduced from 3000ms to 1500ms - Switch every 1.5 seconds

    // Rotate through marketing messages
    const rotateInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % titles.length;
      if (!isDefault) {
        updateTitle();
      }
    }, 800); // Reduced from 1500ms to 800ms - Change marketing message every 0.8 seconds

    // Handle tab visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = defaultTitle;
      } else {
        updateTitle();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(mainInterval);
      clearInterval(rotateInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.title = defaultTitle;
    };
  }, [defaultTitle]);
} 