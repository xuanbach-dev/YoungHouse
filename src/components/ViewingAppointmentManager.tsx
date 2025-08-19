import React, { useEffect, useMemo, useState } from 'react';
import { viewingAppointmentsAPI } from '../services/api';
import { ViewingAppointment } from '../types';

type StatusFilter = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

interface PaginationState {
  page: number;
  limit: number;
}

const statusColors: Record<string, string> = {
  Pending: '#f59e0b',
  Confirmed: '#10b981',
  Completed: '#3b82f6',
  Cancelled: '#ef4444',
};

const ViewingAppointmentManager: React.FC = () => {
  const [items, setItems] = useState<ViewingAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>('All');
  const [search, setSearch] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, limit: 10 });
  const [stats, setStats] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, statRes] = await Promise.all([
        viewingAppointmentsAPI.getAll(),
        viewingAppointmentsAPI.getStatistics(),
      ]);
      
      // Update to handle mock API response structure
      const rows = (listRes.data?.data || []) as any[];
      const normalized: ViewingAppointment[] = rows.map((r: any) => ({
        appointmentId: r.appointmentId ?? r.AppointmentID,
        fullName: r.fullName ?? r.FullName ?? '',
        email: r.email ?? r.Email ?? '',
        phone: r.phone ?? r.Phone ?? '',
        viewingDate: r.viewingDate ?? r.ViewingDate ?? '',
        viewingTime: r.viewingTime ?? r.ViewingTime ?? '',
        roomId: r.roomId ?? r.RoomID ?? 0,
        note: r.note ?? r.Note ?? '',
        status: r.status ?? r.Status ?? 'Pending'
      }));
      
      setItems(normalized);
      
      // Update to handle mock API response structure
      setStats(statRes.data || null);
    } catch (err: any) {
      console.error(err);
      setError('Không thể tải danh sách lịch hẹn nha');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pagination.page, pagination.limit]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((it) =>
      (it.fullName || '').toLowerCase().includes(q) ||
      (it.email || '').toLowerCase().includes(q) ||
      (it.phone || '').toLowerCase().includes(q) ||
      (it.roomNumber || '').toLowerCase().includes(q) ||
      (it.branchName || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleUpdateStatus = async (id?: number, newStatus?: ViewingAppointment['status']) => {
    if (!id || !newStatus) return;
    try {
      await viewingAppointmentsAPI.updateStatus(id, newStatus);
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Xóa lịch hẹn này?')) return;
    try {
      await viewingAppointmentsAPI.delete(id);
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Không thể xóa lịch hẹn');
    }
  };

  return (
    <div className="va-manager">
      <div className="va-toolbar">
        <div className="va-filters">
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
            <option value="All">Tất cả trạng thái</option>
            <option value="Pending">Chờ xác nhận</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="Completed">Hoàn tất</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT, phòng, chi nhánh"
          />
        </div>
        <div className="va-pagination">
          <label>
            Trang:
            <input
              type="number"
              min={1}
              value={pagination.page}
              onChange={(e) => setPagination({ ...pagination, page: Number(e.target.value) || 1 })}
            />
          </label>
          <label>
            Mỗi trang:
            <select
              value={pagination.limit}
              onChange={(e) => setPagination({ ...pagination, limit: Number(e.target.value) })}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      {stats && (
        <div className="va-stats">
          <div> Tổng: {stats.TotalAppointments}</div>
          <div> Chờ: {stats.PendingAppointments}</div>
          <div> Xác nhận: {stats.ConfirmedAppointments}</div>
          <div> Hoàn tất: {stats.CompletedAppointments}</div>
          <div> Hủy: {stats.CancelledAppointments}</div>
          <div> Hôm nay: {stats.AppointmentsToday}</div>
          <div> 30 ngày: {stats.AppointmentsThisMonth}</div>
        </div>
      )}

      {error && <div className="va-error">{error}</div>}

      <div className="va-table-wrapper">
        <table className="va-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Ngày/Giờ</th>
              <th>Phòng</th>
              <th>Chi nhánh</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>Đang tải...</td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8}>Không có dữ liệu</td>
              </tr>
            ) : (
              filteredItems.map((it) => (
                <tr key={it.appointmentId}>
                  <td>{it.appointmentId}</td>
                  <td>
                    <div>{it.fullName}</div>
                    {it.note && <small className="muted">{it.note}</small>}
                  </td>
                  <td>
                    <div>{it.phone}</div>
                    <small className="muted">{it.email}</small>
                  </td>
                  <td>
                    <div>{it.viewingDate}</div>
                    <small className="muted">{it.viewingTime}</small>
                  </td>
                    <td>{it.roomNumber || it.roomId}</td>
                    <td>{it.branchName || it.address}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusColors[it.status || 'Pending'] || '#6b7280' }}
                    >
                      {it.status}
                    </span>
                  </td>
                  <td>
                    <div className="va-actions">
                      <button onClick={() => handleUpdateStatus(it.appointmentId, 'Confirmed')}>Xác nhận</button>
                      <button onClick={() => handleUpdateStatus(it.appointmentId, 'Completed')}>Hoàn tất</button>
                      <button onClick={() => handleUpdateStatus(it.appointmentId, 'Cancelled')}>Hủy</button>
                      <button className="danger" onClick={() => handleDelete(it.appointmentId)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .va-manager { display: flex; flex-direction: column; gap: 16px; }
        .va-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
        .va-filters { display: flex; gap: 12px; align-items: center; }
        .va-filters input { padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 6px; min-width: 280px; }
        .va-filters select { padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 6px; }
        .va-pagination { display: flex; gap: 12px; align-items: center; }
        .va-pagination input, .va-pagination select { margin-left: 6px; padding: 6px 8px; border: 1px solid #e5e7eb; border-radius: 6px; }
        .va-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; }
        .va-error { color: #ef4444; }
        .va-table-wrapper { overflow: auto; border: 1px solid #e5e7eb; border-radius: 8px; }
        .va-table { width: 100%; border-collapse: collapse; }
        .va-table th, .va-table td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; text-align: left; vertical-align: top; }
        .va-table thead th { background: #f9fafb; font-weight: 600; }
        .status-badge { color: white; padding: 4px 8px; border-radius: 999px; font-size: 12px; }
        .muted { color: #6b7280; }
        .va-actions { display: flex; gap: 8px; }
        .va-actions button { padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 6px; background: white; cursor: pointer; }
        .va-actions button:hover { background: #f9fafb; }
        .va-actions .danger { color: #ef4444; border-color: #fecaca; }
      `}</style>
    </div>
  );
};

export default ViewingAppointmentManager;

