import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Room } from '../types';

// Supabase client initialization
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Database room type (snake_case from Supabase)
interface DbRoom {
  id: number;
  room_id: number;
  branch_id: number;
  branch_name: string;
  room_type_id: number;
  type_name: string;
  price: number;
  status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
  is_available: boolean;
  address: string;
  city: string;
  service_fee: number;
  electricity_fee: number;
  created_at: string;
  updated_at: string;
}

// Convert database room to frontend Room type
const dbRoomToRoom = (dbRoom: DbRoom): Room => ({
  roomId: dbRoom.room_id,
  RoomID: dbRoom.room_id,
  branchId: dbRoom.branch_id,
  BranchID: dbRoom.branch_id,
  branchName: dbRoom.branch_name,
  BranchName: dbRoom.branch_name,
  roomTypeId: dbRoom.room_type_id,
  RoomTypeID: dbRoom.room_type_id,
  typeName: dbRoom.type_name,
  TypeName: dbRoom.type_name,
  price: dbRoom.price,
  Price: dbRoom.price,
  Status: dbRoom.status,
  isAvailable: dbRoom.is_available,
  address: dbRoom.address,
  Address: dbRoom.address,
  City: dbRoom.city,
  serviceFee: dbRoom.service_fee,
  ServiceFee: dbRoom.service_fee,
  electricityFee: dbRoom.electricity_fee,
  ElectricityFee: dbRoom.electricity_fee,
});

