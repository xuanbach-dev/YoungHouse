import emailjs from '@emailjs/browser';

// Log all environment variables
console.log('FULL ENVIRONMENT:', process.env);

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_00yzgsa';
const EMAILJS_TEMPLATE_CUSTOMER = process.env.REACT_APP_EMAILJS_TEMPLATE_CUSTOMER || 'template_79a365i';
const EMAILJS_TEMPLATE_ADMIN = process.env.REACT_APP_EMAILJS_TEMPLATE_ADMIN || 'template_dv5bj2n';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'hpFIxedDi-Y-p1qob';

// Detailed logging function
const logEmailJSConfig = () => {
  console.log('EmailJS Configuration:', {
    SERVICE_ID: EMAILJS_SERVICE_ID,
    TEMPLATE_CUSTOMER: EMAILJS_TEMPLATE_CUSTOMER,
    TEMPLATE_ADMIN: EMAILJS_TEMPLATE_ADMIN,
    PUBLIC_KEY_DIRECT: EMAILJS_PUBLIC_KEY,
    PUBLIC_KEY_ENV: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
    PUBLIC_KEY_SET: !!EMAILJS_PUBLIC_KEY,
    ENV_KEYS: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
  });
};

// Initialize EmailJS
try {
  console.log('Attempting to initialize EmailJS...');
  logEmailJSConfig();
  
  emailjs.init(EMAILJS_PUBLIC_KEY);
  console.log('EmailJS initialized successfully');
} catch (error) {
  console.error('EmailJS Initialization Error:', error);
}

export interface AppointmentData {
  fullName: string;
  email: string;
  phone: string;
  viewingDate: string;
  viewingTime: string;
  roomNumber: string;
  roomType: string;
  note?: string;
}

export const emailService = {
  // Initialize EmailJS (call this in your app's entry point)
  initialize: () => {
    try {
      // Validate configuration
      logEmailJSConfig();
      
      if (!EMAILJS_PUBLIC_KEY) {
        console.error('EmailJS Public Key is not set. Please add REACT_APP_EMAILJS_PUBLIC_KEY to your .env file.');
        return false;
      }
      
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_CUSTOMER || !EMAILJS_TEMPLATE_ADMIN) {
        console.error('EmailJS configuration is incomplete. Check service and template IDs in .env file.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing EmailJS:', error);
      return false;
    }
  },

  // Send confirmation email to customer
  sendAppointmentConfirmation: async (appointmentData: AppointmentData) => {
    try {
      // Validate required fields
      if (!appointmentData.email) {
        console.error('ERROR: Customer email is required');
        throw new Error('Customer email is required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(appointmentData.email)) {
        console.error('ERROR: Invalid email format', appointmentData.email);
        throw new Error('Invalid email format');
      }

      console.log('Sending confirmation email to:', appointmentData.email);

      // Send email to customer
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_TEMPLATE_CUSTOMER,
        {
          to_email: appointmentData.email,
          full_name: appointmentData.fullName || 'Khách hàng',
          phone: appointmentData.phone || 'Chưa cung cấp',
          viewing_date: appointmentData.viewingDate || 'Chưa xác định',
          viewing_time: appointmentData.viewingTime || 'Chưa xác định',
          room_number: appointmentData.roomNumber || 'Chưa xác định',
          room_type: appointmentData.roomType || 'Phòng Trọ',
          note: appointmentData.note || 'Không có ghi chú'
        }
      );
      
      console.log('Customer confirmation email sent successfully', response);
      return true;
    } catch (error) {
      console.error('Error sending customer confirmation email:', error);
      throw error;
    }
  },

  // Send notification email to admin
  sendAdminAppointmentNotification: async (appointmentData: AppointmentData) => {
    try {
      // Validate required fields
      if (!appointmentData.email) {
        console.error('ERROR: Customer email is required for admin notification');
        throw new Error('Customer email is required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(appointmentData.email)) {
        console.error('ERROR: Invalid email format', appointmentData.email);
        throw new Error('Invalid email format');
      }

      console.log('Sending admin notification email');

      // Send email to admin
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_TEMPLATE_ADMIN,
        {
          to_email: 'bachqxhe180125@fpt.edu.vn', // Your admin email
          full_name: appointmentData.fullName || 'Khách hàng',
          email: appointmentData.email,
          phone: appointmentData.phone || 'Chưa cung cấp',
          viewing_date: appointmentData.viewingDate || 'Chưa xác định',
          viewing_time: appointmentData.viewingTime || 'Chưa xác định',
          room_number: appointmentData.roomNumber || 'Chưa xác định',
          room_type: appointmentData.roomType || 'Phòng Trọ',
          note: appointmentData.note || 'Không có ghi chú'
        }
      );
      
      console.log('Admin notification email sent successfully', response);
      return true;
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      throw error;
    }
  }
};
