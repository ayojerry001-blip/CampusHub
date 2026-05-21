const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    })
    return this.handleResponse(response)
  }

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    })
    return this.handleResponse(response)
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Event endpoints
  async getEvents(params?: { status?: string; category?: string; search?: string; page?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append("status", params.status)
    if (params?.category) searchParams.append("category", params.category)
    if (params?.search) searchParams.append("search", params.search)
    if (params?.page) searchParams.append("page", params.page.toString())

    const response = await fetch(`${API_BASE_URL}/events?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async createEvent(eventData: any) {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    })
    return this.handleResponse(response)
  }

  async getEvent(id: string) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async updateEvent(id: string, eventData: any) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    })
    return this.handleResponse(response)
  }

  async approveEvent(id: string) {
    const response = await fetch(`${API_BASE_URL}/events/${id}/approve`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async rejectEvent(id: string, reason: string) {
    const response = await fetch(`${API_BASE_URL}/events/${id}/reject`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ rejection_reason: reason }),
    })
    return this.handleResponse(response)
  }

  async registerForEvent(id: string) {
    const response = await fetch(`${API_BASE_URL}/events/${id}/register`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getMyEvents() {
    const response = await fetch(`${API_BASE_URL}/my-events`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async getPendingEvents() {
    const response = await fetch(`${API_BASE_URL}/pending-events`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async deleteEvent(id: string) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // New: Get events the current user has registered for
  async getRegisteredEvents() {
    const response = await fetch(`${API_BASE_URL}/my-registrations`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Venue endpoints
  async getVenues() {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async createVenue(venueData: any) {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(venueData),
    })
    return this.handleResponse(response)
  }

  async updateVenue(id: string, venueData: any) {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(venueData),
    })
    return this.handleResponse(response)
  }

  async deleteVenue(id: string) {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async checkVenueAvailability(venueId: string, date: string, startTime: string, endTime: string) {
    const response = await fetch(
      `${API_BASE_URL}/venues/${venueId}/availability?date=${date}&start_time=${startTime}&end_time=${endTime}`,
      {
        headers: this.getAuthHeaders(),
      },
    )
    return this.handleResponse(response)
  }

  // Dashboard endpoints
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // User endpoints
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async updateUser(id: string, userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    })
    return this.handleResponse(response)
  }
}

export const apiService = new ApiService()
