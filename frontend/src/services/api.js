const API_BASE = '/api';

export const fetchStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Failed to fetch stats, falling back to defaults:', err);
    return {
      activeDonors: 1250,
      emergencySupport: '24/7',
      successRate: '98%',
      livesSaved: 2847
    };
  }
};

export const fetchCarouselPatients = async () => {
  try {
    const res = await fetch(`${API_BASE}/emergencies/carousel`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Failed to fetch carousel patients:', err);
    return [];
  }
};

export const fetchQuotes = async () => {
  try {
    const res = await fetch(`${API_BASE}/emergencies/quotes`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Failed to fetch quotes:', err);
    return [];
  }
};

export const registerUser = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Registration API error:', err);
    return {
      success: false,
      message: 'Failed to connect to registration server. Please try again.'
    };
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Login API error:', err);
    return {
      success: false,
      message: 'Failed to connect to login server. Please try again.'
    };
  }
};

export const detectIpLocation = async () => {
  try {
    const res = await fetch(`${API_BASE}/location/detect`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('IP location detection error:', err);
    return { success: false, message: err.message };
  }
};

export const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(`${API_BASE}/location/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Reverse geocode error:', err);
    return { success: false, message: err.message };
  }
};

export const fetchEmergencyRequests = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.bloodType) params.append('bloodType', filters.bloodType);
    if (filters.city) params.append('city', filters.city);
    const res = await fetch(`${API_BASE}/emergencies?${params.toString()}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Fetch emergency requests error:', err);
    return [];
  }
};

export const createEmergencyRequest = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/emergencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Create emergency request error:', err);
    return { success: false, message: 'Failed to create emergency request.' };
  }
};

export const fetchDonors = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
    if (filters.city) params.append('city', filters.city);
    if (filters.availableOnly) params.append('availableOnly', filters.availableOnly);
    const res = await fetch(`${API_BASE}/donors?${params.toString()}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Fetch donors error:', err);
    return [];
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const res = await fetch(`${API_BASE}/auth/profile/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Update profile error:', err);
    return { success: false, message: 'Failed to update profile.' };
  }
};

