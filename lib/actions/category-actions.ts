"use server";

import { getAllCategories, type Category } from "@/lib/api/category";

export interface GetAllCategoriesActionResult {
  success: boolean;
  message: string;
  data: Category[];
  total: number;
}

export const handleGetAllCategories =
  async (): Promise<GetAllCategoriesActionResult> => {
    try {
      const response = await getAllCategories();

      if (response.success) {
        const categories = response.data ?? [];

        return {
          success: true,
          message: response.message || "Categories fetched successfully",
          data: categories,
          total: response.total ?? categories.length,
        };
      }

      return {
        success: false,
        message: response.message || "Failed to fetch categories",
        data: [],
        total: 0,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Category fetch action failed",
        data: [],
        total: 0,
      };
    }
  };
