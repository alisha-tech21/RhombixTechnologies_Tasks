import api from "../api/axios";

export const bookingService = {
  // New booking create karne ke liye
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create booking" };
    }
  },

  // Logged-in user ki apni bookings dekhne ke liye
  getUserBookings: async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch user bookings" }
      );
    }
  },
};
