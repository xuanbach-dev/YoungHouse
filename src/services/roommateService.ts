import { RoommatePost, CreateRoommatePostData } from '../types';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7TrAe3Mvwo0DKvRI8hcFF6Ip48Y4TqWv0ed-e9ZjNI_hHGckBuw4z0wZaBjto2Hb9/exec';
const SECRET_TOKEN = '4410desk35';

export interface RoommateServiceResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export class RoommateService {
  // Lấy danh sách tất cả bài đăng
  static async getAllPosts(): Promise<RoommateServiceResponse<RoommatePost[]>> {
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching roommate posts:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Tạo bài đăng mới
  static async createPost(postData: CreateRoommatePostData): Promise<RoommateServiceResponse<{ id: number }>> {
    try {
      // Tạo URL với parameters
      const url = new URL(GOOGLE_APPS_SCRIPT_URL);
      url.searchParams.append('token', SECRET_TOKEN);
      
      // Thêm các field vào URL parameters
      Object.entries(postData).forEach(([key, value]) => {
        if (value) {
          // Đặc biệt xử lý cho số điện thoại để giữ số 0 ở đầu
          if (key === 'contact' && /^0\d+$/.test(value)) {
            // Thêm dấu nháy đơn để Google Sheets hiểu đây là text
            url.searchParams.append(key, `'${value}`);
          } else {
            url.searchParams.append(key, value);
          }
        }
      });

      console.log('Request URL:', url.toString());

      // Sử dụng GET request thay vì POST vì Google Apps Script xử lý parameters qua GET
      const response = await fetch(url.toString(), {
        method: 'GET'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
      }

      const responseText = await response.text();
      console.log('Response text:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      return result;
    } catch (error) {
      console.error('Error creating roommate post:', error);
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
    try {
      const allPosts = await this.getAllPosts();
      
      if (!allPosts.ok || !allPosts.data) {
        return allPosts;
      }

      let filteredPosts = allPosts.data;

      // Áp dụng các bộ lọc
      if (filters.location) {
        filteredPosts = filteredPosts.filter(post => 
          post.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.roomType) {
        filteredPosts = filteredPosts.filter(post => 
          post.roomType.toLowerCase().includes(filters.roomType!.toLowerCase())
        );
      }

      if (filters.gender) {
        filteredPosts = filteredPosts.filter(post => 
          post.gender.toLowerCase() === filters.gender!.toLowerCase()
        );
      }

      if (filters.price) {
        filteredPosts = filteredPosts.filter(post => 
          post.price.toLowerCase().includes(filters.price!.toLowerCase())
        );
      }

      if (filters.status) {
        filteredPosts = filteredPosts.filter(post => 
          post.status.toLowerCase() === filters.status!.toLowerCase()
        );
      }

      return {
        ok: true,
        data: filteredPosts
      };
    } catch (error) {
      console.error('Error filtering roommate posts:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
