import api from "../api/axios";

export const propertyService = {
  // Saari properties laane ke liye
  getAllProperties: async () => {
    try {
      const response = await api.get("/properties");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch properties" };
    }
  },

  // Single property ki details ID se laane ke liye
  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch property details" }
      );
    }
  },

  // Properties search ya filter karne ke liye
  searchProperties: async (searchParams) => {
    try {
      const response = await api.get("/properties/search", {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to search properties" };
    }
  },
};
