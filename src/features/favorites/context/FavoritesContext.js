/**
 * FavoritesContext.js — Global state for favorite destinations.
 * Uses React Context + useReducer so any screen can read or
 * mutate favorites without prop-drilling.
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';

const FavoritesContext = createContext();

// ── action types ──
const ADD_FAVORITE = 'ADD_FAVORITE';
const REMOVE_FAVORITE = 'REMOVE_FAVORITE';

// ── reducer ──
const favoritesReducer = (state, action) => {
  switch (action.type) {
    case ADD_FAVORITE:
      // Prevent duplicates
      if (state.some((item) => item.id === action.payload.id)) return state;
      return [...state, action.payload];
    case REMOVE_FAVORITE:
      return state.filter((item) => item.id !== action.payload);
    default:
      return state;
  }
};

// ── Provider component ──
export const FavoritesProvider = ({ children }) => {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);

  const addFavorite = useCallback((destination) => {
    dispatch({ type: ADD_FAVORITE, payload: destination });
  }, []);

  const removeFavorite = useCallback((id) => {
    dispatch({ type: REMOVE_FAVORITE, payload: id });
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((item) => item.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (destination) => {
      if (favorites.some((item) => item.id === destination.id)) {
        dispatch({ type: REMOVE_FAVORITE, payload: destination.id });
      } else {
        dispatch({ type: ADD_FAVORITE, payload: destination });
      }
    },
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// ── Custom hook for easy consumption ──
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
