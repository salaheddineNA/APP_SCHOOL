import axios from 'axios';

const BASE_URL = 'https://ifiag.pidefood.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  birth_date: string;
  gender: string;
  birth_place: string;
  address: string;
  class: string;
  field: string;
  enrollment_date: string;
  description?: string;
  photo?: File;
}

interface Student {
  id: number;
  student_id: string;
  phone: string;
  birth_date: string;
  gender: string;
  birth_place: string;
  address: string;
  class: string;
  field: string;
  enrollment_date: string;
  status: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  photo: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    student?: Student;
    access_token: string;
    token_type: string;
  };
}
interface UpdateProfileData {
  phone?: string;
  birth_date?: string;
  gender?: string;
  birth_place?: string;
  address?: string;
  class?: string;
  field?: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    student?: Student;
  };
}

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Login attempt with credentials:', { email: credentials.email });
      
      const response = await api.post('/auth/login', credentials);
      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);
      console.log('Login response data:', response.data);
      
      const { data } = response.data;
      
      if (data.access_token) {
        const token = `${data.token_type} ${data.access_token}`;
        console.log('Storing token:', token.substring(0, 20) + '...');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.student) {
          localStorage.setItem('student', JSON.stringify(data.student));
        }
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Login failed';
        console.error('Server error response:', error.response.data);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error('No response received. Request details:', error.request);
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        console.error('Request setup error:', error.message);
        throw new Error('Error setting up the request. Please try again.');
      }
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Registration attempt with data:', { email: data.email });
      
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Registration response:', response.data);
      
      const { data: responseData } = response.data;
      
      if (responseData.access_token) {
        const token = `${responseData.token_type} ${responseData.access_token}`;
        console.log('Storing token:', token.substring(0, 20) + '...');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        if (responseData.student) {
          localStorage.setItem('student', JSON.stringify(responseData.student));
        }
      }
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Registration failed';
        console.error('Server error response:', error.response.data);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error('No response received. Request details:', error.request);
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        console.error('Request setup error:', error.message);
        throw new Error('Error setting up the request. Please try again.');
      }
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('student');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getCurrentStudent(): Student | null {
    const studentStr = localStorage.getItem('student');
    if (studentStr) return JSON.parse(studentStr);
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  setupAxiosInterceptors() {
    api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = token;
        }
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        
        console.log('Request config:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
        });
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response) => {
        console.log('Response received:', {
          status: response.status,
          headers: response.headers,
        });
        return response;
      },
      (error) => {
        console.error('Response error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  },

  async getProfile(): Promise<ProfileResponse> {
    try {
      console.log('Fetching user profile...');
      const response = await api.get('/auth/profile');
      console.log('Profile response:', response.data);
      
      const { data } = response.data;
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      if (data.student) {
        localStorage.setItem('student', JSON.stringify(data.student));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Profile fetch error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch profile';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      } else {
        throw new Error('Error setting up the request. Please try again.');
      }
    }
  },
  async updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
    try {
      console.log('Updating profile with data:', data);
      const response = await api.put('/auth/profile', data);
      console.log('Profile update response:', response.data);

      const { data: responseData } = response.data;

      if (responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
      }
      if (responseData.student) {
        localStorage.setItem('student', JSON.stringify(responseData.student));
      }

      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to update profile';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      } else {
        throw new Error('Error setting up the request. Please try again.');
      }
    }
  }
  
};

authService.setupAxiosInterceptors();

export default authService;
