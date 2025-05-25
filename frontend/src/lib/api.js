
// src/lib/api.js
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${API}/api/v1`;

const api = axios.create({ baseURL: API_URL });

// ✅ Add Authorization header on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Adjust to your token storage logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
// -----------------
// Authentication
// -----------------
export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data);
    const { success, accessToken, refreshToken, user, message, twoFactorRequired } = response.data;

    if (success) {
      if (twoFactorRequired) {
        console.log('2FA required, redirecting to OTP verification...');
        return { success, twoFactorRequired, message, user }; // 2FA flow
      }

      // Save tokens and userId to localStorage
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user.id);

      return { success, accessToken, refreshToken, user, message }; // ✅ include tokens here
    } else {
      throw new Error(message || 'Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error.response?.data || error.message);
    throw error;
  }
};

export const signup = async (data) => {
  try {
    const response = await api.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error.response?.data || error.message);
    throw error;
  }
};


// 🔒 Authenticated Axios instance with token
export const apiWithAuth = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.warn("⚠️ No token found for authenticated request.");
  }

  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch user profile
// Then use:
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error;
  }
};

// -----------------
// 2FA & OTP
// -----------------
export const sendOtp = async (data) => {
  try {
    const response = await api.post('/auth/send_otp', data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw error;
  }
};

export const enable2FA = async (data) => {
  try {
    const response = await api.post('/auth/enable-2fa', data);
    return response.data;
  } catch (error) {
    console.error("Error enabling 2FA:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyTwoFactor = async (data) => {
  try {
    const response = await api.post('/auth/verify-2fa', data);
    if (response.data?.success) {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Failed to verify 2FA");
    }
  } catch (error) {
    console.error("Error verifying 2FA:", error.response?.data || error.message);
    throw error;
  }
};

export const disable2FA = async () => {
  try {
    const response = await api.post('/auth/disable-2fa');
    return response.data;
  } catch (error) {
    console.error("Error disabling 2FA:", error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await api.post('/auth/reset_password', {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error.response?.data || error.message);
    throw error;
  }
};

export const resendVerification = async (data) => {
  try {
    const response = await api.post('/auth/resend-verification', data);
    return response.data;
  } catch (error) {
    console.error("Error resending verification:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await api.post('/auth/verify-token', { token });
    return response.data;
  } catch (error) {
    console.error("Error verifying token:", error.response?.data || error.message);
    throw error;
  }
};

// -----------------
// Role & Profile
// -----------------
export const fetchUserRole = async () => {
  try {
    const response = await api.get('/auth/role');
    return response.data.role;
  } catch (error) {
    console.error("Error fetching user role:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUserRole = async (role) => {
  try {
    const response = await api.put('/auth/role-update', { role });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUserProfile = async (updatedData) => {
  try {
    const formData = new FormData();
    formData.append('username', updatedData.username);
    formData.append('email', updatedData.email);

    if (updatedData.image && typeof updatedData.image === 'string') {
      formData.append('imageUrl', updatedData.image);
    } else if (updatedData.image) {
      formData.append('image', updatedData.image);
    }

    const response = await api.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw error;
  }
};