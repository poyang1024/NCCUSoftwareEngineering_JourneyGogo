import axios from 'axios'
import { User } from '../models/user'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class AuthService {
  async register(user: User) {
    const response = await axios.post(API_URL + 'users', user)
    return response.data
  }

  async login(data: FormData) {
    const response = await axios.post(API_URL + 'login/access-token', data)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
    }
    return response.data
  }

  async sendResetPwdURL(input: object){
    const response = await axios.post(API_URL + `login/forget-password`, input)
    return response.data
  }
  
  async resetPassword(input: object, id: string, token: string){
    const response = await axios.post(API_URL + `login/reset-password/${id}/${token}`, input)
    return response.data
  }

  async refreshToken() {
    const response = await axios.get(API_URL + 'login/refresh-token', { withCredentials: true })
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
    }
    return response.data
  }

  async verifyPassword(input: object) {
    const response = await axios.post(API_URL + 'users/verifyPassword', input)
    return response.data
  }

  logout() {
    localStorage.removeItem('token')
  }

  getGoogleLoginUrl() {
    return API_URL + 'login/google'
  }

  getFacebookLoginUrl() {
    return API_URL + 'login/facebook'
  }

  // 新增檢查電子郵件是否已註冊的方法
  async checkEmail(email: string) {
    try {
      const response = await axios.get(API_URL + 'users/check-email', {
        params: { email }
      });
      return response.data; // 將包含 is_registered: true 或 false
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  }

}

export default new AuthService()
