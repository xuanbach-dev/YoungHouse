import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);



// Posts API
export const postsAPI = {
  getPosts: (page: number = 1, limit: number = 10, sortBy: string = 'createdAt', order: string = 'desc') =>
    api.get(`/posts?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`),
  
  getPostById: (id: number) => api.get(`/posts/${id}`),
  
  createPost: (data: { title: string; content: string; tags?: string[] }) =>
    api.post('/posts', data),
  
  updatePost: (id: number, data: { title?: string; content?: string; tags?: string[] }) =>
    api.put(`/posts/${id}`, data),
  
  deletePost: (id: number) => api.delete(`/posts/${id}`),
  
  likePost: (id: number) => api.post(`/posts/${id}/like`),
  
  searchPosts: (query: string) => api.get(`/posts/search/${query}`),
};

// Rooms API
export const roomsAPI = {
  getRooms: (page: number = 1, limit: number = 10, branchId?: number, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (branchId) params.append('branchId', branchId.toString());
    if (status) params.append('status', status);
    return api.get(`/rooms?${params.toString()}`);
  },
  
  getRoomById: (id: number) => api.get(`/rooms/${id}`),
  
  getAvailableRoomsByBranch: (branchId: number) => api.get(`/rooms/available/${branchId}`),
  
  searchRooms: (query: string, branchId?: number) => {
    const params = branchId ? `?branchId=${branchId}` : '';
    return api.get(`/rooms/search/${encodeURIComponent(query)}${params}`);
  },

  advancedSearchRooms: (filters: {
    branchId?: number;
    roomTypeId?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return api.get(`/rooms/search/advanced?${params.toString()}`);
  },
  
  createRoom: (data: { branchId: number; roomTypeId: number; roomNumber: string; status?: string; description?: string }) =>
    api.post('/rooms', data),
  
  updateRoom: (id: number, data: { branchId: number; roomTypeId: number; roomNumber: string; status?: string; description?: string }) =>
    api.put(`/rooms/${id}`, data),
  
  updateRoomStatus: (id: number, status: string) =>
    api.patch(`/rooms/${id}/status`, { status }),
  
  deleteRoom: (id: number) => api.delete(`/rooms/${id}`),
  
  getRoomTypes: () => api.get('/rooms/types'),
};

// Branches API
export const branchesAPI = {
  getBranches: () => api.get('/branches'),
  getBranchesWithRooms: () => api.get('/branches/with-rooms'),
  getBranchById: (id: number) => api.get(`/branches/${id}`),
  createBranch: (data: any) => api.post('/branches', data),
  updateBranch: (id: number, data: any) => api.put(`/branches/${id}`, data),
  deleteBranch: (id: number) => api.delete(`/branches/${id}`),
  getAdminStatistics: () => api.get('/branches/admin/statistics'),
};

// Viewing Appointments API
export const viewingAppointmentsAPI = {
  getAll: (params?: any) => api.get('/viewing-appointments', { params }),
  getById: (id: number) => api.get(`/viewing-appointments/${id}`),
  create: (data: any) => api.post('/viewing-appointments', data),
  update: (id: number, data: any) => api.put(`/viewing-appointments/${id}`, data),
  updateStatus: (id: number, status: string) => api.patch(`/viewing-appointments/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/viewing-appointments/${id}`),
  getByRoom: (roomId: number, params?: any) => api.get(`/viewing-appointments/room/${roomId}`, { params }),
  checkAvailability: (data: any) => api.post('/viewing-appointments/check-availability', data),
  getAvailableSlots: (roomId: number, date: string) => api.get(`/viewing-appointments/available-slots/${roomId}/${date}`),
  getStatistics: () => api.get('/viewing-appointments/statistics'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;