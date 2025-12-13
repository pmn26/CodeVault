import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost/CodeVault/codevault/codevault-backend/api",
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;