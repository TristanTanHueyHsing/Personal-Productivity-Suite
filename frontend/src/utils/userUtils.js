// Helper function to get user ID from localStorage
export const getUserId = () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
        // If no user ID, redirect to login
        window.location.href = '/';
        return null;
    }
    return parseInt(userId);
};

// Helper function to get username
export const getUsername = () => {
    return localStorage.getItem('username') || 'User';
};

// Helper function to get email
export const getEmail = () => {
    return localStorage.getItem('email') || '';
};

// Helper function to check if user is logged in
export const isLoggedIn = () => {
    return localStorage.getItem('user_id') !== null;
};

// Enhanced API call helper that automatically includes user_id
export const apiCall = async (endpoint, options = {}) => {
    const userId = getUserId();
    if (!userId) {
        throw new Error('User not logged in');
    }
    
    // Automatically append user_id to endpoints that need it
    let url = `http://localhost:8000/api${endpoint}`;
    
    // For endpoints that need user_id in the URL
    if (endpoint.includes('{user_id}')) {
        url = url.replace('{user_id}', userId);
    } else if (endpoint.startsWith('/notes') || endpoint.startsWith('/todos') || 
               endpoint.startsWith('/journals') || endpoint.startsWith('/pomodoro/session') ||
               endpoint.startsWith('/pomodoro/daily-stats') || endpoint.startsWith('/pomodoro/history')) {
        // Add user_id to URL for these endpoints
        url = url.replace('/notes', `/notes/${userId}`)
                 .replace('/todos', `/todos/${userId}`)
                 .replace('/journals', `/journals/${userId}`)
                 .replace('/pomodoro/session', `/pomodoro/session/${userId}`)
                 .replace('/pomodoro/daily-stats', `/pomodoro/daily-stats/${userId}`)
                 .replace('/pomodoro/history', `/pomodoro/history/${userId}`);
    } else if (endpoint.startsWith('/profile')) {
        // Add user_id to profile endpoints
        url = url.replace('/profile', `/profile/${userId}`);
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (response.status === 401 || response.status === 404) {
        // Session expired or user not found, redirect to login
        localStorage.clear();
        window.location.href = '/';
        throw new Error('Session expired');
    }
    
    return response;
};

// Logout function
export const logout = () => {
    localStorage.clear();
    window.location.href = '/';
};