import { apiClient } from "./api"
import { API_ENDPOINTS } from "./constants"
import { UserProfile, UserProfileUpdate, UserSubscriptionUpdate } from "./types"

export class UserService {
  /**
   * Get all users
   */
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.USERS)
      
      // Handle different response structures
      if (Array.isArray(response)) {
        return response
      } else if (response && Array.isArray(response.data)) {
        return response.data
      } else if (response && Array.isArray(response.users)) {
        return response.users
      } else if (response && Array.isArray(response.items)) {
        return response.items
      } else {
        console.warn('Unexpected API response structure:', response)
        return []
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  /**
   * Get user by Auth0 ID
   */
  static async getUserByAuth0Id(auth0Id: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(`${API_ENDPOINTS.USERS}/${auth0Id}`)
      return response
    } catch (error) {
      console.error('Error fetching user:', error)
      throw new Error('Failed to fetch user')
    }
  }

  /**
   * Update user profile (extended profile)
   */
  static async updateUserProfile(auth0Id: string, profileData: UserProfileUpdate): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>(
        API_ENDPOINTS.USER_PROFILE(auth0Id),
        profileData
      )
      return response
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Failed to update user profile')
    }
  }

  /**
   * Update user subscription and basic info
   */
  static async updateUserSubscription(auth0Id: string, subscriptionData: UserSubscriptionUpdate): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>(
        API_ENDPOINTS.USER_SUBSCRIPTION(auth0Id),
        subscriptionData
      )
      return response
    } catch (error) {
      console.error('Error updating user subscription:', error)
      throw new Error('Failed to update user subscription')
    }
  }

  /**
   * Get user subscription status
   */
  static async getUserSubscriptionStatus(auth0Id: string): Promise<{ subscriptionStatus: string }> {
    try {
      const response = await apiClient.get<{ subscriptionStatus: string }>(
        API_ENDPOINTS.USER_SUBSCRIPTION_STATUS(auth0Id)
      )
      return response
    } catch (error) {
      console.error('Error fetching subscription status:', error)
      throw new Error('Failed to fetch subscription status')
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(auth0Id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.USERS}/${auth0Id}`)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Failed to delete user')
    }
  }

  /**
   * Create new user (if needed)
   */
  static async createUser(userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.post<UserProfile>(API_ENDPOINTS.USERS, userData)
      return response
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }
  }

  /**
   * Search users by various criteria
   */
  static async searchUsers(query: string): Promise<UserProfile[]> {
    try {
      const allUsers = await this.getAllUsers()
      return allUsers.filter(user => 
        user.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        user.phoneNumber?.includes(query) ||
        user.city?.toLowerCase().includes(query.toLowerCase()) ||
        user.stripeCustomerId?.toLowerCase().includes(query.toLowerCase()) ||
        user.subscriptionStatus?.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error('Error searching users:', error)
      throw new Error('Failed to search users')
    }
  }

  /**
   * Get users by subscription status
   */
  static async getUsersBySubscriptionStatus(status: string): Promise<UserProfile[]> {
    try {
      const allUsers = await this.getAllUsers()
      return allUsers.filter(user => user.subscriptionStatus === status)
    } catch (error) {
      console.error('Error filtering users by status:', error)
      throw new Error('Failed to filter users by status')
    }
  }

  /**
   * Get users by food preference
   */
  static async getUsersByFoodPreference(preference: string): Promise<UserProfile[]> {
    try {
      const allUsers = await this.getAllUsers()
      return allUsers.filter(user => user.foodPreference === preference)
    } catch (error) {
      console.error('Error filtering users by food preference:', error)
      throw new Error('Failed to filter users by food preference')
    }
  }
}
