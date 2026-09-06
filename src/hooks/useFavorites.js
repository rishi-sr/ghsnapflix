import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'ghsnapflix_favorites';

/**
 * Universal hook to manage user's favorite videos across the entire application.
 * Synchronizes with localStorage and dispatches/listens to 'favoritesUpdated' window event.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const refreshFavorites = useCallback(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      } else {
        setFavorites(new Set());
      }
    } catch {
      setFavorites(new Set());
    }
  }, []);

  useEffect(() => {
    refreshFavorites();

    const handleUpdate = () => refreshFavorites();

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    window.addEventListener('favoritesUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('favoritesUpdated', handleUpdate);
    };
  }, [refreshFavorites]);

  const isFavorite = useCallback(
    (videoIdentifier) => {
      if (!videoIdentifier) return false;
      return favorites.has(videoIdentifier);
    },
    [favorites]
  );

  const toggleFavorite = useCallback((video) => {
    if (!video) return false;
    const identifier = typeof video === 'string' ? video : (video.title || video.name || video.id);
    if (!identifier) return false;

    let updatedSet;
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const currentList = stored ? JSON.parse(stored) : [];
      const set = new Set(currentList);

      let isNowFavorited = false;
      if (set.has(identifier)) {
        set.delete(identifier);
        isNowFavorited = false;
      } else {
        set.add(identifier);
        isNowFavorited = true;
      }

      const newArray = Array.from(set);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newArray));
      updatedSet = set;
      setFavorites(set);

      // Notify all tabs and active components
      window.dispatchEvent(new Event('favoritesUpdated'));
      return isNowFavorited;
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      return false;
    }
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    favoriteCount: favorites.size,
  };
}

