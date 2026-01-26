import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RoommatePost, CreateRoommatePostData } from '../types';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Database row type
interface DbRoommatePost {
  id: number;
  title: string;
  description: string;
  location: string | null;
  price: string | null;
  room_type: string | null;
  gender: string | null;
  age: string | null;
  contact: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Convert database row to frontend type
const dbToRoommatePost = (row: DbRoommatePost): RoommatePost => ({
  id: row.id,
  title: row.title,
  description: row.description,
  location: row.location || '',
  price: row.price || '',
  roomType: row.room_type || '',
  gender: row.gender || '',
  age: row.age || '',
  contact: row.contact,
  createdAt: row.created_at,
  status: row.status
});

export interface RoommateServiceResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

export class RoommateService {
  // Lấy danh sách tất cả bài đăng
  static async getAllPosts(): Promise<RoommateServiceResponse<RoommatePost[]>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình. Vui lòng kiểm tra file .env' };
    }

    try {
      const { data, error } = await supabase
        .from('roommate_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return { ok: false, error: error.message };
      }

      const posts = (data as DbRoommatePost[]).map(dbToRoommatePost);
      return { ok: true, data: posts };
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Tạo bài đăng mới
  static async createPost(postData: CreateRoommatePostData): Promise<RoommateServiceResponse<{ id: number }>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình. Vui lòng kiểm tra file .env' };
    }

    try {
      const { data, error } = await supabase
        .from('roommate_posts')
        .insert({
          title: postData.title,
          description: postData.description,
          location: postData.location || null,
          price: postData.price || null,
          room_type: postData.roomType || null,
          gender: postData.gender || null,
          age: postData.age || null,
          contact: postData.contact,
          status: postData.status || 'active'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        return { ok: false, error: error.message };
      }

      return { ok: true, data: { id: data.id } };
    } catch (error) {
      console.error('Error creating post in Supabase:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Cập nhật bài đăng
  static async updatePost(id: number, postData: Partial<CreateRoommatePostData>): Promise<RoommateServiceResponse<void>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const updateData: any = {};
      if (postData.title !== undefined) updateData.title = postData.title;
      if (postData.description !== undefined) updateData.description = postData.description;
      if (postData.location !== undefined) updateData.location = postData.location || null;
      if (postData.price !== undefined) updateData.price = postData.price || null;
      if (postData.roomType !== undefined) updateData.room_type = postData.roomType || null;
      if (postData.gender !== undefined) updateData.gender = postData.gender || null;
      if (postData.age !== undefined) updateData.age = postData.age || null;
      if (postData.contact !== undefined) updateData.contact = postData.contact;
      if (postData.status !== undefined) updateData.status = postData.status;

      const { error } = await supabase
        .from('roommate_posts')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        return { ok: false, error: error.message };
      }

      return { ok: true };
    } catch (error) {
      console.error('Error updating post:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Cập nhật trạng thái bài đăng
  static async updatePostStatus(id: number, status: 'active' | 'inactive' | 'closed'): Promise<RoommateServiceResponse<void>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const { error } = await supabase
        .from('roommate_posts')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Supabase status update error:', error);
        return { ok: false, error: error.message };
      }

      return { ok: true };
    } catch (error) {
      console.error('Error updating post status:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Xóa bài đăng
  static async deletePost(id: number): Promise<RoommateServiceResponse<void>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const { error } = await supabase
        .from('roommate_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        return { ok: false, error: error.message };
      }

      return { ok: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Lấy bài đăng theo ID
  static async getPostById(id: number): Promise<RoommateServiceResponse<RoommatePost>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      const { data, error } = await supabase
        .from('roommate_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase fetch error:', error);
        return { ok: false, error: error.message };
      }

      return { ok: true, data: dbToRoommatePost(data as DbRoommatePost) };
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Lọc bài đăng theo các tiêu chí
  static async getFilteredPosts(filters: {
    location?: string;
    roomType?: string;
    gender?: string;
    price?: string;
    status?: string;
  }): Promise<RoommateServiceResponse<RoommatePost[]>> {
    if (!supabase) {
      return { ok: false, error: 'Supabase chưa được cấu hình' };
    }

    try {
      let query = supabase
        .from('roommate_posts')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters at database level
      if (filters.status) {
        query = query.eq('status', filters.status.toLowerCase());
      }
      if (filters.gender) {
        query = query.ilike('gender', `%${filters.gender}%`);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.roomType) {
        query = query.ilike('room_type', `%${filters.roomType}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase filter error:', error);
        return { ok: false, error: error.message };
      }

      let posts = (data as DbRoommatePost[]).map(dbToRoommatePost);

      // Apply price filter client-side (since it's a string field)
      if (filters.price) {
        posts = posts.filter(post => 
          post.price.toLowerCase().includes(filters.price!.toLowerCase())
        );
      }

      return { ok: true, data: posts };
    } catch (error) {
      console.error('Error filtering posts:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default RoommateService;
