/**
 * api.js — Lightweight fetch wrapper for API calls.
 * Provides a central BASE_URL and a helper that handles
 * JSON parsing + error throwing so individual services stay clean.
 */

const BASE_URL = 'https://freetestapi.com/api/v1';

/**
 * Generic GET request helper.
 * @param {string} endpoint — path appended to BASE_URL (e.g. '/destinations')
 * @returns {Promise<any>} parsed JSON response
 */
const apiGet = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export { BASE_URL, apiGet };
