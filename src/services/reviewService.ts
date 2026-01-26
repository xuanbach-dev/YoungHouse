import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Types
export interface RoomReview {
  id: number;
  roomId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  pros?: string;
  cons?: string;
  stayDuration?: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateReviewData {
  roomId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  pros?: string;
  cons?: string;
  stayDuration?: string;
}

interface DbRoomReview {
  id: number;
  room_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  pros: string | null;
  cons: string | null;
  stay_duration: string | null;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// Convert database row to frontend type
const dbToReview = (row: DbRoomReview): RoomReview => ({
  id: row.id,
  roomId: row.room_id,
  reviewerName: row.reviewer_name,
  rating: row.rating,
  comment: row.comment,
  pros: row.pros || undefined,
  cons: row.cons || undefined,
  stayDuration: row.stay_duration || undefined,
  isVerified: row.is_verified,
  isApproved: row.is_approved,
  createdAt: row.created_at
});

export interface ReviewServiceResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

export class ReviewService {
  // Lấy tất cả reviews của một phòng
  static async getReviewsByRoomId(roomId: number): Promise<ReviewServiceResponse<RoomReview[]>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const { data, error } = await supabase
        .from('room_reviews')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return { ok: false, error: error.message };
      }

      const reviews = (data as DbRoomReview[]).map(dbToReview);
      return { ok: true, data: reviews };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Lấy thống kê rating của một phòng
  static async getRoomRatingStats(roomId: number): Promise<ReviewServiceResponse<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const { data, error } = await supabase
        .from('room_reviews')
        .select('rating')
        .eq('room_id', roomId)
        .eq('is_approved', true);

      if (error) {
        console.error('Supabase error:', error);
        return { ok: false, error: error.message };
      }

      const ratings = (data as { rating: number }[]).map(r => r.rating);
      const totalReviews = ratings.length;
      
      if (totalReviews === 0) {
        return {
          ok: true,
          data: {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          }
        };
      }

      const averageRating = ratings.reduce((a, b) => a + b, 0) / totalReviews;
      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratings.forEach(r => {
        ratingDistribution[r] = (ratingDistribution[r] || 0) + 1;
      });

      return {
        ok: true,
        data: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
          ratingDistribution
        }
      };
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Tạo review mới
  static async createReview(reviewData: CreateReviewData): Promise<ReviewServiceResponse<{ id: number }>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const { data, error } = await supabase
        .from('room_reviews')
        .insert({
          room_id: reviewData.roomId,
          reviewer_name: reviewData.reviewerName,
          rating: reviewData.rating,
          comment: reviewData.comment,
          pros: reviewData.pros || null,
          cons: reviewData.cons || null,
          stay_duration: reviewData.stayDuration || null,
          is_verified: false,
          is_approved: true // Auto-approve, có thể đổi thành false nếu muốn admin duyệt
        })
        .select('id')
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        return { ok: false, error: error.message };
      }

      return { ok: true, data: { id: data.id } };
    } catch (error) {
      console.error('Error creating review:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Xóa review (admin)
  static async deleteReview(id: number): Promise<ReviewServiceResponse<void>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const { error } = await supabase
        .from('room_reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        return { ok: false, error: error.message };
      }

      return { ok: true };
    } catch (error) {
      console.error('Error deleting review:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Duyệt/ẩn review (admin)
  static async updateReviewApproval(id: number, isApproved: boolean): Promise<ReviewServiceResponse<void>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const { error } = await supabase
        .from('room_reviews')
        .update({ is_approved: isApproved })
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        return { ok: false, error: error.message };
      }

      return { ok: true };
    } catch (error) {
      console.error('Error updating review approval:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Lấy tất cả reviews (admin - bao gồm cả chưa duyệt)
  static async getAllReviews(): Promise<ReviewServiceResponse<RoomReview[]>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const { data, error } = await supabase
        .from('room_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return { ok: false, error: error.message };
      }

      const reviews = (data as DbRoomReview[]).map(dbToReview);
      return { ok: true, data: reviews };
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default ReviewService;