// Fallback local rooms data (used when Supabase is not configured or fails)
const localRoomsData: Room[] = [
  {
    RoomID: 1, roomId: 1, BranchID: 1, branchId: 1,
    BranchName: 'Young House 1', branchName: 'Young House 1',
    TypeName: 'Giường đôi', typeName: 'Giường đôi',
    Price: 1500000, price: 1500000,
    Status: 'Available', isAvailable: true,
    Address: '57 đường Xóm Quán – H10, xã Tân Xã', address: '57 đường Xóm Quán – H10, xã Tân Xã',
    City: 'Hà Nội', RoomTypeID: 1, roomTypeId: 1,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 17, roomId: 17, BranchID: 1, branchId: 1,
    BranchName: 'Young House 1', branchName: 'Young House 1',
    TypeName: 'Giường gác xép có ban công thoáng', typeName: 'Giường gác xép có ban công thoáng',
    Price: 2200000, price: 2200000,
    Status: 'Available', isAvailable: true,
    Address: '57 đường Xóm Quán – H10, xã Tân Xã', address: '57 đường Xóm Quán – H10, xã Tân Xã',
    City: 'Hà Nội', RoomTypeID: 25, roomTypeId: 25,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 2, roomId: 2, BranchID: 2, branchId: 2,
    BranchName: 'Young House 2', branchName: 'Young House 2',
    TypeName: 'Giường đôi căn góc thoáng', typeName: 'Giường đôi căn góc thoáng',
    Price: 2600000, price: 2600000,
    Status: 'Available', isAvailable: true,
    Address: '64 Phú Hữu, xã Tân Xã', address: '64 Phú Hữu, xã Tân Xã',
    City: 'Hà Nội', RoomTypeID: 5, roomTypeId: 5,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 3, roomId: 3, BranchID: 2, branchId: 2,
    BranchName: 'Young House 2', branchName: 'Young House 2',
    TypeName: 'Giường đơn có ban công thoáng', typeName: 'Giường đơn có ban công thoáng',
    Price: 2600000, price: 2600000,
    Status: 'Available', isAvailable: false,
    Address: '64 Phú Hữu, xã Tân Xã', address: '64 Phú Hữu, xã Tân Xã',
    City: 'Hà Nội', RoomTypeID: 3, roomTypeId: 3,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 4, roomId: 4, BranchID: 2, branchId: 2,
    BranchName: 'Young House 2', branchName: 'Young House 2',
    TypeName: 'Giường đơn có giếng trời thoáng', typeName: 'Giường đơn có giếng trời thoáng',
    Price: 2400000, price: 2400000,
    Status: 'Available', isAvailable: false,
    Address: '64 Phú Hữu, xã Tân Xã', address: '64 Phú Hữu, xã Tân Xã',
    City: 'Hà Nội', RoomTypeID: 4, roomTypeId: 4,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 14, roomId: 14, BranchID: 2, branchId: 2,
    BranchName: 'Young House 2', branchName: 'Young House 2',
    TypeName: 'Căn 2 ngủ căn góc có ban công thoáng', typeName: 'Căn 2 ngủ căn góc có ban công thoáng',
    Price: 4500000, price: 4500000,
    Status: 'Reserved', isAvailable: false,
    Address: '64 Phú Hữu, xã Tân Xã', address: '64 Phú Hữu, xã Tân Xã',
    City: 'Hà Nội', RoomTypeID: 20, roomTypeId: 20,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 15, roomId: 15, BranchID: 2, branchId: 2,
    BranchName: 'Young House 2', branchName: 'Young House 2',
    TypeName: 'Căn 2 ngủ căn góc có giếng trời thoáng', typeName: 'Căn 2 ngủ căn góc có giếng trời thoáng',
    Price: 4500000, price: 4500000,
    Status: 'Reserved', isAvailable: false,
    Address: '64 Phú Hữu, xã Tân Xã', address: '64 Phú Hữu, xã Tân Xã',
    City: 'Hà Nội', RoomTypeID: 21, roomTypeId: 21,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 16, roomId: 16, BranchID: 2, branchId: 2,
    BranchName: 'Young House 2', branchName: 'Young House 2',
    TypeName: 'Căn 2 ngủ có ban công thoáng', typeName: 'Căn 2 ngủ có ban công thoáng',
    Price: 4500000, price: 4500000,
    Status: 'Reserved', isAvailable: false,
    Address: '64 Phú Hữu, xã Tân Xã', address: '64 Phú Hữu, xã Tân Xã',
    City: 'Hà Nội', RoomTypeID: 22, roomTypeId: 22,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 5, roomId: 5, BranchID: 4, branchId: 4,
    BranchName: 'Young House 4', branchName: 'Young House 4',
    TypeName: 'Giường gác xép có hành lang view hồ Tân Xã', typeName: 'Giường gác xép có hành lang view hồ Tân Xã',
    Price: 2000000, price: 2000000,
    Status: 'Available', isAvailable: false,
    Address: '85 Mục Uyên – Công Nghệ, Tân Xã', address: '85 Mục Uyên – Công Nghệ, Tân Xã',
    City: 'Hà Nội', RoomTypeID: 12, roomTypeId: 12,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 20, roomId: 20, BranchID: 6, branchId: 6,
    BranchName: 'Young House 6', branchName: 'Young House 6',
    TypeName: 'Giường gác xép có ban công thoáng', typeName: 'Giường gác xép có ban công thoáng',
    Price: 1700000, price: 1700000,
    Status: 'Available', isAvailable: false,
    Address: 'Ngõ 902 đường 420, thôn Thái Bình, Bình Yên', address: 'Ngõ 902 đường 420, thôn Thái Bình, Bình Yên',
    City: 'Hà Nội', RoomTypeID: 30, roomTypeId: 30,
    ServiceFee: 180000, serviceFee: 180000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 18, roomId: 18, BranchID: 5, branchId: 5,
    BranchName: 'Young House 5', branchName: 'Young House 5',
    TypeName: 'Giường hai giường đôi có ban công thoáng', typeName: 'Giường hai giường đôi có ban công thoáng',
    Price: 2500000, price: 2500000,
    Status: 'Available', isAvailable: false,
    Address: '23 Mục Uyên – Công nghệ - Tân Xã', address: '23 Mục Uyên – Công nghệ - Tân Xã',
    City: 'Hà Nội', RoomTypeID: 26, roomTypeId: 26,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 6, roomId: 6, BranchID: 9, branchId: 9,
    BranchName: 'Young House 9', branchName: 'Young House 9',
    TypeName: 'Giường đôi có ban công thoáng', typeName: 'Giường đôi có ban công thoáng',
    Price: 2000000, price: 2000000,
    Status: 'Available', isAvailable: false,
    Address: 'D2 – Khu Tái định cư đường 420 xã Bình Yên – Thạch Thất', address: 'D2 – Khu Tái định cư đường 420 xã Bình Yên – Thạch Thất',
    City: 'Hà Nội', RoomTypeID: 10, roomTypeId: 10,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 7, roomId: 7, BranchID: 10, branchId: 10,
    BranchName: 'Young House 10', branchName: 'Young House 10',
    TypeName: 'Giường đôi', typeName: 'Giường đôi',
    Price: 1400000, price: 1400000,
    Status: 'Available', isAvailable: false,
    Address: 'Nhà văn hóa thôn Thái Bình, xã Bình Yên', address: 'Nhà văn hóa thôn Thái Bình, xã Bình Yên',
    City: 'Hà Nội', RoomTypeID: 11, roomTypeId: 11,
    ServiceFee: 180000, serviceFee: 180000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 8, roomId: 8, BranchID: 11, branchId: 11,
    BranchName: 'Young House 11', branchName: 'Young House 11',
    TypeName: 'Giường gác xép có ban công thoáng', typeName: 'Giường gác xép có ban công thoáng',
    Price: 2200000, price: 2200000,
    Status: 'Available', isAvailable: true,
    Address: 'Số 6, đường Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội', address: 'Số 6, đường Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
    City: 'Hà Nội', RoomTypeID: 8, roomTypeId: 8,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 9, roomId: 9, BranchID: 12, branchId: 12,
    BranchName: 'Young House 12', branchName: 'Young House 12',
    TypeName: 'Giường gác xép có ban công thoáng', typeName: 'Giường gác xép có ban công thoáng',
    Price: 2500000, price: 2500000,
    Status: 'Available', isAvailable: false,
    Address: 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội', address: 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
    City: 'Hà Nội', RoomTypeID: 7, roomTypeId: 7,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 19, roomId: 19, BranchID: 12, branchId: 12,
    BranchName: 'Young House 12', branchName: 'Young House 12',
    TypeName: 'Giường đôi có ban công thoáng view FPT', typeName: 'Giường đôi có ban công thoáng view FPT',
    Price: 2300000, price: 2300000,
    Status: 'Available', isAvailable: false,
    Address: 'Gần nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội', address: 'Gần nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
    City: 'Hà Nội', RoomTypeID: 27, roomTypeId: 27,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 10, roomId: 10, BranchID: 14, branchId: 14,
    BranchName: 'Young House 14', branchName: 'Young House 14',
    TypeName: 'Giường đôi có cửa sổ thoáng', typeName: 'Giường đôi có cửa sổ thoáng',
    Price: 1700000, price: 1700000,
    Status: 'Available', isAvailable: false,
    Address: 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội', address: 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
    City: 'Hà Nội', RoomTypeID: 13, roomTypeId: 13,
    ServiceFee: 180000, serviceFee: 180000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 11, roomId: 11, BranchID: 5, branchId: 5,
    BranchName: 'Young House 5', branchName: 'Young House 5',
    TypeName: 'Giường gác xép có ban công thoáng', typeName: 'Giường gác xép có ban công thoáng',
    Price: 2000000, price: 2000000,
    Status: 'Available', isAvailable: true,
    Address: '23 Mục Uyên – Công nghệ - Tân Xã', address: '23 Mục Uyên – Công nghệ - Tân Xã',
    City: 'Hà Nội', RoomTypeID: 15, roomTypeId: 15,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 12, roomId: 12, BranchID: 7, branchId: 7,
    BranchName: 'Young House 7', branchName: 'Young House 7',
    TypeName: 'Giường đôi có ban công thoáng', typeName: 'Giường đôi có ban công thoáng',
    Price: 2400000, price: 2400000,
    Status: 'Available', isAvailable: false,
    Address: 'Đối diện THPT Hai Bà Trưng - Tân Xã', address: 'Đối diện THPT Hai Bà Trưng - Tân Xã',
    City: 'Hà Nội', RoomTypeID: 16, roomTypeId: 16,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
  {
    RoomID: 13, roomId: 13, BranchID: 8, branchId: 8,
    BranchName: 'Young House 8', branchName: 'Young House 8',
    TypeName: 'Giường gác xép có ban công thoáng', typeName: 'Giường gác xép có ban công thoáng',
    Price: 2200000, price: 2200000,
    Status: 'Available', isAvailable: true,
    Address: '41 Mục Uyên 1, xã Tân Xã', address: '41 Mục Uyên 1, xã Tân Xã',
    City: 'Hà Nội', RoomTypeID: 17, roomTypeId: 17,
    ServiceFee: 230000, serviceFee: 230000,
    ElectricityFee: 3200, electricityFee: 3200,
  },
];

// Cache for rooms data
let roomsCache: Room[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

// Fetch all rooms from Supabase or fallback to local data
export const fetchRooms = async (): Promise<Room[]> => {
  // Check cache first
  if (roomsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return roomsCache;
  }

  // If Supabase is not configured, use local data
  if (!supabase) {
    console.warn('Supabase not configured, using local room data');
    roomsCache = localRoomsData;
    cacheTimestamp = Date.now();
    return localRoomsData;
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_id', { ascending: true });

    if (error) {
      console.error('Error fetching rooms from Supabase:', error);
      // Fallback to local data
      roomsCache = localRoomsData;
      cacheTimestamp = Date.now();
      return localRoomsData;
    }

    if (data && data.length > 0) {
      roomsCache = data.map(dbRoomToRoom);
      cacheTimestamp = Date.now();
      return roomsCache;
    }

    // If no data in Supabase, use local data
    roomsCache = localRoomsData;
    cacheTimestamp = Date.now();
    return localRoomsData;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    roomsCache = localRoomsData;
    cacheTimestamp = Date.now();
    return localRoomsData;
  }
};

// Get a single room by ID
export const getRoomById = async (roomId: number): Promise<Room | null> => {
  const rooms = await fetchRooms();
  return rooms.find(r => r.roomId === roomId || r.RoomID === roomId) || null;
};

// Get a single room by slug
export const getRoomBySlug = async (slug: string): Promise<Room | null> => {
  const rooms = await fetchRooms();
  
  // Import slug utility dynamically to avoid circular dependency
  const { buildRoomSlug, toSlug } = await import('../utils/slug');
  
  // Try exact match first
  let found = rooms.find(r => buildRoomSlug(r as any) === slug);
  
  if (!found) {
    // Try alternative slug format
    found = rooms.find(r => {
      const branch = (r.BranchName || r.branchName || '').toString();
      const type = (r.TypeName || r.typeName || '').toString();
      const number = (r.RoomID || r.roomId || '').toString();
      const alt = `${branch}-${type}-${number}`;
      try {
        return toSlug(alt) === slug;
      } catch {
        return false;
      }
    });
  }
  
  if (!found) {
    // Try to extract room ID from slug
    const parts = slug.split('-');
    const last = parts[parts.length - 1];
    const num = parseInt(last, 10);
    if (!isNaN(num)) {
      found = rooms.find(r => r.RoomID === num || r.roomId === num);
    }
  }
  
  return found || null;
};

// Update room status (for Admin)
export const updateRoomStatus = async (
  roomId: number, 
  status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance',
  isAvailable: boolean
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('rooms')
      .update({ 
        status, 
        is_available: isAvailable,
        updated_at: new Date().toISOString()
      })
      .eq('room_id', roomId);

    if (error) {
      console.error('Error updating room status:', error);
      return { success: false, error: error.message };
    }

    // Invalidate cache
    roomsCache = null;
    cacheTimestamp = 0;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating room status:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

// Batch update room statuses (for Admin)
export const batchUpdateRoomStatus = async (
  updates: Array<{
    roomId: number;
    status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
    isAvailable: boolean;
  }>
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Use Promise.all for batch updates
    const results = await Promise.all(
      updates.map(async (update) => {
        const { error } = await supabase!
          .from('rooms')
          .update({ 
            status: update.status, 
            is_available: update.isAvailable,
            updated_at: new Date().toISOString()
          })
          .eq('room_id', update.roomId);

        return { roomId: update.roomId, error };
      })
    );

    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error('Errors in batch update:', errors);
      return { 
        success: false, 
        error: `Failed to update ${errors.length} room(s)` 
      };
    }

    // Invalidate cache
    roomsCache = null;
    cacheTimestamp = 0;

    return { success: true };
  } catch (error: any) {
    console.error('Error in batch update:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

// Batch update rooms (status and price)
export const batchUpdateRooms = async (
  updates: Array<{
    roomId: number;
    status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
    isAvailable: boolean;
    price?: number;
  }>
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Use Promise.all for batch updates
    const results = await Promise.all(
      updates.map(async (update) => {
        const updateData: any = { 
          status: update.status, 
          is_available: update.isAvailable,
          updated_at: new Date().toISOString()
        };
        
        // Include price if provided
        if (update.price !== undefined) {
          updateData.price = update.price;
        }

        const { error } = await supabase!
          .from('rooms')
          .update(updateData)
          .eq('room_id', update.roomId);

        return { roomId: update.roomId, error };
      })
    );

    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error('Errors in batch update:', errors);
      return { 
        success: false, 
        error: `Failed to update ${errors.length} room(s)` 
      };
    }

    // Invalidate cache
    roomsCache = null;
    cacheTimestamp = 0;

    return { success: true };
  } catch (error: any) {
    console.error('Error in batch update:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

// Clear cache (useful after manual updates)
export const clearCache = (): void => {
  roomsCache = null;
  cacheTimestamp = 0;
};

// Get local rooms data (for reference/fallback)
export const getLocalRoomsData = (): Room[] => {
  return localRoomsData;
};

// Export types
export type RoomStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';

export default {
  fetchRooms,
  getRoomById,
  getRoomBySlug,
  updateRoomStatus,
  batchUpdateRoomStatus,
  batchUpdateRooms,
  clearCache,
  isSupabaseConfigured,
  getLocalRoomsData,
};
