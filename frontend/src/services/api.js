const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
    getUserId() {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            // If no user ID, redirect to login
            window.location.href = '/';
            throw new Error('User not logged in');
        }
        return parseInt(userId);
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle authentication/authorization errors
                if (response.status === 401 || response.status === 404) {
                    localStorage.clear();
                    window.location.href = '/';
                }
                throw new Error(data.detail || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // Profile endpoints
    async getProfile() {
        const userId = this.getUserId();
        return this.request(`/profile/${userId}`);
    }

    async updateProfile(profileData) {
        const userId = this.getUserId();
        return this.request(`/profile/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async changePassword(passwordData) {
        const userId = this.getUserId();
        return this.request(`/profile/${userId}/password`, {
            method: 'PUT',
            body: JSON.stringify(passwordData),
        });
    }

    async deleteProfile() {
        const userId = this.getUserId();
        return this.request(`/profile/${userId}`, {
            method: 'DELETE',
        });
    }

    // Authentication endpoints (these don't need user ID)
    async login(credentials) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(userData) {
        return this.request('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async resetPassword(resetData) {
        return this.request('/reset-password', {
            method: 'POST',
            body: JSON.stringify(resetData),
        });
    }

    // Notes endpoints
    async getNotes() {
        const userId = this.getUserId();
        return this.request(`/notes/${userId}`);
    }

    async createNote(noteData) {
        const userId = this.getUserId();
        return this.request(`/notes/${userId}`, {
            method: 'POST',
            body: JSON.stringify(noteData),
        });
    }

    async updateNote(noteId, noteData) {
        return this.request(`/notes/${noteId}`, {
            method: 'PUT',
            body: JSON.stringify(noteData),
        });
    }

    async deleteNote(noteId) {
        return this.request(`/notes/${noteId}`, {
            method: 'DELETE',
        });
    }

    // Todos endpoints
    async getTodos() {
        const userId = this.getUserId();
        return this.request(`/todos/${userId}`);
    }

    async createTodo(todoData) {
        const userId = this.getUserId();
        return this.request(`/todos/${userId}`, {
            method: 'POST',
            body: JSON.stringify(todoData),
        });
    }

    async updateTodo(todoId, todoData) {
        return this.request(`/todos/${todoId}`, {
            method: 'PUT',
            body: JSON.stringify(todoData),
        });
    }

    async deleteTodo(todoId) {
        return this.request(`/todos/${todoId}`, {
            method: 'DELETE',
        });
    }

    // Journal endpoints
    async getJournals() {
        const userId = this.getUserId();
        return this.request(`/journals/${userId}`);
    }

    async createJournal(journalData) {
        const userId = this.getUserId();
        return this.request(`/journals/${userId}`, {
            method: 'POST',
            body: JSON.stringify(journalData),
        });
    }

    async updateJournal(journalId, journalData) {
        return this.request(`/journals/entry/${journalId}`, {
            method: 'PUT',
            body: JSON.stringify(journalData),
        });
    }

    async deleteJournal(journalId) {
        return this.request(`/journals/entry/${journalId}`, {
            method: 'DELETE',
        });
    }

    // Pomodoro endpoints
    async createOrGetDailySession() {
        const userId = this.getUserId();
        return this.request(`/pomodoro/session/${userId}`, {
            method: 'POST',
        });
    }

    async completeFocusSession(sessionId) {
        return this.request(`/pomodoro/session/${sessionId}/complete-focus`, {
            method: 'PUT',
        });
    }

    async getDailyStats(targetDate = null) {
        const userId = this.getUserId();
        const endpoint = targetDate
            ? `/pomodoro/daily-stats/${userId}?target_date=${targetDate}`
            : `/pomodoro/daily-stats/${userId}`;
        return this.request(endpoint);
    }

    async getPomodoroHistory(limit = 30) {
        const userId = this.getUserId();
        return this.request(`/pomodoro/history/${userId}?limit=${limit}`);
    }
}

const apiService = new ApiService();

export default apiService;