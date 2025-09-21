import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Filter, Grid, List, ChevronDown, X } from 'lucide-react';
import { roomsAPI, branchesAPI } from '../services/api';
import { Room, Branch } from '../types';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import SurroundingAreas from '../components/SurroundingAreas';
import './SystemHome.css';
import { VisitCounterService } from '../services/visitCounter';
import Meta from '../components/Meta';
import { buildRoomSlug } from '../utils/slug';

interface RoomSearchFilters {
  search?: string;
  branchId?: number;
  roomTypeId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  limit?: number;
}

const SystemHome: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalItems: 0
  });

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Available areas and their corresponding branch IDs
  const availableAreas = [
    { name: 'Tân Xã', branchIds: [1,4,5,7,8] }, // Young House 1, Young House 2
    { name: 'Phú Hữu', branchIds: [2,11, 12, 14] }, // Young House 4, Young House 9, Young House 10
    { name: 'Bình Yên', branchIds: [9,10] } // Young House 11, Young House 12, Young House 14
  ];

  // Branch description type
  interface BranchDescription {
    name: string;
    address: string;
    description: string;
    roomDetails: string;
    amenities: string[];
    security: string[];
    surroundings: string[];
    services: {
      electricity: string;
      serviceCharges: string;
    };
  }

  // Branch descriptions
  const branchDescriptions: { [key: number]: BranchDescription } = {
    1: {
      name: 'Young House 1',
      address: '57 đường Xóm Quán – H10, xã Tân Xã',
      description: 'Vị trí rất thuận lợi cách trường FPT 3km, chỉ 5p có thể tới trường bằng đường nội bộ khu công nghệ cao rộng thoáng an toàn. Tòa nhà có 6 tầng với 30 phòng rộng thoáng trong đó có 12 phòng gác xép. Chỗ để xe tầng 1 siêu rộng 200m2 với cửa khóa vân tay an toàn và khu giặt phơi trên tầng 6.',
      roomDetails: 'Phòng rộng 20m-25m với phòng đôi và 30m sử dụng với phòng có gác xép (trang bị đầy đủ thiết bị nội thất giường tủ, bàn học, điều hòa nóng lạnh, thiết bị vs cao cấp, tủ bếp nấu ăn)',
      amenities: [
        'Hệ thống phòng đều có cửa sổ rất thoáng và hành lang cây xanh',
        'Internet tốc độ cao tới từng phòng',
        'Thang máy',
        'Khóa vân tay',
        'Máy giặt free'
      ],
      security: [
        'Hệ thống an ninh ra vào cửa bằng khóa vân tay',
        'Hệ thống phòng cháy chữa cháy theo tiêu chuẩn',
        'Camera an ninh full tòa nhà'
      ],
      surroundings: [
        '2 sân chơi thể thao cỏ nhân tạo cạnh tòa nhà',
        'Nằm ở trung tâm khu vực Tân xã nên đầy đủ các dịch vụ công cộng',
        'Gần hồ Tân xã'
      ],
      services: {
        electricity: 'Điện 3,2k/số',
        serviceCharges: 'Phí DV (nước, wifi, thang máy, máy giặt, vệ sinh, điện hành lang): 230k/người'
      }
    },
    // You can add more branch descriptions here similarly
  };

  // Function to get area name from branch ID
  const getAreaFromBranchId = (branchId: number): string | null => {
    const area = availableAreas.find(area => area.branchIds.includes(branchId));
    return area ? area.name : null;
  };

  // Function to get room area from branch ID
  const getRoomArea = (branchId: number): string => {
    const areaMapping: Record<number, string> = {
      1: '25m²', // Phòng rộng 25m² dạng gác xép
      2: '20-40m²', // Phòng rộng 20m-40m2
      4: '16-20m²', // Diện tích sử dụng phòng 16–20m²
      5: '18-30m²', // Phòng rộng 18m-30m
      8: '25m²', // Phòng rộng 25m dạng gác xép
      9: '20-25m²', // Phòng rộng 20–25m²
      10: '20-25m²', // Phòng rộng 20–25m²
      11: '25-30m²', // Phòng rộng 25–30m²
      12: '30-40m²', // Phòng rộng 30–40m² dạng gác xép
      14: '20-25m²' // Default fallback
    };
    return areaMapping[branchId] || '20-25m²';
  };
  const availableRoomTypes = [
    'Giường đôi',
    'Giường đôi gác xép',
    '2 giường đơn có ban công',
    '2 giường đơn có giếng trời',
    '1 giường đôi căn góc',
    'Phòng 2 giường 1 khách',
    'Giường gác xép'
  ];

  // Fetch branches from local data
  const fetchBranches = async () => {
    try {
      // Local branch data
      const localBranches: Branch[] = [
        { 
          branchId: 1, 
          branchName: 'Young House 1', 
          address: '57 đường Xóm Quán – H10, xã Tân Xã',
          city: 'Hà Nội',
          phone: '0123456789'
        },
        { 
          branchId: 2, 
          branchName: 'Young House 2', 
          address: 'Địa chỉ Young House 2',
          city: 'Hà Nội',
          phone: '0987654321'
        },
        { 
          branchId: 4, 
          branchName: 'Young House 4', 
          address: 'Địa chỉ Young House 4',
          city: 'Hà Nội',
          phone: '0246813579'
        }
      ];
      
      setBranches(localBranches);
    } catch (err: any) {
      console.error('Error fetching local branches:', err);
    }
  };

  // Fetch room types from local data
  const fetchRoomTypes = async () => {
    try {
      // Use the existing availableRoomTypes or expand it
      const localRoomTypes = [
        'Giường đôi',
        'Giường đôi gác xép',
        '2 giường đơn có ban công',
        '2 giường đơn có giếng trời',
        '1 giường đôi căn góc',
        'Phòng 2 giường 1 khách',
        'Giường gác xép'
      ];
      
      setRoomTypes(localRoomTypes);
    } catch (err: any) {
      console.error('Error fetching local room types:', err);
      // Fallback to hardcoded room types
      setRoomTypes(availableRoomTypes);
    }
  };

  // Fetch rooms from local directory
  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate room data from local directory
      const localRooms: Room[] = [
        {
          RoomID: 1,
          roomId: 1,
          BranchID: 1,
          branchId: 1,
          BranchName: 'Young House 1',
          branchName: 'Young House 1',
          TypeName: 'Giường đôi',
          typeName: 'Giường đôi',
          Price: 1500000,
          price: 1500000,
          Status: 'Available',
          isAvailable: true,
          Address: '57 đường Xóm Quán – H10, xã Tân Xã',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 1,
          roomTypeId: 1
        },
        {
          RoomID: 17,
          roomId: 17,
          BranchID: 1,
          branchId: 1,
          BranchName: 'Young House 1',
          branchName: 'Young House 1',
          TypeName: 'Giường gác xép có ban công thoáng',
          typeName: 'Giường gác xép có ban công thoáng',
          Price: 2200000,
          price: 2200000,
          Status: 'Occupied',
          isAvailable: true,
          Address: '57 đường Xóm Quán – H10, xã Tân Xã',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 25,
          roomTypeId: 25
        },
        {
          RoomID: 2,
          roomId: 2,
          BranchID: 2,
          branchId: 2,
          BranchName: 'Young House 2',
          branchName: 'Young House 2',
          TypeName: 'Giường đôi căn góc thoáng',
          typeName: 'Giường đôi căn góc thoáng',
          Price: 2600000,
          price: 2600000,
          Status: 'Available',
          isAvailable: true,
          Address: '64 Phú Hữu, xã Tân Xã',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 5,
          roomTypeId: 5
        },{
          RoomID: 3,
          roomId: 3,
          BranchID: 2,
          branchId: 2,
          BranchName: 'Young House 2',
          branchName: 'Young House 2',
          TypeName: 'Giường đơn có ban công thoáng',
          typeName: 'Giường đơn có ban công thoáng',
          Price: 2600000,
          price: 2600000,
          Status: 'Occupied',
          isAvailable: false,
          Address: '64 Phú Hữu, xã Tân Xã',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 3,
          roomTypeId: 3
        },{
          RoomID: 4,
          roomId: 4,
          BranchID: 2,
          branchId: 2,
          BranchName: 'Young House 2',
          branchName: 'Young House 2',
          TypeName: 'Giường đơn có giếng trời thoáng',
          typeName: 'Giường đơn có giếng trời thoáng',
          Price: 2400000,
          price: 2400000,
          Status: 'Occupied',
          isAvailable: false,
          Address: '64 Phú Hữu, xã Tân Xã',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 4,
          roomTypeId: 4
        },
        {
          RoomID: 14,
          roomId: 14,
          BranchID: 2,
          branchId: 2,
          BranchName: 'Young House 2',
          branchName: 'Young House 2',
          TypeName: 'Căn 2 ngủ căn góc có ban công thoáng',
          typeName: 'Căn 2 ngủ căn góc có ban công thoáng',
          Price: 4500000,
          price: 4500000,
          Status: 'Reserved',
          isAvailable: false,
          Address: '64 Phú Hữu, xã Tân Xã',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 20,
          roomTypeId: 20
        },
        {
          RoomID: 15,
          roomId: 15,
          BranchID: 2,
          branchId: 2,
          BranchName: 'Young House 2',
          branchName: 'Young House 2',
          TypeName: 'Căn 2 ngủ căn góc có giếng trời thoáng',
          typeName: 'Căn 2 ngủ căn góc có giếng trời thoáng',
          Price: 4500000,
          price: 4500000,
          Status: 'Reserved',
          isAvailable: false,
          Address: '64 Phú Hữu, xã Tân Xã',
          City: 'Hà Nội',
          
          RoomTypeID: 21,
          roomTypeId: 21
        },{
          RoomID: 16,
          roomId: 16,
          BranchID: 2,
          branchId: 2,
          BranchName: 'Young House 2',
          branchName: 'Young House 2',
          TypeName: 'Căn 2 ngủ có ban công thoáng',
          typeName: 'Căn 2 ngủ có ban công thoáng',
          Price: 4500000,
          price: 4500000,
          Status: 'Reserved',
          isAvailable: false,
          Address: '64 Phú Hữu, xã Tân Xã',
          City: 'Hà Nội',
          
          RoomTypeID: 22,
          roomTypeId: 22
         },
         {
           RoomID: 5,
          roomId: 5,
          BranchID: 4,
          branchId: 4,
          BranchName: 'Young House 4',
          branchName: 'Young House 4',
          TypeName: 'Giường đôi có hành lang view hồ Tân Xã',
          typeName: 'Giường đôi có hành lang view hồ Tân Xã',
          Price: 2000000,
          price: 2000000,
          Status: 'Occupied',
          isAvailable: false,
          Address: '85 Mục Uyên – Công Nghệ, Tân Xã ',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 12,
          roomTypeId: 12
        },{
          RoomID: 6,
          roomId: 6,
          BranchID: 9,
          branchId: 9,
          BranchName: 'Young House 9',
          branchName: 'Young House 9',
          TypeName: 'Giường đôi có ban công thoáng',
          typeName: 'Giường đôi có ban công thoáng',
          Price: 2000000,
          price: 2000000,
          Status: 'Occupied',
          isAvailable: false,
          Address: 'D2 – Khu Tái định cư đường 420 xã Bình Yên – Thạch Thất ',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 10,
          roomTypeId: 10
        },{
          RoomID: 7,
          roomId: 7,
          BranchID: 10,
          branchId: 10,
          BranchName: 'Young House 10',
          branchName: 'Young House 10',
          TypeName: 'Giường đôi ',
          typeName: 'Giường đôi ',
          Price: 1400000,
          price: 1400000,
          Status: 'Occupied',
          isAvailable: false,
          Address: 'Nhà văn hóa thôn Thái Bình, xã Bình Yên.  ',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 11,
          roomTypeId: 11
        },{
          RoomID: 8,
          roomId: 8,
          BranchID: 11,
          branchId: 11,
          BranchName: 'Young House 11',
          branchName: 'Young House 11',
          TypeName: 'Giường gác xép có ban công thoáng',
          typeName: 'Giường gác xép có ban công thoáng',
          Price: 2200000,
          price: 2200000,
          Status: 'Available',
          isAvailable: true,
          Address: 'Số 6, đường Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 8,
          roomTypeId: 8
        },

        {
          RoomID: 9,
          roomId: 9,
          BranchID: 12,
          branchId: 12,
          BranchName: 'Young House 12',
          branchName: 'Young House 12',
          TypeName: 'Giường gác xép có ban công thoáng',
          typeName: 'Giường gác xép có ban công thoáng',
          Price: 2500000,
          price:  2500000,
          Status: 'Occupied',
          isAvailable: false,
          Address: 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 7,
          roomTypeId: 7
        },
        {
          RoomID: 19,
          roomId: 19,
          BranchID: 12,
          branchId: 12,
          BranchName: 'Young House 12',
          branchName: 'Young House 12',
          TypeName: 'Giường đôi có ban công thoáng view FPT',
          typeName: 'Giường đôi có ban công thoáng view FPT',
          Price: 2300000,
          price:  2300000,
          Status: 'Occupied',
          isAvailable: false,
          Address: 'Gần nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 27,
          roomTypeId: 27
        },
        
        {
          RoomID: 10,
          roomId: 10,
          BranchID: 14,
          branchId: 14,
          BranchName: 'Young House 14',
          branchName: 'Young House 14',
          TypeName: 'Giường đơn có cửa sổ thoáng',
          typeName: 'Giường đơn xép có cửa sổ thoáng',
          Price: 1700000,
          price: 1700000,
          Status: 'Occupied',
          isAvailable: false,
          Address: 'Nhà thờ Phú Hữu, xã Tân Xã, Thạch Thất, Hà Nội',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 13,
          roomTypeId: 13
        }
        ,        {
          RoomID: 11,
          roomId: 11,
          BranchID: 5,
          branchId: 5,
          BranchName: 'Young House 5',
          branchName: 'Young House 5',
          TypeName: 'Giường gác xép có ban công thoáng',
          typeName: 'Giường gác xép có ban công thoáng',
          Price: 2000000,
          price: 2000000,
          Status: 'Available',
          isAvailable: true,
          Address: '23 Mục Uyên – Công nghệ - Tân Xã',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 15,
          roomTypeId: 15
        }
        ,
        {
    
          RoomID: 18,
          roomId: 18,
          BranchID: 5,
          branchId: 5,
          BranchName: 'Young House 5',
          branchName: 'Young House 5',
          TypeName: 'Giường hai giường đôi có ban công thoáng',
          typeName: 'Giường hai giường đôi có ban công thoáng',
          Price: 2800000,
          price: 2800000,
          Status: 'Occupied',
          isAvailable: false,
          Address: 'Địa chỉ Young House 4',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch4/branch4-1.jpg' }],
          RoomTypeID: 26,
          roomTypeId: 26
        },
        {
          RoomID: 12,
          roomId: 12,
          BranchID: 7,
          branchId: 7,
          BranchName: 'Young House 7',
          branchName: 'Young House 7',
          TypeName: 'Giường đôi có ban công thoáng',
          typeName: 'Giường đôi có ban công thoáng',
          Price: 2400000,
          price: 2400000,
          Status: 'Occupied',
          isAvailable: false,
          Address: 'Đối diện THPT Hai Bà Trưng - Tân Xã',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 16,
          roomTypeId: 16
        },{
          RoomID: 13,
          roomId: 13,
          BranchID: 8,
          branchId: 8,
          BranchName: 'Young House 8',
          branchName: 'Young House 8',
          TypeName: 'Giường gác xép có ban công thoáng',
          typeName: 'Giường gác xép có ban công thoáng',
          Price: 2200000,
          price: 2200000,
          Status: 'Available',
          isAvailable: true,
          Address: ' 41 Mục Uyên 1, xã Tân Xã',
          City: 'Hà Nội',
          Media: [{ FilePath: '/room/branch1/branch1-1.jpg' }],
          RoomTypeID: 17,
          roomTypeId: 17
        }
        // Add more rooms as needed
      ];
      
      // Show all rooms instead of filtering by status
      const filteredLocalRooms = localRooms;
      
      setRooms(filteredLocalRooms);
      setFilteredRooms(filteredLocalRooms);
      
      // Update pagination
      setPagination({
        page: 1,
        limit: 10,
        totalPages: Math.ceil(filteredLocalRooms.length / 10),
        totalItems: filteredLocalRooms.length
      });
    } catch (err: any) {
      console.error('Error fetching local rooms:', err);
      setError('Không thể tải danh sách phòng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search rooms
  const searchRooms = async () => {
    if (!searchQuery.trim()) {
      fetchRooms();
      return;
    }

    try {
      const response = await roomsAPI.searchRooms(searchQuery);
      
      // Update to handle new mock API response structure
      if (response.data?.success) {
        const rooms = response.data.data || [];
        setRooms(rooms);
        setFilteredRooms(rooms);
      } else {
        setRooms([]);
        setFilteredRooms([]);
      }
    } catch (err: any) {
      console.error('Error searching rooms:', err);
      setRooms([]);
      setFilteredRooms([]);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchRoomTypes();
    fetchRooms();
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    filterRooms();
  }, [selectedBranches, selectedAreas, selectedRoomTypes, priceRange, rooms, statusFilter]);

  const filterRooms = () => {
    let filtered = rooms.filter(room => {
      // Filter by status if not 'All'
      if (statusFilter === 'Available' && (room.Status !== 'Available' || !room.isAvailable)) {
        return false;
      }

      // Check if room matches selected areas
      let matchesArea = true;
      if (selectedAreas.length > 0) {
        matchesArea = selectedAreas.some(areaName => {
          const area = availableAreas.find(a => a.name === areaName);
          return area && area.branchIds.includes(room.BranchID || room.branchId);
        });
      }

      const matchesBranch = selectedBranches.length === 0 || selectedBranches.includes(room.BranchID || room.branchId);
      const matchesRoomType = selectedRoomTypes.length === 0 || selectedRoomTypes.includes(room.TypeName || room.typeName || '');
      const matchesPrice = (room.Price || room.price || 0) >= priceRange.min && (room.Price || room.price || 0) <= priceRange.max;

      return matchesArea && matchesBranch && matchesRoomType && matchesPrice;
    });

    setFilteredRooms(filtered);
  };

  const handleAreaChange = (areaName: string) => {
    setSelectedAreas(prev => 
      prev.includes(areaName) 
        ? prev.filter(area => area !== areaName)
        : [...prev, areaName]
    );
  };

  const handleBranchChange = (branchName: string) => {
    // In a real app, you'd map branchName to branchId
    // For now, we'll simulate this
    const branchId = branchName === 'Tân Xã' ? 1 : 2;
    setSelectedBranches(prev => 
      prev.includes(branchId) 
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handleRoomTypeChange = (roomType: string) => {
    if (roomType) {
      setSelectedRoomTypes([roomType]);
    } else {
      setSelectedRoomTypes([]);
    }
  };

  const clearFilters = () => {
    setSelectedBranches([]);
    setSelectedAreas([]);
    setSelectedRoomTypes([]);
    setPriceRange({ min: 0, max: 10000000 });
    setSearchQuery('');
    setStatusFilter('All'); // Show all rooms
  };

  const handleSearch = () => {
    searchRooms();
  };

  const formatPrice = (price: number) => {
    return `Từ ${new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)}`;
  };

  // Get optimized image path based on branch and room
  const getImagePath = (room: Room, size: 'thumbnail' | 'medium' | 'large' = 'medium') => {
    try {
      // Priority: prefer local public dir if Media doesn't explicitly point to /rooms
      if (room.Media && room.Media.length > 0 && room.Media[0].FilePath && room.Media[0].FilePath.startsWith('/rooms/')) {
        return room.Media[0].FilePath;
      } else {
        // Use local public directory images
        const branchId = room.BranchID || room.branchId || 1;
        const roomTypeId = room.RoomTypeID || room.roomTypeId || 1;
        const roomNumber = room.RoomID || room.roomId || 101;
        
        let imageIndex = 1;
        
        // Randomize image selection for each branch
        switch (branchId) {
          case 1: {
            const i = Math.floor(Math.random() * 9) + 1;
            return `/rooms/branch-1/Type1/branch1-${i}.${i === 9 ? 'JPG' : 'jpg'}`;
          }
          case 5: {
            const typeId = (room.RoomTypeID ?? (room as any).roomTypeId) as number | undefined;
            if (typeId === 26) {
              // Type26: branch5-26-X.jpg (6 images)
              const i = Math.floor(Math.random() * 6) + 1;
              return `/rooms/branch-5/Type26/branch5-26-${i}.jpg`;
            }
            // Default Type15: branch5-X.jpg (2 images)
            const candidates = [1,2];
            const i = candidates[Math.floor(Math.random() * candidates.length)];
            return `/rooms/branch-5/Type15/branch5-${i}.jpg`;
          }
          case 2: {
            const typeId = (room.RoomTypeID ?? (room as any).roomTypeId) as number | undefined;
            if (typeId === 5) {
              const i = Math.floor(Math.random() * 7) + 1;
              return `/rooms/branch-2/Type5/branch2-1-${i}.JPG`;
            } else if (typeId === 3) {
              const i = Math.floor(Math.random() * 4) + 1;
              return `/rooms/branch-2/Type3/branch2-2-${i}.JPG`;
            } else if (typeId === 4) {
              const i = Math.floor(Math.random() * 2) + 1;
              return `/rooms/branch-2/Type4/branch2-3-${i}.JPG`;
            } else if (typeId === 20) {
              const i = Math.floor(Math.random() * 5) + 1;
              // Handle special case for image 4
              if (i === 4) {
                return `/rooms/branch-2/Type20/branch-20-4.JPG`;
              }
              return `/rooms/branch-2/Type20/branch2-20-${i}.JPG`;
            } else if (typeId === 21) {
              const i = Math.floor(Math.random() * 5) + 1;
              return `/rooms/branch-2/Type21/branch2-21-${i}.JPG`;
            } else if (typeId === 22) {
              const i = Math.floor(Math.random() * 3) + 1;
              return `/rooms/branch-2/Type22/branch2-22-${i}.JPG`;
            }
            const i = Math.floor(Math.random() * 7) + 1;
            return `/rooms/branch-2/Type5/branch2-1-${i}.JPG`;
          }
          case 4: {
            const i = Math.floor(Math.random() * 6) + 1;
            return `/rooms/branch-4/Type12/branch4-${i}.jpg`;
          }
          case 7: {
            const i = Math.floor(Math.random() * 6) + 1;
            return `/rooms/branch-7/Type16/branch7-${i}.png`;
          }
          case 8: {
            const i = Math.floor(Math.random() * 6) + 1;
            return `/rooms/branch-8/Type17/branch8-${i}.jpg`;
          }
          case 9: {
            const i = Math.floor(Math.random() * 9) + 1;
            return `/rooms/branch-9/Type10/branch9-${i}.${i >= 8 ? 'JPG' : 'jpg'}`;
          }
          case 10: {
            // Available images: 3-6
            const candidates = [3,4,5,6];
            const i = candidates[Math.floor(Math.random() * candidates.length)];
            return `/rooms/branch-10/Type11/branch10-${i}.jpg`;
          }
          case 11: {
            const i = Math.floor(Math.random() * 7) + 1;
            return `/rooms/branch-11/Type8/branch11-${i}.jpg`;
          }
          case 12: {
            const typeId = (room.RoomTypeID ?? (room as any).roomTypeId) as number | undefined;
            if (typeId === 27) {
              const i = Math.floor(Math.random() * 4) + 1;
              return `/rooms/branch-12/Type27/branch12-27-${i}.jpg`;
            }
            const i = Math.floor(Math.random() * 9) + 1;
            return `/rooms/branch-12/Type7/branch12-${i}.jpg`;
          }
          case 14: {
            const i = Math.floor(Math.random() * 8) + 1;
            return `/rooms/branch-14/Type13/branch14-${i}.png`;
          }
          default:
            return `/rooms/branch-1/Type1/branch1-1.jpg`;
        }
      }
    } catch (error) {
      console.warn('Error generating image path:', error);
      return `/rooms/branch1/branch1-1.jpg`;
    }
  };

  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    // Increment total site visits when system home page loads
    const visits = VisitCounterService.incrementTotalSiteVisits();
    setTotalVisits(visits);
  }, []);

  return (
    <div className="system-home">
      <Meta
        title="Hệ thống nhà trọ YoungHouse Hoà Lạc"
        description="Danh sách hệ thống nhà trọ YoungHouse tại Hoà Lạc với nhiều loại phòng tiện nghi, giá tốt."
        url="https://younghousehoalac.com/system-home"
        image="/logo.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Hệ thống nhà trọ YoungHouse',
          url: 'https://younghousehoalac.com/system-home'
        }}
      />
      {/* Header Search */}
      <div className="search-header">
        <div className="container">
          <div className="breadcrumb">
            <span>Trang chủ</span>
            <span className="separator">&gt;</span>
            <span>Kết quả tìm kiếm</span>
          </div>
          
          <div className="search-bar">
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo địa chỉ hoặc tên khôn gian"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="search-button">Tìm kiếm</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="system-content">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Tìm phòng</h3>
              <button
                type="button"
                className="filters-close"
                aria-label="Đóng bộ lọc"
                onClick={() => setShowFilters(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Date Picker */}
            

            {/* Main Filter Section */}
            <div className="filter-section">
              <h4>Lọc</h4>
              
              {/* Area Filter */}
              <div className="filter-subsection">
                <h5>Khu vực</h5>
                <div className="checkbox-group">
                  {availableAreas.map(area => (
                    <label key={area.name} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedAreas.includes(area.name)}
                        onChange={() => handleAreaChange(area.name)}
                      />
                      <span>{area.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Room Type Filter */}
              {/* <div className="filter-subsection">
                <h5>Loại phòng</h5>
                <select 
                  value={selectedRoomTypes[0] || ''} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedRoomTypes([e.target.value]);
                    } else {
                      setSelectedRoomTypes([]);
                    }
                  }}
                  className="filter-select"
                >
                  <option value="">Tất cả loại phòng</option>
                  {roomTypes.map(roomType => (
                    <option key={roomType} value={roomType}>
                      {roomType}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Status Filter */}
              <div className="filter-subsection">
                <h5>Trạng thái</h5>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === 'All'}
                      onChange={() => setStatusFilter('All')}
                    />
                    <span>Tất cả phòng</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === 'Available'}
                      onChange={() => setStatusFilter('Available')}
                    />
                    <span>Chỉ phòng còn trống</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-subsection">
                <h5>Khoảng giá</h5>
                <div className="price-range">
                  <div className="price-slider">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="price-slider-input"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="price-slider-input"
                    />
                  </div>
                  <div className="price-labels">
                    <span>{formatPrice(priceRange.min)}</span>
                    <span>-</span>
                    <span>{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="clear-filters desktop-only" onClick={clearFilters}>
              Xóa bỏ lọc
            </button>
            <div className="filters-footer">
              <button className="filters-footer__clear" onClick={clearFilters}>Xóa bỏ lọc</button>
              <button className="filters-footer__apply" onClick={() => setShowFilters(false)}>Áp dụng</button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="results-header">
              <div className="results-info">
                <h2>Tất cả phòng</h2>
                <p>Có <strong>{filteredRooms.length}</strong> phòng {statusFilter === 'Available' ? 'còn trống' : 'tất cả'}</p>
              </div>
              
              <div className="view-controls">
                
                
                <div className="view-mode">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={20} />
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
              
              <button 
                className="mobile-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                Lọc
              </button>
            </div>

            {/* Room Results */}
            {isLoading ? (
              <div className="loading">Đang tải...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className={`rooms-grid ${viewMode}`}>
                {filteredRooms.map(room => (
                  <div 
                    key={room.RoomID} 
                    className="room-card"
                    onClick={(e) => {
                      // Sử dụng window.open để mở trong tab mới nếu Ctrl được giữ
                      if (e.ctrlKey || e.metaKey) {
                        window.open(`/room/${buildRoomSlug(room as any)}`, '_blank');
                      } else {
                        window.location.href = `/room/${buildRoomSlug(room as any)}`;
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="room-image">
                      {((room.BranchID || (room as any).branchId) === 5 || ((room.BranchID || (room as any).branchId) === 2 && ((room.RoomTypeID || (room as any).roomTypeId) === 20 || (room.RoomTypeID || (room as any).roomTypeId) === 21 || (room.RoomTypeID || (room as any).roomTypeId) === 22))) ? (
                        (() => {
                          const base = getImagePath(room, viewMode === 'grid' ? 'thumbnail' : 'large');
                          const webp = viewMode === 'grid'
                            ? base.replace(/\.(jpg|JPG|png|PNG)$/, '') + '.thumb.webp'
                            : base.replace(/\.(jpg|JPG|png|PNG)$/, '') + '.webp';
                          const jpg = viewMode === 'grid'
                            ? base.replace(/\.(jpg|JPG|png|PNG)$/, '') + '.thumb.jpg'
                            : base;
                          return (
                            <picture>
                              <source srcSet={webp} type="image/webp" />
                              <img
                                src={jpg}
                                alt={`${room.BranchName}`}
                                loading="lazy"
                                decoding="async"
                                onLoad={(e) => {
                                  const imgElement = e.currentTarget as HTMLImageElement;
                                  if (imgElement) {
                                    imgElement.style.opacity = '1';
                                  }
                                }}
                                onError={(e) => {
                                  const imgElement = e.currentTarget as HTMLImageElement;
                                  const parentElement = imgElement.parentElement as HTMLElement | null;
                                  if (imgElement && parentElement) {
                                    imgElement.style.display = 'none';
                                    parentElement.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
                                    parentElement.innerHTML = `
                                      <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:0.9rem;text-align:center;">
                                        <div>
                                          <div>${room.BranchName}</div>
                                          <div style=\"font-size:0.8rem;margin-top:4px;\">(${room.BranchName})</div>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                                style={{
                                  opacity: 1,
                                  transition: 'opacity 0.3s ease',
                                  width: '100%',
                                  height: '200px',
                                  objectFit: 'cover'
                                }}
                              />
                            </picture>
                          );
                        })()
                      ) : (
                        <img 
                          src={getImagePath(room, viewMode === 'grid' ? 'medium' : 'large')} 
                          alt={`${room.BranchName}`}
                          loading="lazy"
                          onLoad={(e) => {
                            const imgElement = e.currentTarget;
                            if (imgElement) {
                              imgElement.style.opacity = '1';
                            }
                          }}
                          onError={(e) => {
                            const imgElement = e.currentTarget;
                            const parentElement = imgElement.parentElement;
                            if (imgElement && parentElement) {
                              imgElement.style.display = 'none';
                              parentElement.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
                              parentElement.innerHTML = `
                                <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:0.9rem;text-align:center;">
                                  <div>
                                    <div>${room.BranchName}</div>
                                    <div style="font-size:0.8rem;margin-top:4px;">(${room.BranchName})</div>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                          style={{ 
                            opacity: 1,
                            transition: 'opacity 0.3s ease',
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <div className={`availability-badge ${room.Status === 'Occupied' ? 'occupied' : room.Status === 'Available' ? 'available' : room.Status === 'Reserved' ? 'reserved' : 'other'}`}>
                        {room.Status === 'Available' ? 'Còn trống' : 
                         room.Status === 'Occupied' ? 'Hết phòng' :
                         room.Status === 'Reserved' ? 'Đặt trước' : 'Bảo trì'}
                      </div>
                    </div>
                    
                    <div className="room-content">
                      <div className="room-price">
                        {formatPrice(room.Price ?? 0)}/tháng
                      </div>
                      
                      <h3 className="room-name">{room.BranchName}</h3>
                      
                      <div className="room-location">
                        <MapPin size={14} />
                        <span>{room.Address}, {room.City}</span>
                      </div>
                      
                      <div className="room-amenities">
                        <span className="amenity-tag">{room.TypeName}</span>
                        <span className="amenity-tag area-tag">{getRoomArea(room.BranchID || room.branchId || 1)}</span>
                        
                        {/* Add branch description details */}
                        {room.BranchID && branchDescriptions[room.BranchID] && (
                          <div className="branch-details">
                            {/* <details>
                              <summary>Chi tiết chi nhánh</summary>
                              <div className="branch-description">
                                <p><strong>Địa chỉ:</strong> {branchDescriptions[room.BranchID].address}</p>
                                <p><strong>Mô tả:</strong> {branchDescriptions[room.BranchID].description}</p>
                                
                                <div className="branch-amenities">
                                  <strong>Tiện ích:</strong>
                                  <ul>
                                    {branchDescriptions[room.BranchID].amenities.map((amenity: string, index: number) => (
                                      <li key={index}>{amenity}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="branch-services">
                                  <strong>Dịch vụ:</strong>
                                  <p>Điện: {branchDescriptions[room.BranchID].services.electricity}</p>
                                  <p>Phí dịch vụ: {branchDescriptions[room.BranchID].services.serviceCharges}</p>
                                </div>
                              </div>
                            </details> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredRooms.length === 0 && !isLoading && !error && (
              <div className="no-results">
                <p>Không tìm thấy phòng nào phù hợp với tiêu chí của bạn.</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Xóa bộ lọc
                </button>
              </div>
              )}


              {/* Pagination */}
            <div className="pagination">
              <button className="page-btn active">1</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SystemHome;