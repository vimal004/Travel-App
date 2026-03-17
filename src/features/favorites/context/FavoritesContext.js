/**
 * FavoritesContext.js — Global state for favorite destinations.
 * Synced with AsyncStorage tied to individual user accounts to ensure
 * preferences persist across app reloads and login sessions.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Auto-load favorites if a session is valid on app boot
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const sessionStr = await AsyncStorage.getItem('session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (Date.now() < session.expiry) {
            setCurrentUser(session.user);
            const storedFavs = await AsyncStorage.getItem(`favorites_${session.user}`);
            if (storedFavs) {
              setFavorites(JSON.parse(storedFavs));
            }
          }
        }
      } catch (e) {
        console.error('Error loading initial favorites:', e);
      }
    };
    loadInitialData();
  }, []);

  // Called explicitly during login
  const loadUserFavorites = async (email) => {
    setCurrentUser(email);
    try {
      const storedFavs = await AsyncStorage.getItem(`favorites_${email}`);
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      } else {
        setFavorites([]); // Clear any leftover state
      }
    } catch (e) {
      console.error('Error loading user favorites:', e);
    }
  };

  const addFavorite = useCallback((destination) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === destination.id)) return prev;
      const updated = [...prev, destination];
      if (currentUser) {
        AsyncStorage.setItem(`favorites_${currentUser}`, JSON.stringify(updated)).catch(console.error);
      }
      return updated;
    });
  }, [currentUser]);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (currentUser) {
        AsyncStorage.setItem(`favorites_${currentUser}`, JSON.stringify(updated)).catch(console.error);
      }
      return updated;
    });
  }, [currentUser]);

  const isFavorite = useCallback(
    (id) => favorites.some((item) => item.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (destination) => {
      setFavorites((prev) => {
        let updated;
        if (prev.some((item) => item.id === destination.id)) {
          updated = prev.filter((item) => item.id !== destination.id);
        } else {
          updated = [...prev, destination];
        }
        if (currentUser) {
          AsyncStorage.setItem(`favorites_${currentUser}`, JSON.stringify(updated)).catch(console.error);
        }
        return updated;
      });
    },
    [currentUser]
  );

  return (
    <FavoritesContext.Provider
      value={{ 
        favorites, 
        addFavorite, 
        removeFavorite, 
        isFavorite, 
        toggleFavorite, 
        loadUserFavorites 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook for easy consumption
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};