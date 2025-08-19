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
  getPosts: (page: number = 1, limit: number = 10, sortBy: string = 'createdAt', order: string = 'desc') => {
    // Mock implementation with sample posts
    console.warn('getPosts method is mocked');
    return Promise.resolve({
      data: {
        success: true,
        posts: [
          {
            id: 1,
            title: 'Giới Thiệu Young House',
            content: 'Young House - Không gian sống lý tưởng cho sinh viên FPT',
            author_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: ['Young House', 'Sinh Viên', 'Ký Túc Xá'],
            likes: 10,
            comments: 5,
            author: {
              id: 1,
              username: 'admin',
              email: 'admin@younghouse.com',
              role: 'admin',
              created_at: new Date().toISOString(),
              roleId: 1,
              roleName: 'Administrator'
            }
          },
          {
            id: 2,
            title: 'Ưu Đãi Mùa Hè 2024',
            content: 'Chương trình giảm giá đặc biệt cho sinh viên đăng ký ở mới',
            author_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: ['Ưu Đãi', 'Khuyến Mãi'],
            likes: 15,
            comments: 3,
            author: {
              id: 1,
              username: 'admin',
              email: 'admin@younghouse.com',
              role: 'admin',
              created_at: new Date().toISOString(),
              roleId: 1,
              roleName: 'Administrator'
            }
          }
        ],
        page,
        limit,
        total: 2
      }
    });
  },
  
  getPostById: (id: number) => {
    // Mock implementation with sample post
    console.warn('getPostById method is mocked');
    return Promise.resolve({
      data: {
        success: true,
        post: {
          id,
          title: 'Chi Tiết Bài Viết',
          content: 'Nội dung chi tiết của bài viết về Young House',
          author_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tags: ['Young House', 'Thông Tin'],
          likes: 20,
          comments: 7,
          author: {
            id: 1,
            username: 'admin',
            email: 'admin@younghouse.com',
            role: 'admin',
            created_at: new Date().toISOString(),
            roleId: 1,
            roleName: 'Administrator'
          }
        }
      }
    });
  },
  
  createPost: (data: { title: string; content: string; tags?: string[] }) => {
    // Mock implementation
    console.warn('createPost method is mocked');
    return Promise.resolve({ 
      data: { 
        success: true,
        post: {
          ...data,
          id: Date.now(),
          author_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          likes: 0,
          comments: 0,
          author: {
            id: 1,
            username: 'admin',
            email: 'admin@younghouse.com',
            role: 'admin',
            created_at: new Date().toISOString(),
            roleId: 1,
            roleName: 'Administrator'
          }
        }
      } 
    });
  },
  
  updatePost: (id: number, data: { title?: string; content?: string; tags?: string[] }) => {
    // Mock implementation
    console.warn('updatePost method is mocked');
    return Promise.resolve({ 
      data: { 
        success: true,
        post: {
          ...data,
          id,
          author_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          likes: 0,
          comments: 0,
          author: {
            id: 1,
            username: 'admin',
            email: 'admin@younghouse.com',
            role: 'admin',
            created_at: new Date().toISOString(),
            roleId: 1,
            roleName: 'Administrator'
          }
        }
      } 
    });
  },
  
  deletePost: (id: number) => {
    // Mock implementation
    console.warn('deletePost method is mocked');
    return Promise.resolve({ 
      data: { 
        success: true,
        message: 'Xóa bài viết thành công' 
      } 
    });
  },
  
  likePost: (id: number) => {
    // Mock implementation
    console.warn('likePost method is mocked');
    return Promise.resolve({ 
      data: { 
        success: true,
        likes: 10 
      } 
    });
  },
  
  searchPosts: (query: string) => {
    // Mock implementation
    console.warn('searchPosts method is mocked');
    return Promise.resolve({ 
      data: { 
        success: true,
        posts: [
          {
            id: 1,
            title: `Kết Quả Tìm Kiếm: ${query}`,
            content: 'Nội dung liên quan đến từ khóa tìm kiếm',
            author_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: [query],
            likes: 5,
            comments: 2,
            author: {
              id: 1,
              username: 'admin',
              email: 'admin@younghouse.com',
              role: 'admin',
              created_at: new Date().toISOString(),
              roleId: 1,
              roleName: 'Administrator'
            }
          }
        ],
        total: 1
      } 
    });
  },
};

