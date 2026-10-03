// Base URL of the ASP.NET Core backend (ReactCsharp_Basecode / ASI.Basecode.WebApp).
const API_BASE_URL = 'https://localhost:46395/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText})`);
  }

  return response.status === 204 ? null : response.json();
}

export const movieApi = {
  getAll: () => request('/Movie'),
  get: (id) => request(`/Movie/${id}`),
  create: (movie) => request('/Movie', { method: 'POST', body: JSON.stringify(movie) }),
  update: (id, movie) => request(`/Movie/${id}`, { method: 'PUT', body: JSON.stringify(movie) }),
  remove: (id) => request(`/Movie/${id}`, { method: 'DELETE' }),
};

export default API_BASE_URL;
