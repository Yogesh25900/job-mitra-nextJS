import axiosInstance from './axios'
import { API } from './endpoints'

export interface Category {
  _id: string
  name: string
  description?: string
  icon?: string
  color?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CategoryResponse {
  success: boolean
  data?: Category[]
  message?: string
  total?: number
}

/**
 * Fetch all active categories from backend
 * Backend: /api/categories GET
 */
export const getAllCategories = async (): Promise<CategoryResponse> => {
  try {
    console.log('[CATEGORY API] getAllCategories - Fetching categories')
    
    const response = await axiosInstance.get(API.CATEGORY.GETALL)
    
    console.log(' [CATEGORY API] getAllCategories - Success')
    return response.data
  } catch (error: any) {
    console.error(
      '[CATEGORY API] getAllCategories error:',
      error?.response?.status,
      error?.response?.data || error?.message
    )
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to fetch categories',
      data: [],
    }
  }
}

/**
 * Get a single category by ID
 * Backend: /api/categories/:id GET
 */
export const getCategoryById = async (
  categoryId: string
): Promise<CategoryResponse> => {
  try {
    console.log(' [CATEGORY API] getCategoryById - Fetching category:', categoryId)
    
    const response = await axiosInstance.get(API.CATEGORY.GETBYID(categoryId))
    
    console.log(' [CATEGORY API] getCategoryById - Success')
    return response.data
  } catch (error: any) {
    console.error(
      ' [CATEGORY API] getCategoryById error:',
      error?.response?.status,
      error?.response?.data || error?.message
    )
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to fetch category',
    }
  }
}
