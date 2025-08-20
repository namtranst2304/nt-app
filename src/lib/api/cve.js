// CVE API service
const BASE_URL = 'http://localhost:8080/api/v1';

export const cveApi = {
  // Get all CVE vulnerabilities
  getAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}/cve`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching CVE list:', error);
      throw error;
    }
  },

  // Get mock CVE data
  getMockData: async () => {
    try {
      const response = await fetch(`${BASE_URL}/cve/mock`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching CVE mock data:', error);
      throw error;
    }
  },

  // Get CVE by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/cve/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching CVE ${id}:`, error);
      throw error;
    }
  },

  // Get CVE statistics
  getStats: async () => {
    try {
      const response = await fetch(`${BASE_URL}/cve/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching CVE statistics:', error);
      throw error;
    }
  },

  // Create new CVE
  create: async (cveData) => {
    try {
      const response = await fetch(`${BASE_URL}/cve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cveData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating CVE:', error);
      throw error;
    }
  },

  // Update CVE
  update: async (id, updateData) => {
    try {
      const response = await fetch(`${BASE_URL}/cve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating CVE ${id}:`, error);
      throw error;
    }
  },

  // Delete CVE
  delete: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/cve/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error deleting CVE ${id}:`, error);
      throw error;
    }
  },
};
