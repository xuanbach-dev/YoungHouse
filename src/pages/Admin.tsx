import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Lock,
  LogOut,
  Home,
  Filter
} from 'lucide-react';
import { Room } from '../types';
import { 
  fetchRooms, 
  batchUpdateRooms, 
  isSupabaseConfigured,
  clearCache,
  RoomStatus
} from '../services/roomService';
import './Admin.css';

// Type for tracking changes
interface RoomChange {
  status: RoomStatus;
  isAvailable: boolean;
  price?: number;
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Track changes (status and price)
  const [changes, setChanges] = useState<Map<number, RoomChange>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  
  // Filter
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Admin password from env or default
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'younghouse2024';

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setAuthError('');
      // Save auth state to session
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      setAuthError('Mật khẩu không đúng');
    }
  };

  // Check session on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  // Fetch rooms
  const loadRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      clearCache(); // Clear cache to get fresh data
      const roomsData = await fetchRooms();
      setRooms(roomsData);
      setChanges(new Map());
    } catch (err: any) {
      setError('Không thể tải danh sách phòng');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRooms();
    }
  }, [isAuthenticated]);

  // Handle status change
  const handleStatusChange = (roomId: number, newStatus: RoomStatus, room: Room) => {
    const isAvailable = newStatus === 'Available';
    setChanges(prev => {
      const newChanges = new Map(prev);
      const existing = prev.get(roomId);
      newChanges.set(roomId, { 
        status: newStatus, 
        isAvailable,
        price: existing?.price // Keep existing price change if any
      });
      return newChanges;
    });
  };

  // Handle price change
  const handlePriceChange = (roomId: number, newPrice: number, room: Room) => {
    setChanges(prev => {
      const newChanges = new Map(prev);
      const existing = prev.get(roomId);
      const currentStatus = existing?.status || (room.Status as RoomStatus) || 'Available';
      newChanges.set(roomId, { 
        status: currentStatus, 
        isAvailable: currentStatus === 'Available',
        price: newPrice
      });
      return newChanges;
    });
  };

  // Get current status (from changes or original)
  const getCurrentStatus = (room: Room): RoomStatus => {
    const roomId = room.roomId || room.RoomID || 0;
    if (changes.has(roomId)) {
      return changes.get(roomId)!.status;
    }
    return (room.Status as RoomStatus) || 'Available';
  };

  // Get current price (from changes or original)
  const getCurrentPrice = (room: Room): number => {
    const roomId = room.roomId || room.RoomID || 0;
    if (changes.has(roomId) && changes.get(roomId)!.price !== undefined) {
      return changes.get(roomId)!.price!;
    }
    return room.Price || room.price || 0;
  };

  // Save all changes
  const handleSaveChanges = async () => {
    if (changes.size === 0) {
      setSuccessMessage('Không có thay đổi nào để lưu');
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    if (!isSupabaseConfigured()) {
      setError('Supabase chưa được cấu hình. Vui lòng kiểm tra file .env');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updates = Array.from(changes.entries()).map(([roomId, change]) => ({
        roomId,
        status: change.status,
        isAvailable: change.isAvailable,
        price: change.price
      }));

      const result = await batchUpdateRooms(updates);

      if (result.success) {
        setSuccessMessage(`Đã cập nhật ${updates.length} phòng thành công!`);
        setChanges(new Map());
        await loadRooms(); // Refresh data
      } else {
        setError(result.error || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  // Get unique branch names
  const branchNames = Array.from(new Set(rooms.map(r => r.BranchName || r.branchName || ''))).sort();

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const branchName = room.BranchName || room.branchName || '';
    const status = getCurrentStatus(room);
    
    if (filterBranch !== 'all' && branchName !== filterBranch) return false;
    if (filterStatus !== 'all' && status !== filterStatus) return false;
    
    return true;
  });

  // Status options
  const statusOptions: { value: RoomStatus; label: string; color: string }[] = [
    { value: 'Available', label: 'Còn phòng', color: '#10b981' },
    { value: 'Reserved', label: 'Đặt trước', color: '#f59e0b' },
    { value: 'Occupied', label: 'Đã thuê', color: '#ef4444' },
    { value: 'Maintenance', label: 'Bảo trì', color: '#6b7280' }
  ];

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <Lock size={48} />
            <h1>Admin Panel</h1>
            <p>YoungHouse Room Management</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Mật khẩu Admin</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                autoFocus
              />
            </div>
            
            {authError && (
              <div className="auth-error">
                <AlertCircle size={16} />
                {authError}
              </div>
            )}
            
            <button type="submit" className="login-button">
              Đăng nhập
            </button>
          </form>
          
          <div className="login-footer">
            <a href="/" className="back-home">
              <Home size={16} />
              Về trang chủ
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <h1>Quản lý Trạng thái Phòng</h1>
          <span className="subtitle">YoungHouse Admin Panel</span>
        </div>
        
        <div className="header-right">
          {!isSupabaseConfigured() && (
            <div className="supabase-warning">
              <AlertCircle size={16} />
              Supabase chưa cấu hình - Đang dùng dữ liệu local
            </div>
          )}
          
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="toolbar-left">
          <div className="filter-group">
            <Filter size={18} />
            <select 
              value={filterBranch} 
              onChange={(e) => setFilterBranch(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả cơ sở</option>
              {branchNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <span className="room-count">
            Hiển thị {filteredRooms.length} / {rooms.length} phòng
          </span>
        </div>
        
        <div className="toolbar-right">
          <button 
            onClick={loadRooms} 
            className="refresh-button"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
            Làm mới
          </button>
          
          <button 
            onClick={handleSaveChanges} 
            className="save-button"
            disabled={isSaving || changes.size === 0}
          >
            <Save size={18} />
            Lưu thay đổi ({changes.size})
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="message error-message">
          <AlertCircle size={20} />
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {successMessage && (
        <div className="message success-message">
          <CheckCircle size={20} />
          {successMessage}
        </div>
      )}

      {/* Room Table */}
      <div className="admin-content">
        {isLoading ? (
          <div className="loading-state">
            <RefreshCw size={32} className="spinning" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="rooms-table-container">
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cơ sở</th>
                  <th>Loại phòng</th>
                  <th>Giá</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Thay đổi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map(room => {
                  const roomId = room.roomId || room.RoomID || 0;
                  const currentStatus = getCurrentStatus(room);
                  const currentPrice = getCurrentPrice(room);
                  const originalPrice = room.Price || room.price || 0;
                  const hasChange = changes.has(roomId);
                  const originalStatus = room.Status || 'Available';
                  const change = changes.get(roomId);
                  const priceChanged = change?.price !== undefined && change.price !== originalPrice;
                  const statusChanged = hasChange && change?.status !== originalStatus;
                  
                  return (
                    <tr key={roomId} className={hasChange ? 'has-change' : ''}>
                      <td className="room-id">{roomId}</td>
                      <td className="branch-name">{room.BranchName || room.branchName}</td>
                      <td className="type-name">{room.TypeName || room.typeName}</td>
                      <td className="price-cell">
                        <input
                          type="number"
                          value={currentPrice}
                          onChange={(e) => handlePriceChange(roomId, parseInt(e.target.value) || 0, room)}
                          className={`price-input ${priceChanged ? 'price-changed' : ''}`}
                          step="100000"
                          min="0"
                        />
                      </td>
                      <td className="address">{room.Address || room.address}</td>
                      <td className="status-cell">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(roomId, e.target.value as RoomStatus, room)}
                          className={`status-select status-${currentStatus.toLowerCase()}`}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="change-indicator">
                        {statusChanged && (
                          <span className="changed-badge">
                            {originalStatus} → {currentStatus}
                          </span>
                        )}
                        {priceChanged && (
                          <span className="changed-badge price-badge">
                            {originalPrice.toLocaleString('vi-VN')}đ → {currentPrice.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredRooms.length === 0 && (
              <div className="no-rooms">
                <p>Không tìm thấy phòng nào phù hợp với bộ lọc</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="admin-stats">
        <div className="stat-card available">
          <span className="stat-value">
            {rooms.filter(r => getCurrentStatus(r) === 'Available').length}
          </span>
          <span className="stat-label">Còn phòng</span>
        </div>
        <div className="stat-card reserved">
          <span className="stat-value">
            {rooms.filter(r => getCurrentStatus(r) === 'Reserved').length}
          </span>
          <span className="stat-label">Đặt trước</span>
        </div>
        <div className="stat-card occupied">
          <span className="stat-value">
            {rooms.filter(r => getCurrentStatus(r) === 'Occupied').length}
          </span>
          <span className="stat-label">Đã thuê</span>
        </div>
        <div className="stat-card maintenance">
          <span className="stat-value">
            {rooms.filter(r => getCurrentStatus(r) === 'Maintenance').length}
          </span>
          <span className="stat-label">Bảo trì</span>
        </div>
      </div>
    </div>
  );
};

export default Admin;
