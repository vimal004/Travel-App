/**
 * destinationApi.js — Service layer for fetching destinations.
 * Wraps the generic apiGet helper with a domain-specific function.
 */

import { apiGet } from '../../../config/api';
import { MOCK_DESTINATIONS } from '../../../config/mockData';

/**
 * Fetch all destinations.
 * Falls back to MOCK_DESTINATIONS if the network/API is unavailable.
 * @returns {Promise<Array>} array of destination objects
 */
export const fetchDestinations = async () => {
  try {
    const data = await apiGet('/destinations');
    // Basic validation to ensure we got an array
    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_DESTINATIONS;
  } catch (error) {
    console.warn('API Error, falling back to mock data:', error.message);
    return MOCK_DESTINATIONS;
  }
};

/**
 * Fetch a single destination by ID.
 * @param {number|string} id
 * @returns {Promise<Object>} destination object
 */
export const fetchDestinationById = async (id) => {
  try {
    const data = await apiGet(`/destinations/${id}`);
    if (data && typeof data === 'object') return data;
    throw new Error('Invalid data');
  } catch (error) {
    console.warn(`API Error for ID ${id}, searching mock data:`, error.message);
    const mock = MOCK_DESTINATIONS.find((d) => d.id === Number(id));
    if (mock) return mock;
    throw error;
  }
};
