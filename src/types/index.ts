export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  roleId?: number;
  roleName?: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  created_at: string;
  createdAt?: string; // Alternative naming
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  authorId?: number; // Alternative naming
  created_at: string;
  updated_at: string;
  createdAt?: string; // Alternative naming
  updatedAt?: string; // Alternative naming
  author?: User;
  likes?: number;
  comments?: number;
  tags?: string[];
}

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  roleId?: number;
  confirmPassword?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
  hasRole: (roleId: number) => boolean;
}

export interface BranchStatistics {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  reservedRooms: number;
  maintenanceRooms: number;
  totalRevenue: number;
  monthlyRevenue: number;
  occupancyRate: number;
}

export interface ViewingAppointment {
  appointmentId?: number;
  fullName: string;
  email: string;
  phone: string;
  viewingDate: string;
  viewingTime: string;
  roomId: number;
  note?: string;
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt?: string;
  // Additional fields from joins
  roomNumber?: string;
  typeName?: string;
  price?: number;
  branchName?: string;
  address?: string;
}

export interface Room {
  roomId: number;
  RoomID?: number; // Alternative naming
  roomNumber: string;
  RoomNumber?: string; // Alternative naming
  description?: string;
  RoomDescription?: string; // Alternative naming
  roomTypeId: number;
  RoomTypeID?: number; // Alternative naming
  branchId: number;
  BranchID?: number; // Alternative naming
  isAvailable: boolean;
  Status?: string;
  // From joins
  typeName?: string;
  TypeName?: string; // Alternative naming
  price?: number;
  Price?: number; // Alternative naming
  typeDescription?: string;
  TypeDescription?: string; // Alternative naming
  branchName?: string;
  BranchName?: string; // Alternative naming
  address?: string;
  Address?: string; // Alternative naming
  City?: string;
  Phone?: string;
  serviceFee?: number;
  ServiceFee?: number; // Alternative naming
  electricityFee?: number;
  ElectricityFee?: number; // Alternative naming
  Media?: Array<{
    FilePath: string;
  }>;
}

export interface RoomSearchFilters {
  search?: string;
  branchId?: number;
  roomTypeId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  limit?: number;
}

export interface Branch {
  branchId: number;
  branchName: string;
  address: string;
  city: string;
  phone: string;
  description?: string;
}

export interface RoomType {
  roomTypeId: number;
  typeName: string;
  price: number;
  description?: string;
}