// Rooms API
export const roomsAPI = {
  getRooms: (page: number = 1, limit: number = 10, branchId?: number, status?: string) => {
    // Mock implementation
    console.warn('getRooms method is mocked');
    return Promise.resolve({
      data: {
        data: [],
        page,
        limit,
        total: 0
      }
    });
  },
  
  getRoomById: (id: number) => {
    // Mock implementation
    console.warn('getRoomById method is mocked');
    return Promise.resolve({ data: null });
  },
  
  getAvailableRoomsByBranch: (branchId: number) => {
    // Mock implementation
    console.warn('getAvailableRoomsByBranch method is mocked');
    return Promise.resolve({ data: [] });
  },
  
  searchRooms: (query: string, branchId?: number) => {
    // Mock implementation
    console.warn('searchRooms method is mocked');
    return Promise.resolve({ 
      data: { 
        success: true,
        data: [
          {
            roomId: 1,
            roomNumber: 'Young House 1',
            roomTypeId: 1,
            branchId: 1,
            isAvailable: true,
            typeName: 'Giường đôi',
            price: 2200000,
            branchName: 'Young House 1',
            address: '57 đường Xóm Quán – H10, xã Tân Xã',
            Status: 'Available',
            description: 'Phòng rộng rãi, thoáng mát',
            Media: [{ FilePath: '/rooms/branch-1/Type1/branch1-1.jpg' }]
          }
        ],
        total: 1
      } 
    });
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
    // Mock implementation
    console.warn('advancedSearchRooms method is mocked');
    return Promise.resolve({
      data: {
        data: [],
        page: filters.page || 1,
        limit: filters.limit || 10,
        total: 0
      }
    });
  },
  
  createRoom: (data: { branchId: number; roomTypeId: number; roomNumber: string; status?: string; description?: string }) => {
    // Mock implementation
    console.warn('createRoom method is mocked');
    return Promise.resolve({ data: null });
  },
  
  updateRoom: (id: number, data: { branchId: number; roomTypeId: number; roomNumber: string; status?: string; description?: string }) => {
    // Mock implementation
    console.warn('updateRoom method is mocked');
    return Promise.resolve({ data: null });
  },
  
  updateRoomStatus: (id: number, status: string) => {
    // Mock implementation
    console.warn('updateRoomStatus method is mocked');
    return Promise.resolve({ data: null });
  },
  
  deleteRoom: (id: number) => {
    // Mock implementation
    console.warn('deleteRoom method is mocked');
    return Promise.resolve({ data: null });
  },
  
  getRoomTypes: () => {
    // Mock implementation
    console.warn('getRoomTypes method is mocked');
    return Promise.resolve({ data: [] });
  },
};

// Branches API
export const branchesAPI = {
  getBranches: () => {
    // Mock implementation
    console.warn('getBranches method is mocked');
    return Promise.resolve({ data: [] });
  },
  
  getBranchesWithRooms: () => {
    // Mock implementation
    console.warn('getBranchesWithRooms method is mocked');
    return Promise.resolve({ data: [] });
  },
  
  getBranchById: (id: number) => {
    // Mock implementation
    console.warn('getBranchById method is mocked');
    return Promise.resolve({ data: null });
  },
  
  createBranch: (data: any) => {
    // Mock implementation
    console.warn('createBranch method is mocked');
    return Promise.resolve({ data: null });
  },
  
  updateBranch: (id: number, data: any) => {
    // Mock implementation
    console.warn('updateBranch method is mocked');
    return Promise.resolve({ data: null });
  },
  
  deleteBranch: (id: number) => {
    // Mock implementation
    console.warn('deleteBranch method is mocked');
    return Promise.resolve({ data: null });
  },
  
  getAdminStatistics: () => {
    // Mock implementation
    console.warn('getAdminStatistics method is mocked');
    return Promise.resolve({ data: {} });
  },
};

// Viewing Appointments API
export const viewingAppointmentsAPI = {
  getAll: (params?: any) => {
    // Mock implementation
    console.warn('getAll method is mocked');
    return Promise.resolve({ 
      data: { 
        data: [],
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: 0
      } 
    });
  },
  
  getById: (id: number) => {
    // Mock implementation
    console.warn('getById method is mocked');
    return Promise.resolve({ data: null });
  },
  
  create: (data: any) => {
    // Local storage based mock implementation
    try {
      // Get existing appointments or initialize empty array
      const appointments = JSON.parse(
        localStorage.getItem('viewingAppointments') || '[]'
      );
      
      // Add new appointment with a unique ID
      const newAppointment = {
        ...data,
        id: Date.now(), // Use timestamp as unique ID
        createdAt: new Date().toISOString()
      };
      
      appointments.push(newAppointment);
      
      // Save back to local storage
      localStorage.setItem(
        'viewingAppointments', 
        JSON.stringify(appointments)
      );
      
      // Return mock response similar to backend
      return Promise.resolve({
        data: {
          message: 'Đặt lịch xem phòng thành công',
          appointment: newAppointment
        }
      });
    } catch (error) {
      console.error('Error creating viewing appointment:', error);
      return Promise.reject({
        response: {
          data: {
            message: 'Có lỗi xảy ra khi đặt lịch hẹn'
          }
        }
      });
    }
  },
  
  update: (id: number, data: any) => {
    // Mock implementation
    console.warn('update method is mocked');
    return Promise.resolve({ data: null });
  },
  
  updateStatus: (id: number, status: string) => {
    // Mock implementation
    console.warn('updateStatus method is mocked');
    return Promise.resolve({ data: null });
  },
  
  delete: (id: number) => {
    // Mock implementation
    console.warn('delete method is mocked');
    return Promise.resolve({ data: null });
  },
  
  getByRoom: (roomId: number, params?: any) => {
    // Mock implementation
    console.warn('getByRoom method is mocked');
    return Promise.resolve({ 
      data: { 
        data: [],
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: 0
      } 
    });
  },
  
  checkAvailability: (data: any) => {
    // Mock implementation
    console.warn('checkAvailability method is mocked');
    return Promise.resolve({ data: { available: true } });
  },
  
  getAvailableSlots: (roomId: number, date: string) => {
    // Return all time slots as available
    return Promise.resolve({
      data: {
        availableSlots: [
          '09:00', '10:00', '11:00', '12:00', 
          '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ]
      }
    });
  },
  
  getStatistics: () => {
    // Mock implementation
    console.warn('getStatistics method is mocked');
    return Promise.resolve({ data: {} });
  },
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;